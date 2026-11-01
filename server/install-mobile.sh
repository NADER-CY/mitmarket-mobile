#!/usr/bin/env bash
set -euo pipefail
# Usage: sudo bash install-mobile.sh mobile.example.com
mobile_domain="${1:-}"
if [[ ! "$mobile_domain" =~ ^[A-Za-z0-9][A-Za-z0-9.-]+\.[A-Za-z]{2,}$ ]]; then echo 'Usage: sudo bash install-mobile.sh mobile.example.com'; exit 2; fi
if [[ "$(id -u)" != 0 ]]; then echo 'Run this installer with sudo.'; exit 2; fi
command -v nginx >/dev/null || { echo 'Nginx is required. Install it first.'; exit 2; }
package_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
[[ -f "$package_dir/dist/index.html" ]] || { echo 'dist/index.html is missing.'; exit 2; }
release_id="$(date -u +%Y%m%dT%H%M%SZ)"
site_base=/var/www/mitmarket-mobile
release_dir="$site_base/releases/$release_id"
mkdir -p "$release_dir"
cp -a "$package_dir/dist/." "$release_dir/"
chmod -R a+rX "$release_dir"
config_path=/etc/nginx/sites-available/mitmarket-mobile
backup_path="${config_path}.backup-${release_id}"
previous_link="$(readlink "$site_base/current" 2>/dev/null || true)"
if [[ -f "$config_path" ]]; then cp -a "$config_path" "$backup_path"; fi
python3 - "$mobile_domain" "$config_path" <<'PY'
import sys,re
from pathlib import Path
domain,path=sys.argv[1:]
if Path(path).exists():
    existing=Path(path).read_text()
    names=' '.join(re.findall(r'server_name\s+([^;]+);',existing)).split()
    if domain not in names:
        raise SystemExit('Existing mobile config uses a different domain; no config was changed.')
    updated,count=re.subn(r'(?m)^(\s*)root\s+[^;]+;',r'\1root /var/www/mitmarket-mobile/current;',existing)
    if not count: raise SystemExit('Existing config has no root directive; no config was changed.')
    Path(path).write_text(updated)
    sys.exit(0)
Path(path).write_text('''server {
    listen 80;
    server_name DOMAIN_PLACEHOLDER;
    root /var/www/mitmarket-mobile/current;
    index index.html;
    gzip on;
    gzip_types text/css application/javascript application/json image/svg+xml;
    gzip_min_length 1024;
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        try_files $uri =404;
    }
    location / {
        add_header Cache-Control "no-cache";
        try_files $uri $uri/ /index.html;
    }
}
'''.replace('DOMAIN_PLACEHOLDER',domain))
PY
ln -sfn "$config_path" /etc/nginx/sites-enabled/mitmarket-mobile
if ! nginx -t; then
    if [[ -f "$backup_path" ]]; then cp -a "$backup_path" "$config_path"; else rm -f /etc/nginx/sites-enabled/mitmarket-mobile "$config_path"; fi
    echo 'Nginx validation failed; previous config restored. Existing live release was not changed.'
    exit 1
fi
ln -sfn "$release_dir" "$site_base/current.next"
mv -Tf "$site_base/current.next" "$site_base/current"
if ! systemctl reload nginx; then
    if [[ -n "$previous_link" ]]; then ln -sfn "$previous_link" "$site_base/current"; fi
    if [[ -f "$backup_path" ]]; then cp -a "$backup_path" "$config_path"; fi
    echo 'Reload failed; previous release restored when available.'
    exit 1
fi
printf 'Mobile installed: http://%s\nRelease: %s\n' "$mobile_domain" "$release_dir"
printf 'HTTPS is required for production use. Configure TLS for this subdomain before launch.\n'
