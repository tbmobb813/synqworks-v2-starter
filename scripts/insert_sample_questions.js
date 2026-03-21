#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

function loadEnv(file) {
  const p = path.resolve(file);
  if (!fs.existsSync(p)) return {};
  return fs.readFileSync(p, 'utf8').split(/\n+/).reduce((acc, line) => {
    const m = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
    if (!m) return acc;
    let v = m[2];
    if (v.startsWith('"') && v.endsWith('"')) v = v.slice(1, -1);
    if (v.startsWith("'") && v.endsWith("'")) v = v.slice(1, -1);
    acc[m[1]] = v;
    return acc;
  }, {});
}

async function main() {
  const env = loadEnv(path.join(__dirname, '..', '.env.local'));
  const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const SERVICE_ROLE = env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!SUPABASE_URL || !SERVICE_ROLE) {
    console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local or environment');
    process.exit(2);
  }

  const endpoint = `${SUPABASE_URL.replace(/\/$/, '')}/rest/v1/assessment_questions`;
  const ANON_KEY = env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const rows = [
    {
      id: 'b2000000-0000-0000-0000-000000000001',
      skill_id: 'a1000000-0000-0000-0000-000000000001',
      question_text: 'A team member repeatedly misses deadlines due to unclear requirements. Your first step?',
      context: null,
      options: [
        { label: 'Fire them immediately.', score: 1, explanation: 'Too punitive without coaching.' },
        { label: 'Clarify requirements and offer coaching.', score: 5, explanation: 'Diagnose then remediate.' }
      ],
      sort_order: 1001
    },
    {
      id: 'b2000000-0000-0000-0000-000000000002',
      skill_id: 'a1000000-0000-0000-0000-000000000002',
      question_text: 'Two colleagues are arguing in public. What do you do first?',
      context: null,
      options: [
        { label: 'Ignore and hope it stops.', score: 1, explanation: 'Avoids the issue.' },
        { label: 'Move the conversation to private and mediate.', score: 5, explanation: 'Contain and resolve.' }
      ],
      sort_order: 1002
    },
    {
      id: 'b2000000-0000-0000-0000-000000000003',
      skill_id: 'a1000000-0000-0000-0000-000000000003',
      question_text: 'An employee requests accommodation for a documented condition. Next step?',
      context: null,
      options: [
        { label: 'Deny because budget is tight.', score: 1, explanation: 'Non-compliant.' },
        { label: 'Document and follow accommodation process.', score: 5, explanation: 'Correct compliance approach.' }
      ],
      sort_order: 1003
    },
    {
      id: 'b2000000-0000-0000-0000-000000000004',
      skill_id: 'a1000000-0000-0000-0000-000000000006',
      question_text: 'You plan to pilot an AI tool for screening resumes. What safeguard do you require?',
      context: null,
      options: [
        { label: 'No safeguards — ship it fast.', score: 1, explanation: 'Rushed and risky.' },
        { label: 'Implement explainability and human review.', score: 5, explanation: 'Responsible rollout.' }
      ],
      sort_order: 1004
    }
  ];

  console.log('Inserting', rows.length, 'sample questions to', endpoint);

  async function tryInsert(headers) {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: Object.assign({ 'Content-Type': 'application/json', Prefer: 'return=representation' }, headers),
      body: JSON.stringify(rows)
    });
    return res;
  }

  try {
    // First try: service role with both required headers to bypass RLS
    let res = await tryInsert({ apikey: SERVICE_ROLE, Authorization: `Bearer ${SERVICE_ROLE}` });
    if (res.status === 401 && ANON_KEY) {
      // fallback: use anon key in both apikey and Authorization
      console.log('Service role insert rejected; retrying with anon key');
      res = await tryInsert({ apikey: ANON_KEY, Authorization: `Bearer ${ANON_KEY}` });
    }

    if (!res.ok) {
      const txt = await res.text();
      console.error('Insert failed:', res.status, res.statusText, txt);
      process.exit(3);
    }
    const data = await res.json();
    console.log('Inserted rows:', data.length);
    data.forEach((r) => console.log(r.id, '-', r.question_text));
  } catch (err) {
    console.error('Request error:', err && err.message ? err.message : err);
    process.exit(4);
  }
}

main();
