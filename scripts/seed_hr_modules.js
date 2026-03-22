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

  // Training modules data
  const modules = [
    {
      id: '10000000-0000-0000-0000-000000000001',
      skill_id: '00000000-0000-0000-0000-000000000001',
      title: 'OSHA Basics: Workplace Safety',
      description: 'Learn the essentials of OSHA compliance and how to identify workplace hazards.',
      difficulty: 2,
      estimated_mins: 15,
      xp_reward: 100,
      config: { type: 'micro_drill', nodes: { start: { text: 'What is the first step in addressing a reported safety hazard?', options: [ { label: 'Investigate immediately', next_node: 'correct', impact: { trust: 5, compliance: 10, budget: 0 }, explanation: 'Prompt investigation is required by OSHA.' }, { label: 'Wait for a pattern to emerge', next_node: 'incorrect', impact: { trust: -5, compliance: -10, budget: 0 }, explanation: 'Delays can result in non-compliance.' } ] } }, initial_node: 'start' },
      is_active: true
    },
    {
      id: '10000000-0000-0000-0000-000000000002',
      skill_id: '00000000-0000-0000-0000-000000000002',
      title: 'Building an Inclusive Culture',
      description: 'Strategies and legal requirements for fostering diversity and inclusion.',
      difficulty: 3,
      estimated_mins: 20,
      xp_reward: 120,
      config: { type: 'micro_drill', nodes: { start: { text: 'A candidate requests a religious accommodation. What should you do?', options: [ { label: 'Deny the request', next_node: 'incorrect', impact: { trust: -10, compliance: -20, budget: 0 }, explanation: 'Title VII requires reasonable accommodation.' }, { label: 'Engage in interactive process', next_node: 'correct', impact: { trust: 10, compliance: 20, budget: 0 }, explanation: 'Best practice and legal requirement.' } ] } }, initial_node: 'start' },
      is_active: true
    },
    {
      id: '10000000-0000-0000-0000-000000000003',
      skill_id: '00000000-0000-0000-0000-000000000004',
      title: 'Preventing Workplace Harassment',
      description: 'Recognize, prevent, and respond to harassment in the workplace.',
      difficulty: 2,
      estimated_mins: 15,
      xp_reward: 100,
      config: { type: 'micro_drill', nodes: { start: { text: 'An employee reports harassment. What is your first obligation?', options: [ { label: 'Investigate promptly', next_node: 'correct', impact: { trust: 10, compliance: 20, budget: 0 }, explanation: 'Prompt investigation is required by EEOC guidance.' }, { label: 'Ignore unless repeated', next_node: 'incorrect', impact: { trust: -10, compliance: -20, budget: 0 }, explanation: 'All complaints must be taken seriously.' } ] } }, initial_node: 'start' },
      is_active: true
    },
    {
      id: '10000000-0000-0000-0000-000000000004',
      skill_id: '00000000-0000-0000-0000-000000000003',
      title: 'FMLA: Managing Leave Requests',
      description: 'How to handle employee leave under the Family and Medical Leave Act.',
      difficulty: 3,
      estimated_mins: 20,
      xp_reward: 120,
      config: { type: 'micro_drill', nodes: { start: { text: 'An employee requests FMLA leave. What documentation do you need?', options: [ { label: 'Medical certification', next_node: 'correct', impact: { trust: 5, compliance: 10, budget: 0 }, explanation: 'FMLA requires medical certification for leave.' }, { label: 'No documentation needed', next_node: 'incorrect', impact: { trust: -5, compliance: -10, budget: 0 }, explanation: 'Proper documentation is required for compliance.' } ] } }, initial_node: 'start' },
      is_active: true
    }
  ]

  console.log('Inserting', modules.length, 'training modules...')
  const resp = await fetch(`${supabaseUrl}/rest/v1/training_modules`,{
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': serviceKey,
      'Authorization': `Bearer ${serviceKey}`,
      'Prefer': 'resolution=merge-duplicates',
    },
    body: JSON.stringify(modules)
  })
  const txt = await resp.text()
  console.log('Status', resp.status)
  console.log(txt)
}

main().catch(err=>{console.error(err); process.exit(1)})
