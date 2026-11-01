#!/usr/bin/env bash
set -euo pipefail
[[ $(id -u) == 0 ]] || { echo 'Run with sudo.'; exit 2; }
command -v curl >/dev/null
command -v python3 >/dev/null
update_tmp=$(mktemp -d)
trap 'rm -rf "$update_tmp"' EXIT
cd "$update_tmp"
curl --fail --silent --show-error --location https://api.github.com/repos/NADER-CY/mitmarket-mobile/releases/latest -o release.json
python3 - <<'PY'
import json
r=json.load(open('release.json'))
assets={a['name']:a['browser_download_url'] for a in r['assets']}
for name in ['mitmarket-mobile.tar.gz','mitmarket-mobile.tar.gz.sha256']:
    url=assets[name]
    if not url.startswith('https://github.com/NADER-CY/mitmarket-mobile/releases/download/'):
        raise SystemExit('Unexpected download URL')
    open(name+'.url','w').write(url)
PY
for name in mitmarket-mobile.tar.gz mitmarket-mobile.tar.gz.sha256; do
  curl --fail --silent --show-error --location "$(cat "$name.url")" -o "$name"
done
sha256sum -c mitmarket-mobile.tar.gz.sha256
mkdir unpack
tar -xzf mitmarket-mobile.tar.gz -C unpack
bash unpack/install-mobile.sh "${1:-mit.kipgoo.com}"
printf 'Installed commit: '
cat unpack/COMMIT
