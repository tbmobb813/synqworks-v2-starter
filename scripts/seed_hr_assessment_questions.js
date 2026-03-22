#!/usr/bin/env node
const fs = require('fs')
const path = require('path')

async function main(){
  const envPath = path.resolve(__dirname, '../.env.local')
  if(!fs.existsSync(envPath)){
    console.error('.env.local not found')
    process.exit(1)
  }
  const env = fs.readFileSync(envPath,'utf8').split('\n').filter(Boolean).reduce((acc,line)=>{
    const [k,v] = line.split('=')
    acc[k.trim()] = v && v.trim()
    return acc
  },{})
  const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY
  if(!supabaseUrl || !serviceKey){
    console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local')
    process.exit(1)
  }

  // Assessment questions data
  const questions = [
    {
      id: '20000000-0000-0000-0000-000000000001',
      skill_id: '00000000-0000-0000-0000-000000000001',
      question_text: 'What is the first step when an employee reports a safety hazard?',
      context: 'A warehouse worker reports a loose electrical wire.',
      options: [
        { label: 'Investigate immediately', score: 5, explanation: 'OSHA requires prompt investigation.' },
        { label: 'Wait for more reports', score: 1, explanation: 'Delays can result in non-compliance.' }
      ],
      sort_order: 1,
      is_active: true
    },
    {
      id: '20000000-0000-0000-0000-000000000002',
      skill_id: '00000000-0000-0000-0000-000000000002',
      question_text: 'How should you respond to a request for a religious accommodation?',
      context: 'A job applicant requests time off for a religious holiday.',
      options: [
        { label: 'Deny the request', score: 1, explanation: 'Title VII requires reasonable accommodation.' },
        { label: 'Engage in interactive process', score: 5, explanation: 'Best practice and legal requirement.' }
      ],
      sort_order: 2,
      is_active: true
    },
    {
      id: '20000000-0000-0000-0000-000000000003',
      skill_id: '00000000-0000-0000-0000-000000000004',
      question_text: 'What is your first obligation when an employee reports harassment?',
      context: 'An employee emails HR about inappropriate comments.',
      options: [
        { label: 'Investigate promptly', score: 5, explanation: 'Prompt investigation is required by EEOC guidance.' },
        { label: 'Ignore unless repeated', score: 1, explanation: 'All complaints must be taken seriously.' }
      ],
      sort_order: 3,
      is_active: true
    },
    {
      id: '20000000-0000-0000-0000-000000000004',
      skill_id: '00000000-0000-0000-0000-000000000003',
      question_text: 'What documentation is required for FMLA leave?',
      context: 'An employee requests leave for a medical procedure.',
      options: [
        { label: 'Medical certification', score: 5, explanation: 'FMLA requires medical certification for leave.' },
        { label: 'No documentation needed', score: 1, explanation: 'Proper documentation is required for compliance.' }
      ],
      sort_order: 4,
      is_active: true
    }
  ]

  console.log('Inserting', questions.length, 'assessment questions...')
  const resp = await fetch(`${supabaseUrl}/rest/v1/assessment_questions`,{
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': serviceKey,
      'Authorization': `Bearer ${serviceKey}`,
      'Prefer': 'resolution=merge-duplicates',
    },
    body: JSON.stringify(questions)
  })
  const txt = await resp.text()
  console.log('Status', resp.status)
  console.log(txt)
}

main().catch(err=>{console.error(err); process.exit(1)})
