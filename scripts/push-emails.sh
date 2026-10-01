#!/usr/bin/env bash
# Pushes the welcome emails (emails/welcome/*.lmx) to the Loops workflow "Welcome email (NL + EN)".
# Requires the Loops CLI, logged in to the StageCall team (`loops auth login`).
# Loops refuses to edit an email while its workflow is sending: pause the workflow in the Loops
# dashboard first, run this, then resume it.
# Usage: scripts/push-emails.sh          (both)   |   scripts/push-emails.sh nl   (one)
set -euo pipefail
cd "$(dirname "$0")/.."

# Workflow: https://app.loops.so/workflows/cmuphfnbq1lvw0j1rtbcv10ag
# It branches on the contact property `language` (set by app/api/subscribe/route.ts):
#   language = nl        → Dutch email
#   anything else/empty  → English email

push() {
  local lang=$1 id=$2 subject=$3 preview=$4
  loops email-messages update "$id" --force \
    --lmx-file "emails/welcome/welcome.$lang.lmx" --subject "$subject" --preview-text "$preview" \
    --from-name "StageCall" --from-email "welcome" --reply-to "chris@geekengo.nl" \
    --email-format styled > /dev/null
  loops email-messages guardian "$id"
  echo "✓ Updated $lang welcome email in Loops ($id)"
}

only=${1:-all}

[[ $only == all || $only == nl ]] && push nl cmuphh2mc1lfe0j07l2lqk234 \
  "Je staat op de lijst. Welkom bij StageCall" \
  "Je hoort als een van de eersten wanneer early access opent."

[[ $only == all || $only == en ]] && push en cmuphh30v0qxc0j01st74nu2f \
  "You're on the list. Welcome to StageCall" \
  "You'll be among the first to hear when early access opens."
true
