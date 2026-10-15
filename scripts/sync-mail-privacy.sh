#!/usr/bin/env bash
# Copies Vora Mail's privacy policy from the vora-mail repo into this site.
# /mail/privacy renders src/mail/privacy-policy.md at build time
# (tools/privacy-policy.ts strips the draft banner and the appendices).
#   scripts/sync-mail-privacy.sh [ref]    default ref: origin/main
set -euo pipefail
repo="${VORA_MAIL_REPO:-$(dirname "$0")/../../vora-mail}"
ref="${1:-origin/main}"
git -C "$repo" fetch --quiet origin
commit="$(git -C "$repo" rev-parse --short "$ref")"
out="$(dirname "$0")/../src/mail/privacy-policy.md"
{
  echo "<!-- Copied from vorash/vora-mail docs/privacy-policy.md at $commit ($ref) by scripts/sync-mail-privacy.sh. Edit it there, not here. -->"
  # The appendices are reviewer notes about the private repo; this repo is public.
  git -C "$repo" show "$commit:docs/privacy-policy.md" | sed '/^## Appendix A/,$d'
} > "$out"
echo "privacy-policy.md ← vora-mail $commit"
