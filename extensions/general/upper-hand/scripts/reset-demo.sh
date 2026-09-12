#!/usr/bin/env bash
# Reset the Upper Hand demo company from scratch: re-seed Konsult AB, keep the read-only API key alive,
# close FY2025 (so the disposition check can fire), plant the errors and controls.
# Run from the Accounted repo root with local Supabase up:  bash extensions/general/upper-hand/scripts/reset-demo.sh
set -euo pipefail
EMAIL="${UH_OWNER_EMAIL:-erik@hdng.ai}"
KEY_NAME="${UH_KEY_NAME:-Upper Hand reviewer (read-only)}"
PSQL=(docker exec supabase_db_accounted psql -U postgres -v ON_ERROR_STOP=1 -tA)
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "==> detach API key from the company (the seed deletes the company and the key would cascade)"
"${PSQL[@]}" -c "update public.api_keys set company_id=null where name='$KEY_NAME' and revoked_at is null;"

echo "==> re-seed demo companies for $EMAIL"
npx tsx scripts/seed-demo-account.ts "$EMAIL" --force 2>&1 | grep -vE "injected env|^\s*$" | tail -4

NEW_ID=$("${PSQL[@]}" -c "select c.id from public.companies c join public.company_members m on m.company_id=c.id join auth.users u on u.id=m.user_id where c.name='Konsult AB' and c.archived_at is null and u.email='$EMAIL' order by c.created_at desc limit 1;")
echo "==> new Konsult AB: $NEW_ID"

echo "==> re-attach API key and close FY2025"
"${PSQL[@]}" -c "update public.api_keys set company_id='$NEW_ID' where name='$KEY_NAME' and revoked_at is null;"
"${PSQL[@]}" -c "update public.fiscal_periods set is_closed=true, closed_at='2026-03-20T10:00:00Z' where company_id='$NEW_ID' and period_start='2025-01-01';"

echo "==> plant errors and controls"
rm -f "$HERE/plant-manifest.local.json"
npx tsx "$HERE/plant-errors.ts" 2>&1 | grep -vE "injected env" | tail -30

echo "==> sanity"
"${PSQL[@]}" -F' | ' -c "select l.account_number, round(sum(l.debit_amount-l.credit_amount)::numeric) net from public.journal_entry_lines l join public.journal_entries j on j.id=l.journal_entry_id where j.company_id='$NEW_ID' and l.account_number in ('1610','1660','2393','2893','5831','6071') group by 1 order by 1;"
"${PSQL[@]}" -c "select count(*) || ' rattelse rows' from public.journal_entry_rattelse_log where company_id='$NEW_ID';"
echo "done: $NEW_ID"
