#!/usr/bin/env bash
set -euo pipefail
commit="${1:-}"
checksum="${2:-}"
[[ "$commit" =~ ^[a-f0-9]{40}$ && "$checksum" =~ ^[a-f0-9]{64}$ ]] || exit 2
[[ $(id -u) == 0 ]] || { echo 'Deployment user must be root.'; exit 2; }
archive="/tmp/mitmarket-mobile-$commit.tar.gz"
printf '%s  %s\n' "$checksum" "$archive" | sha256sum -c -
release="/var/www/mitmarket-mobile/releases/${commit}-$(date -u +%Y%m%dT%H%M%SZ)"
mkdir -p "$release"
tar -xzf "$archive" -C "$release"
[[ -f "$release/dist/index.html" && "$(cat "$release/COMMIT")" == "$commit" ]] || exit 1
chmod -R a+rX "$release"
nginx -t
ln -s "$release/dist" /var/www/mitmarket-mobile/current.next
mv -Tf /var/www/mitmarket-mobile/current.next /var/www/mitmarket-mobile/current
rm -f "$archive"
echo "Mobile deployed: $commit"
