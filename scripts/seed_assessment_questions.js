#!/usr/bin/env node
const fs = require('fs')
const path = require('path')
const fetch = require('node-fetch')

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

  const seed = fs.readFileSync(path.resolve(__dirname,'../supabase/seed.sql'),'utf8')
  const m = seed.match(/insert into public.assessment_questions[\s\S]*?values([\s\S]*?);/i)
  if(!m){
    console.error('assessment_questions insert block not found')
    process.exit(1)
  }
  const tuplesBlock = m[1]

  // Robust parser for SQL tuples respecting single-quote doubling
  function parseString(s, i){
    // expect starting single quote at s[i]
    i++
    let out = ''
    while(i < s.length){
      if(s[i] === "'"){
        if(s[i+1] === "'"){
          out += "'"
          i += 2
          continue
        }
        i++
        break
      }
      out += s[i]
      i++
    }
    return { value: out, idx: i }
  }

  function skipWhitespace(s, i){ while(i < s.length && /\s/.test(s[i])) i++; return i }

  function parseTupleAt(s, i){
    i = skipWhitespace(s, i)
    if(s[i] !== '(') return null
    i++
    // id
    i = skipWhitespace(s, i)
    if(s[i] !== "'") throw new Error('Expected quote for id at '+i)
    let r = parseString(s, i)
    const id = r.value.replace(/''/g, "'")
    i = skipWhitespace(s, r.idx)
    if(s[i] !== ',') throw new Error('Expected comma after id at '+i)
    i++
    // skill_id
    i = skipWhitespace(s, i)
    if(s[i] !== "'") throw new Error('Expected quote for skill_id at '+i)
    r = parseString(s, i)
    const skill_id = r.value.replace(/''/g, "'")
    i = skipWhitespace(s, r.idx)
    if(s[i] !== ',') throw new Error('Expected comma after skill_id at '+i)
    i++
    // question_text
    i = skipWhitespace(s, i)
    if(s[i] !== "'") throw new Error('Expected quote for question_text at '+i)
    r = parseString(s, i)
    const question_text = r.value.replace(/''/g, "'")
    i = skipWhitespace(s, r.idx)
    if(s[i] !== ',') throw new Error('Expected comma after question_text at '+i)
    i++
    // context (NULL or '...')
    i = skipWhitespace(s, i)
    let context = null
    if(s.substr(i,4).toUpperCase() === 'NULL'){
      context = null
      i += 4
    } else if(s[i] === "'"){
      r = parseString(s, i)
      context = r.value.replace(/''/g, "'")
      i = r.idx
    } else {
      throw new Error('Unexpected context token at '+i)
    }
    i = skipWhitespace(s, i)
    if(s[i] !== ',') throw new Error('Expected comma after context at '+i)
    i++
    // options (string)
    i = skipWhitespace(s, i)
    if(s[i] !== "'") throw new Error('Expected quote for options at '+i)
    r = parseString(s, i)
    const optionsRaw = r.value.replace(/''/g, "'")
    i = skipWhitespace(s, r.idx)
    if(s[i] !== ',') throw new Error('Expected comma after options at '+i)
    i++
    // sort_order (number)
    i = skipWhitespace(s, i)
    const numMatch = s.substr(i).match(/^([0-9]+)/)
    if(!numMatch) throw new Error('Expected number for sort_order at '+i)
    const sort_order = Number(numMatch[1])
    i += numMatch[1].length
    i = skipWhitespace(s, i)
    if(s[i] !== ')') throw new Error('Expected closing ) at '+i)
    i++
    return { row: { id, skill_id, question_text, context, optionsRaw, sort_order }, idx: i }
  }

  const rows = []
  let pos = 0
  while(true){
    pos = tuplesBlock.indexOf('(', pos)
    if(pos === -1) break
    try{
      const parsed = parseTupleAt(tuplesBlock, pos)
      if(!parsed) break
      let options
      try{
        options = JSON.parse(parsed.row.optionsRaw)
      }catch(e){
        console.error('Failed to parse options JSON for id', parsed.row.id, e)
        process.exit(1)
      }
      rows.push({ id: parsed.row.id, skill_id: parsed.row.skill_id, question_text: parsed.row.question_text, context: parsed.row.context, options, sort_order: parsed.row.sort_order })
      pos = parsed.idx
    }catch(e){
      console.error('Parse error:', e.message)
      console.error('Context:', tuplesBlock.substr(pos, 300))
      process.exit(1)
    }
  }

  if(rows.length===0){
    console.error('No tuples parsed')
    process.exit(1)
  }

  console.log('Parsed', rows.length, 'questions. Inserting...')
  const resp = await fetch(`${supabaseUrl}/rest/v1/assessment_questions`,{
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': serviceKey,
      'Authorization': `Bearer ${serviceKey}`,
      'Prefer': 'resolution=merge-duplicates',
    },
    body: JSON.stringify(rows)
  })
  const txt = await resp.text()
  console.log('Status', resp.status)
  console.log(txt)
}

main().catch(err=>{console.error(err); process.exit(1)})
