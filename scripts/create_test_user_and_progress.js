#!/usr/bin/env node
const fs = require('fs')
const path = require('path')

function loadEnv(file) {
  const p = path.resolve(file)
  if (!fs.existsSync(p)) return {}
  return fs.readFileSync(p, 'utf8').split(/\n+/).reduce((acc, line) => {
    const m = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/)
    if (!m) return acc
    let v = m[2]
    if (v.startsWith('"') && v.endsWith('"')) v = v.slice(1, -1)
    if (v.startsWith("'") && v.endsWith("'")) v = v.slice(1, -1)
    acc[m[1]] = v
    return acc
  }, {})
}

const env = loadEnv(path.join(__dirname, '..', '.env.local'))
const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_ROLE = env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY

function previewKey(k, head = 6, tail = 6) {
  if (!k) return 'not set'
  if (k.length <= head + tail + 3) return k
  return `${k.slice(0, head)}...${k.slice(-tail)}`
}

console.log('SUPABASE_URL:', previewKey(SUPABASE_URL, 10, 10))
console.log('SUPABASE_SERVICE_ROLE_KEY preview:', previewKey(SERVICE_ROLE, 6, 6))

if (!SUPABASE_URL || !SERVICE_ROLE) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local or environment')
  process.exit(2)
}

async function createUser(email, password) {
  const url = `${SUPABASE_URL.replace(/\/$/, '')}/auth/v1/admin/users`
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: SERVICE_ROLE,
      Authorization: `Bearer ${SERVICE_ROLE}`,
    },
    body: JSON.stringify({ email, password, email_confirm: true }),
  })

  const txt = await res.text()
  try { return JSON.parse(txt) } catch { return { error: txt, status: res.status } }
}

async function getSkills() {
  const url = `${SUPABASE_URL.replace(/\/$/, '')}/rest/v1/skills?select=id,name`
  const res = await fetch(url, { headers: { apikey: SERVICE_ROLE, Authorization: `Bearer ${SERVICE_ROLE}` } })
  if (!res.ok) throw new Error('Failed to fetch skills: ' + await res.text())
  return res.json()
}

async function insertProgress(rows) {
  const url = `${SUPABASE_URL.replace(/\/$/, '')}/rest/v1/user_progress`
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: SERVICE_ROLE,
      Authorization: `Bearer ${SERVICE_ROLE}`,
      Prefer: 'return=representation',
    },
    body: JSON.stringify(rows),
  })
  const txt = await res.text()
  if (!res.ok) throw new Error('Insert failed: ' + res.status + ' ' + txt)
  return JSON.parse(txt)
}

async function main() {
  const email = `test+robot+${Date.now()}@example.com`
  const password = 'Test1234!'
  console.log('Creating user', email)
  const created = await createUser(email, password)
  if (created?.id) {
    console.log('Created user id:', created.id)
  } else if (created?.status === 400 && created?.message && String(created.message).includes('User already exists')) {
    console.log('User exists, continuing')
  } else if (created?.error) {
    console.error('Create user error:', created)
    process.exit(3)
  }

  // Try to retrieve the user id via admin users list
  const lookupUrl = `${SUPABASE_URL.replace(/\/$/, '')}/auth/v1/admin/users?email=${encodeURIComponent(email)}`
  const lookupRes = await fetch(lookupUrl, { headers: { apikey: SERVICE_ROLE, Authorization: `Bearer ${SERVICE_ROLE}` } })
  if (!lookupRes.ok) {
    console.error('Failed to lookup user:', await lookupRes.text())
    process.exit(4)
  }
  const users = await lookupRes.json()
  const user = Array.isArray(users) ? users[0] : users
  if (!user || !user.id) {
    console.error('User lookup returned no id', users)
    process.exit(5)
  }

  const userId = user.id
  console.log('Using user id:', userId)

  const skills = await getSkills()
  // Build progress: set People Operations low (4), others 70
  const rows = skills.map((s) => ({
    user_id: userId,
    skill_id: s.id,
    competency_score: s.name === 'People Operations' ? 4 : 70,
    last_activity_at: new Date().toISOString(),
  }))

  console.log('Inserting', rows.length, 'user_progress rows')
  const inserted = await insertProgress(rows)
  console.log('Inserted progress rows:', inserted.map(r => ({ skill_id: r.skill_id, competency_score: r.competency_score })))
  console.log('\nTest user created and progress inserted. You can sign in with:')
  console.log('  email:', email)
  console.log('  password:', password)
}

main().catch(err => { console.error(err); process.exit(99) })
