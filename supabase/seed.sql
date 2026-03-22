-- ============================================
-- SynqWorks v2 Seed Data
-- Run AFTER schema.sql in Supabase SQL editor
-- ============================================

-- ============================================
-- SKILLS
-- 6 core HR leadership competency areas
-- ============================================

insert into public.skills (id, name, category, description, sort_order) values
(
  'a1000000-0000-0000-0000-000000000001',
  'People Operations',
  'Core HR',
  'Managing talent pipelines, performance cycles, and employee lifecycle decisions.',
  1
),
(
  'a1000000-0000-0000-0000-000000000002',
  'Conflict Resolution',
  'Core HR',
  'De-escalating disputes, mediating between stakeholders, and rebuilding trust.',
  2
),
(
  'a1000000-0000-0000-0000-000000000003',
  'Regulatory Compliance',
  'Risk & Legal',
  'Navigating labor law, accommodation requirements, and documentation obligations.',
  3
),
(
  'a1000000-0000-0000-0000-000000000004',
  'Strategic Budgeting',
  'Strategy',
  'Allocating HR spend for maximum ROI, managing cuts without destroying culture.',
  4
),
(
  'a1000000-0000-0000-0000-000000000005',
  'DEI Strategy',
  'Culture',
  'Building equitable systems, managing representation gaps, and navigating sensitive conversations.',
  5
),
(
  'a1000000-0000-0000-0000-000000000006',
  'HR Tech Fluency',
  'Technology',
  'Leveraging HRIS data, evaluating AI tools, and moving from descriptive to predictive reporting.',
  6
);


-- ============================================
-- ASSESSMENT QUESTIONS
-- 2 per skill = 12 total
-- options jsonb: [{label, score, explanation}]
-- score 1-5 maps to novice-expert
-- ============================================

insert into public.assessment_questions
  (id, skill_id, question_text, context, options, sort_order)
values

-- ---- People Operations Q1 ----
(
  'b1000000-0000-0000-0000-000000000001',
  'a1000000-0000-0000-0000-000000000001',
  'A high-performing team lead consistently arrives 15 minutes late to all-hands meetings but exceeds every KPI. How do you respond?',
  null,
  '[
    {"label": "Ignore it — results are all that matter.", "score": 1, "explanation": "Ignoring behavior that affects team norms sets a precedent that KPIs excuse everything, which erodes culture over time."},
    {"label": "Issue a formal written warning immediately.", "score": 2, "explanation": "A formal warning before a conversation skips due process and damages trust."},
    {"label": "Ask the team anonymously whether it bothers them before acting.", "score": 3, "explanation": "Gathering team sentiment is useful but shifts ownership away from you as the HR leader."},
    {"label": "Have a private 1-on-1 to understand the root cause and discuss the team impact.", "score": 5, "explanation": "Correct. Understanding the why before acting protects both the relationship and team standards."}
  ]',
  1
),

-- ---- People Operations Q2 ----
(
  'b1000000-0000-0000-0000-000000000002',
  'a1000000-0000-0000-0000-000000000001',
  'Your time-to-hire metric has increased 40% over the last quarter. What is your first move?',
  null,
  '[
    {"label": "Post more job ads across more platforms immediately.", "score": 2, "explanation": "Adding volume to a broken pipeline just creates more noise without fixing the underlying issue."},
    {"label": "Lower the job requirements to increase the candidate pool.", "score": 1, "explanation": "Lowering standards creates downstream performance problems and higher turnover costs."},
    {"label": "Audit the bottleneck in your interview-to-offer pipeline using data.", "score": 5, "explanation": "Correct. Diagnosing the specific step causing delay is the only way to fix the right problem."},
    {"label": "Ask hiring managers to speed up their decision timelines.", "score": 3, "explanation": "Pressuring managers without data often creates rushed decisions and offer retractions."}
  ]',
  2
),

-- ---- Conflict Resolution Q3 ----
(
  'b1000000-0000-0000-0000-000000000003',
  'a1000000-0000-0000-0000-000000000002',
  'Two department heads are visibly arguing over budget allocation in a public Slack channel. What do you do?',
  null,
  '[
    {"label": "Delete the messages and hope it resolves itself.", "score": 1, "explanation": "Deleting messages without addressing the conflict guarantees it resurfaces — often worse."},
    {"label": "Post the company Code of Conduct in the channel as a soft warning.", "score": 3, "explanation": "Public signaling is passive and rarely changes behavior without direct follow-up."},
    {"label": "Side with the department head who generates more revenue.", "score": 2, "explanation": "Playing favorites based on revenue poisons the perception of HR fairness permanently."},
    {"label": "Move both parties to a private channel immediately and facilitate a mediated resolution.", "score": 5, "explanation": "Correct. Containing the conflict before it escalates publicly is the first priority, followed by structured mediation."}
  ]',
  3
),

-- ---- Conflict Resolution Q4 ----
(
  'b1000000-0000-0000-0000-000000000004',
  'a1000000-0000-0000-0000-000000000002',
  'An employee claims their manager is micromanaging them. The manager says the employee is unreliable. Both feel wronged.',
  null,
  '[
    {"label": "Tell the employee to toughen up — management is hard.", "score": 1, "explanation": "Dismissing the employee''s concern destroys psychological safety and signals HR is not a safe resource."},
    {"label": "Transfer the employee to a new team to avoid the conflict.", "score": 2, "explanation": "Transfer without resolution moves the problem, not solves it, and rewards avoidance behavior."},
    {"label": "Monitor their Slack messages for a week to gather evidence.", "score": 1, "explanation": "Covert surveillance is a serious legal and ethical violation regardless of intent."},
    {"label": "Facilitate a structured expectations-alignment session with both parties present.", "score": 5, "explanation": "Correct. A facilitated session with clear outcomes creates mutual accountability and documents the resolution."}
  ]',
  4
),

-- ---- Regulatory Compliance Q5 ----
(
  'b1000000-0000-0000-0000-000000000005',
  'a1000000-0000-0000-0000-000000000003',
  'You discover a senior executive has been making comments that could constitute harassment — framed as jokes. No formal complaint has been filed yet.',
  null,
  '[
    {"label": "Wait for a formal complaint before acting — you need documentation.", "score": 1, "explanation": "Waiting for a complaint when you have direct knowledge of potential harassment exposes the company to serious liability."},
    {"label": "Talk to the executive off the record and ask them to tone it down.", "score": 2, "explanation": "An informal conversation without documentation creates a he-said-she-said situation and no paper trail."},
    {"label": "Re-send the annual DEI training company-wide as a general reminder.", "score": 3, "explanation": "A company-wide training does nothing to address a specific known behavior and creates the appearance of action without substance."},
    {"label": "Document the behavior and initiate a confidential investigation per policy.", "score": 5, "explanation": "Correct. Documented investigation is legally required once HR has knowledge of potential misconduct, regardless of whether a formal complaint exists."}
  ]',
  5
),

-- ---- Regulatory Compliance Q6 ----
(
  'b1000000-0000-0000-0000-000000000006',
  'a1000000-0000-0000-0000-000000000003',
  'A remote employee based in New York requests an ergonomic equipment setup as a reasonable accommodation for a diagnosed back condition. Your HQ is in a state with more lenient requirements.',
  null,
  '[
    {"label": "Follow your home-state laws since that is where the company is incorporated.", "score": 2, "explanation": "Accommodation obligations are generally determined by the employee''s work location, not company HQ."},
    {"label": "Deny the request — the budget is tight this quarter.", "score": 1, "explanation": "Denying a documented reasonable accommodation request is an ADA violation regardless of budget conditions."},
    {"label": "Ask the employee to purchase the equipment themselves and submit for reimbursement later.", "score": 3, "explanation": "Shifting the burden to the employee during the accommodation process is a compliance risk and morale issue."},
    {"label": "Apply the labor laws of the state where the employee resides and consult employment counsel if needed.", "score": 5, "explanation": "Correct. The employee''s work location determines which jurisdiction''s accommodation laws apply."}
  ]',
  6
),

-- ---- Strategic Budgeting Q7 ----
(
  'b1000000-0000-0000-0000-000000000007',
  'a1000000-0000-0000-0000-000000000004',
  'Your CEO announces a sudden 15% budget cut for the HR department. How do you decide what to cut?',
  null,
  '[
    {"label": "Cancel the upcoming leadership development offsite first — it is the most visible expense.", "score": 2, "explanation": "Cutting high-visibility development programs signals that growth is not a priority, which accelerates attrition of your best people."},
    {"label": "Cut all office perks and wellness benefits before touching core programs.", "score": 3, "explanation": "Perks cuts are low-cost but high-signal — they communicate culture contraction even when the cuts are small."},
    {"label": "Delay HRIS upgrades that would provide long-term predictive analytics.", "score": 1, "explanation": "Cutting the tools that give you data insight makes every future budget decision harder to justify."},
    {"label": "Run an ROI audit and cut programs with the lowest demonstrable impact on retention or productivity.", "score": 5, "explanation": "Correct. Data-driven cuts demonstrate strategic thinking and protect the programs that actually move the needle."}
  ]',
  7
),

-- ---- Strategic Budgeting Q8 ----
(
  'b1000000-0000-0000-0000-000000000008',
  'a1000000-0000-0000-0000-000000000004',
  'Your team is choosing between two wellness initiatives for next year. Which investment model do you advocate for?',
  null,
  '[
    {"label": "Free healthy snacks and coffee in the break room.", "score": 1, "explanation": "Snack benefits have near-zero measurable impact on retention, engagement, or health outcomes at the organizational level."},
    {"label": "A gym membership subsidy available to all employees.", "score": 2, "explanation": "Gym subsidies have moderate utilization rates and no documented link to productivity or retention improvement."},
    {"label": "100% employer-covered mental health counseling stipend.", "score": 3, "explanation": "Mental health benefits are high-value but work better as part of a broader total rewards strategy than as a standalone."},
    {"label": "An integrated Total Rewards package that links wellness spend directly to insurance premium forecasts and retention data.", "score": 5, "explanation": "Correct. Tying wellness investment to measurable business outcomes builds the CFO case and makes the program defensible at budget time."}
  ]',
  8
),

-- ---- DEI Strategy Q9 ----
(
  'b1000000-0000-0000-0000-000000000009',
  'a1000000-0000-0000-0000-000000000005',
  'Your company has a goal to double minority representation in leadership. Managers say there are not enough qualified internal candidates. What is your move?',
  null,
  '[
    {"label": "Lower seniority requirements temporarily to hit the representation numbers.", "score": 1, "explanation": "Lowering standards to hit optics-driven targets sets people up to fail and discredits the DEI program entirely."},
    {"label": "Implement anonymized blind resume screening for all leadership roles.", "score": 3, "explanation": "Blind screening helps at the top of the funnel but does not address pipeline depth or development gaps."},
    {"label": "Mandate diversity training for all hiring managers.", "score": 2, "explanation": "Training without systemic change produces compliance behavior, not genuine inclusion."},
    {"label": "Build an internal accelerated development pipeline for high-potential underrepresented talent.", "score": 5, "explanation": "Correct. A pipeline program addresses the root cause — development gaps — rather than just the symptom of underrepresentation at the top."}
  ]',
  9
),

-- ---- DEI Strategy Q10 ----
(
  'b1000000-0000-0000-0000-000000000010',
  'a1000000-0000-0000-0000-000000000005',
  'In a recurring team meeting, a male director consistently talks over and dismisses the ideas of a female project manager. You observe this pattern.',
  null,
  '[
    {"label": "Document the pattern and raise it in his annual performance review.", "score": 2, "explanation": "Waiting for a performance cycle to address ongoing behavior allows harm to accumulate and signals tolerance."},
    {"label": "Send a general email to the team about respectful meeting behavior.", "score": 2, "explanation": "Passive, undirected feedback does not create accountability and often makes the target feel more isolated."},
    {"label": "Intervene in the moment: redirect the conversation back to the PM.", "score": 3, "explanation": "In-meeting intervention is useful but should be paired with a direct private conversation to create lasting change."},
    {"label": "Have a direct private coaching conversation with the director about his pattern and its organizational impact.", "score": 5, "explanation": "Correct. Direct, specific, private feedback with documented follow-up is the most effective intervention for behavioral patterns."}
  ]',
  10
),

-- ---- HR Tech Fluency Q11 ----
(
  'b1000000-0000-0000-0000-000000000011',
  'a1000000-0000-0000-0000-000000000006',
  'Your VP wants to implement an AI resume screening tool to reduce recruiter workload. What safeguard do you require before launch?',
  null,
  '[
    {"label": "Do not implement — AI bias risk is too high in 2026.", "score": 2, "explanation": "Blanket refusal ignores that human screening also carries bias and misses the opportunity to implement AI responsibly."},
    {"label": "Disable all features related to cultural fit screening.", "score": 3, "explanation": "Removing cultural fit is a good start but does not address bias in other dimensions of the model."},
    {"label": "Have an HR manager review 10% of AI rejections daily.", "score": 3, "explanation": "Sampling is useful but not sufficient without understanding why the model made each rejection."},
    {"label": "Require the tool to be explainable — every rejection must include a documented reason that can be audited.", "score": 5, "explanation": "Correct. Explainability is the minimum bar for responsible AI deployment in hiring — it enables audit, correction, and legal defensibility."}
  ]',
  11
),

-- ---- HR Tech Fluency Q12 ----
(
  'b1000000-0000-0000-0000-000000000012',
  'a1000000-0000-0000-0000-000000000006',
  'Your HRIS generates weekly reports on turnover rate and diversity percentages. What is the next evolution of your reporting strategy?',
  null,
  '[
    {"label": "Build better-looking dashboards in PowerBI using the same underlying data.", "score": 1, "explanation": "Improving presentation without changing the analytical depth adds no decision-making value."},
    {"label": "Automate the existing reports so they go directly to all C-suite executives.", "score": 2, "explanation": "Automating shallow reporting just ensures executives receive low-value data faster."},
    {"label": "Consolidate payroll and performance data into a unified data warehouse.", "score": 3, "explanation": "Data consolidation is a prerequisite for better analytics but is not the strategic goal itself."},
    {"label": "Shift from descriptive reporting to prescriptive modeling — predicting turnover before it happens.", "score": 5, "explanation": "Correct. Prescriptive analytics transforms HR from a reporter of outcomes to a predictor of risk, which changes HR''s seat at the leadership table."}
  ]',
  12
);


-- ============================================
-- TRAINING MODULES
-- 1-2 per skill at varying difficulty
-- config jsonb contains the micro-drill nodes
-- ============================================

insert into public.training_modules
  (id, skill_id, title, description, difficulty, estimated_mins, xp_reward, config)
values

-- ---- People Operations: Level 2 ----
(
  'c1000000-0000-0000-0000-000000000001',
  'a1000000-0000-0000-0000-000000000001',
  'The performance conversation',
  'Practice delivering difficult performance feedback without triggering defensiveness.',
  2,
  5,
  120,
  '{
    "type": "micro_drill",
    "initial_node": "start",
    "nodes": {
      "start": {
        "text": "A mid-level engineer has missed three deadlines this sprint. Their manager wants to put them on a PIP immediately. You have 10 minutes before the scheduled conversation. What do you do first?",
        "options": [
          {
            "label": "Review the employee file and check for any prior documentation or patterns.",
            "next_node": "reviewed",
            "impact": {"trust": 5, "compliance": 10, "budget": 0},
            "explanation": "Correct first step. Acting without documentation context is a liability risk."
          },
          {
            "label": "Call the manager and tell them to proceed with the PIP.",
            "next_node": "rushed",
            "impact": {"trust": -10, "compliance": -15, "budget": 0},
            "explanation": "Rushing to a PIP without prior coaching steps is legally risky and rarely produces improvement."
          },
          {
            "label": "Cancel the meeting — you need more time to prepare.",
            "next_node": "cancelled",
            "impact": {"trust": -5, "compliance": 0, "budget": 0},
            "explanation": "Cancellation signals avoidance and delays a conversation the employee needs to have."
          }
        ]
      },
      "reviewed": {
        "text": "You find this is the first documented performance issue. No prior coaching notes exist. The manager wants to move fast. How do you advise them?",
        "options": [
          {
            "label": "Recommend a structured coaching conversation first, with a 30-day improvement plan before any PIP.",
            "next_node": "END",
            "impact": {"trust": 15, "compliance": 20, "budget": 0},
            "explanation": "Correct. A coaching-first approach is legally defensible and gives the employee a fair chance to improve."
          },
          {
            "label": "Support the PIP since the manager has direct knowledge of the performance gap.",
            "next_node": "END",
            "impact": {"trust": -5, "compliance": -10, "budget": 0},
            "explanation": "Without prior coaching documentation, a PIP as the first step is difficult to defend if challenged."
          }
        ]
      },
      "rushed": {
        "text": "The PIP is issued. The employee immediately contacts an employment attorney and claims the process was retaliatory. What now?",
        "options": [
          {
            "label": "Engage legal counsel and freeze all further action until reviewed.",
            "next_node": "END",
            "impact": {"trust": 0, "compliance": 10, "budget": -20},
            "explanation": "Correct containment step, but this situation was preventable with proper documentation first."
          }
        ]
      },
      "cancelled": {
        "text": "The employee hears the meeting was cancelled and assumes the worst. They tell their team lead they are being pushed out. The rumor spreads.",
        "options": [
          {
            "label": "Reschedule immediately and communicate clearly that this is a routine check-in.",
            "next_node": "END",
            "impact": {"trust": -5, "compliance": 0, "budget": 0},
            "explanation": "Damage control is possible but the delay has already created unnecessary anxiety."
          }
        ]
      }
    }
  }'
),

-- ---- Conflict Resolution: Level 2 ----
(
  'c1000000-0000-0000-0000-000000000002',
  'a1000000-0000-0000-0000-000000000002',
  'The feedback loop',
  'Learn to move from vague dissatisfaction to clear, actionable conflict resolution.',
  2,
  5,
  120,
  '{
    "type": "micro_drill",
    "initial_node": "start",
    "nodes": {
      "start": {
        "text": "Two engineers on the same team have stopped communicating directly. Their manager says productivity has dropped 30%. Neither has filed a formal complaint. How do you open the conversation?",
        "options": [
          {
            "label": "Meet with each person separately first to understand their perspective before bringing them together.",
            "next_node": "separate",
            "impact": {"trust": 15, "compliance": 5, "budget": 0},
            "explanation": "Correct. Separate conversations first give each person psychological safety to be honest."
          },
          {
            "label": "Bring both into a room together immediately to resolve it efficiently.",
            "next_node": "joint",
            "impact": {"trust": -10, "compliance": 0, "budget": 0},
            "explanation": "Forcing a joint conversation without preparation often escalates rather than resolves conflict."
          },
          {
            "label": "Tell the manager to handle it — it is a team dynamics issue, not an HR issue.",
            "next_node": "END",
            "impact": {"trust": -15, "compliance": -5, "budget": 0},
            "explanation": "Deflecting a documented productivity impact to the manager without support is an abdication of the HR role."
          }
        ]
      },
      "separate": {
        "text": "In your conversation with Engineer A, they reveal that Engineer B took credit for their work in a team meeting three weeks ago. They felt humiliated. What is your next step?",
        "options": [
          {
            "label": "Validate their experience, document it, and tell them you will follow up with Engineer B before a joint session.",
            "next_node": "END",
            "impact": {"trust": 20, "compliance": 10, "budget": 0},
            "explanation": "Correct. Validation plus documentation plus a clear next step keeps trust high and the process structured."
          },
          {
            "label": "Tell Engineer A that credit disputes are common and they should just move on.",
            "next_node": "END",
            "impact": {"trust": -20, "compliance": -5, "budget": 0},
            "explanation": "Minimizing a legitimate grievance destroys trust and guarantees the conflict will resurface."
          }
        ]
      },
      "joint": {
        "text": "The joint meeting becomes heated within 5 minutes. Engineer B denies everything. Engineer A shuts down. The room is tense.",
        "options": [
          {
            "label": "Pause the meeting, separate them again, and reset with individual conversations.",
            "next_node": "END",
            "impact": {"trust": 0, "compliance": 5, "budget": 0},
            "explanation": "Recovery is possible but the damage from the unprepared joint session has already set the process back."
          }
        ]
      }
    }
  }'
),

-- ---- Regulatory Compliance: Level 2 ----
(
  'c1000000-0000-0000-0000-000000000003',
  'a1000000-0000-0000-0000-000000000003',
  'The 2026 labor law pivot',
  'Navigate a multi-jurisdiction accommodation request without creating legal exposure.',
  2,
  5,
  120,
  '{
    "type": "micro_drill",
    "initial_node": "start",
    "nodes": {
      "start": {
        "text": "A remote employee in California requests standing desk accommodations for a documented chronic back condition. Your company is incorporated in Texas. Your Texas-based facilities team says the request is outside standard policy. What do you do?",
        "options": [
          {
            "label": "Apply California accommodation law since that is where the employee works.",
            "next_node": "california",
            "impact": {"trust": 10, "compliance": 20, "budget": -5},
            "explanation": "Correct. Employee work location determines applicable law, not company incorporation state."
          },
          {
            "label": "Apply Texas policy since that is where the company is headquartered.",
            "next_node": "texas",
            "impact": {"trust": -5, "compliance": -20, "budget": 0},
            "explanation": "Incorrect jurisdiction. California law applies to work performed in California regardless of HQ location."
          },
          {
            "label": "Deny the request and suggest the employee work from a coworking space with better equipment.",
            "next_node": "END",
            "impact": {"trust": -15, "compliance": -25, "budget": 0},
            "explanation": "Denying a documented ADA-equivalent request and shifting burden to the employee is a compliance violation."
          }
        ]
      },
      "california": {
        "text": "The facilities team pushes back on cost. The standing desk costs $800. How do you resolve this?",
        "options": [
          {
            "label": "Approve the purchase. Accommodation costs under $1,000 are generally not considered undue hardship.",
            "next_node": "END",
            "impact": {"trust": 10, "compliance": 15, "budget": -8},
            "explanation": "Correct. $800 for a documented medical accommodation is well within reasonable accommodation thresholds."
          },
          {
            "label": "Propose a cheaper alternative chair and see if the employee accepts.",
            "next_node": "END",
            "impact": {"trust": -5, "compliance": -5, "budget": 0},
            "explanation": "Substituting a cheaper alternative without medical guidance is risky — the doctor specified a standing desk for a reason."
          }
        ]
      },
      "texas": {
        "text": "The employee files a complaint with the California Department of Fair Employment and Housing. An investigation is now open.",
        "options": [
          {
            "label": "Engage employment counsel immediately and approve the accommodation retroactively.",
            "next_node": "END",
            "impact": {"trust": -10, "compliance": 5, "budget": -30},
            "explanation": "Retroactive correction limits further exposure but the complaint is already filed. Early compliance would have cost $800 instead of legal fees."
          }
        ]
      }
    }
  }'
),

-- ---- Strategic Budgeting: Level 2 ----
(
  'c1000000-0000-0000-0000-000000000004',
  'a1000000-0000-0000-0000-000000000004',
  'The ROI audit',
  'Practice cutting HR spend strategically without destroying the programs that matter.',
  2,
  5,
  120,
  '{
    "type": "micro_drill",
    "initial_node": "start",
    "nodes": {
      "start": {
        "text": "You have been asked to cut $200k from the HR budget. You have three programs on the table: a $90k annual leadership retreat, a $70k HRIS analytics upgrade, and a $40k employee wellness fund. Which do you cut first?",
        "options": [
          {
            "label": "Cut the leadership retreat — it is the most visible and easiest to justify.",
            "next_node": "retreat_cut",
            "impact": {"trust": -10, "compliance": 0, "budget": 20},
            "explanation": "The retreat is visible but may be your highest-retention tool for senior leaders. Cutting it without data is a guess."
          },
          {
            "label": "Run a utilization and ROI audit on all three before deciding.",
            "next_node": "audit",
            "impact": {"trust": 5, "compliance": 5, "budget": 5},
            "explanation": "Correct first step. Data should drive cuts, not visibility or perceived expendability."
          },
          {
            "label": "Cut the wellness fund — it is the smallest line item and easiest to restore later.",
            "next_node": "END",
            "impact": {"trust": -15, "compliance": 0, "budget": 5},
            "explanation": "Wellness cuts signal that employee wellbeing is the first casualty of financial pressure, which accelerates attrition."
          }
        ]
      },
      "audit": {
        "text": "The audit reveals: the retreat has a 94% satisfaction score and correlates with a 18% retention lift for attendees. The HRIS upgrade would reduce manual reporting by 12 hours per week. The wellness fund has 23% utilization. What do you recommend?",
        "options": [
          {
            "label": "Cut the wellness fund entirely and reduce the retreat to a 1-day format to save $120k combined.",
            "next_node": "END",
            "impact": {"trust": 5, "compliance": 5, "budget": 15},
            "explanation": "Reasonable. Reformatting the retreat preserves the retention signal while cutting cost. Low wellness utilization makes it the defensible cut."
          },
          {
            "label": "Cut the HRIS upgrade and keep both people-facing programs intact.",
            "next_node": "END",
            "impact": {"trust": 10, "compliance": -5, "budget": 10},
            "explanation": "Protects culture but sacrifices operational efficiency. The 12 hours per week of manual work will compound over time."
          }
        ]
      },
      "retreat_cut": {
        "text": "Three senior leaders mention the retreat in their exit interviews over the next quarter. The CFO asks why attrition increased. How do you respond?",
        "options": [
          {
            "label": "Present the utilization data you should have pulled before the cut and propose a scaled-back version.",
            "next_node": "END",
            "impact": {"trust": -5, "compliance": 0, "budget": -10},
            "explanation": "Corrective action is good but the credibility cost of a data-free decision is already paid."
          }
        ]
      }
    }
  }'
),

-- ---- DEI Strategy: Level 2 ----
(
  'c1000000-0000-0000-0000-000000000005',
  'a1000000-0000-0000-0000-000000000005',
  'Culture architect',
  'Navigate a representation gap without compromising standards or legal standing.',
  2,
  5,
  120,
  '{
    "type": "micro_drill",
    "initial_node": "start",
    "nodes": {
      "start": {
        "text": "Your company has promoted zero women to VP level in three years. The CEO wants to fix this by promoting the next qualified female candidate regardless of competition. How do you respond?",
        "options": [
          {
            "label": "Agree — it is a reasonable corrective action given the documented pattern.",
            "next_node": "agree",
            "impact": {"trust": -5, "compliance": -15, "budget": 0},
            "explanation": "A blanket quota-based promotion policy creates legal exposure and can undermine the promoted person''s credibility."
          },
          {
            "label": "Push back and propose an audit of why women are not reaching the VP pipeline instead.",
            "next_node": "audit",
            "impact": {"trust": 10, "compliance": 15, "budget": 0},
            "explanation": "Correct. Fixing the pipeline root cause is more durable and legally defensible than a one-off corrective promotion."
          },
          {
            "label": "Do nothing — promotion decisions are outside HR''s authority.",
            "next_node": "END",
            "impact": {"trust": -20, "compliance": -10, "budget": 0},
            "explanation": "HR has both the authority and obligation to flag discriminatory patterns in promotion outcomes."
          }
        ]
      },
      "audit": {
        "text": "The audit reveals that women are consistently passed over at the Director-to-VP transition despite comparable performance scores. Managers cite lack of executive presence. What systemic fix do you propose?",
        "options": [
          {
            "label": "Define objective, measurable criteria for executive presence and apply them equally in future promotion reviews.",
            "next_node": "END",
            "impact": {"trust": 15, "compliance": 20, "budget": -5},
            "explanation": "Correct. Operationalizing vague criteria removes subjectivity and creates an auditable, legally defensible process."
          },
          {
            "label": "Launch executive presence coaching specifically for female directors.",
            "next_node": "END",
            "impact": {"trust": 5, "compliance": 5, "budget": -10},
            "explanation": "Coaching is useful but does not fix the evaluator bias that created the gap — it asks women to adapt to a biased standard."
          }
        ]
      },
      "agree": {
        "text": "A male candidate who was passed over for the promotion files a discrimination complaint citing the CEO''s stated rationale. How do you respond?",
        "options": [
          {
            "label": "Investigate the complaint seriously and acknowledge the policy error while engaging legal counsel.",
            "next_node": "END",
            "impact": {"trust": 0, "compliance": 10, "budget": -20},
            "explanation": "Correct response to the complaint, but the situation was preventable with a process-based approach from the start."
          }
        ]
      }
    }
  }'
),

-- ---- HR Tech Fluency: Level 2 ----
(
  'c1000000-0000-0000-0000-000000000006',
  'a1000000-0000-0000-0000-000000000006',
  'Data whisperer',
  'Move from descriptive HRIS reporting to a predictive turnover model that earns a seat at the leadership table.',
  2,
  5,
  120,
  '{
    "type": "micro_drill",
    "initial_node": "start",
    "nodes": {
      "start": {
        "text": "Your HRIS shows turnover is up 12% year over year. The CFO asks what is driving it and what you plan to do. You have access to performance scores, compensation data, engagement survey results, and tenure records. What do you present?",
        "options": [
          {
            "label": "Present the 12% number with a breakdown by department and seniority level.",
            "next_node": "descriptive",
            "impact": {"trust": 5, "compliance": 5, "budget": 0},
            "explanation": "Descriptive reporting is a start but does not answer the CFO''s real question: what do we do about it?"
          },
          {
            "label": "Cross-reference engagement scores, compensation percentile, and tenure to identify the highest-risk segments.",
            "next_node": "predictive",
            "impact": {"trust": 20, "compliance": 5, "budget": 0},
            "explanation": "Correct. Triangulating multiple data sources surfaces the actual drivers, not just the symptom."
          },
          {
            "label": "Say you need more time to build a proper analysis before presenting anything.",
            "next_node": "END",
            "impact": {"trust": -10, "compliance": 0, "budget": 0},
            "explanation": "Delaying a CFO request without a preliminary read signals that HR lacks analytical readiness."
          }
        ]
      },
      "predictive": {
        "text": "Your analysis shows that engineers with 2-4 years tenure, below the 50th percentile in compensation, and low Q3 engagement scores are leaving at 3x the company average. What do you recommend?",
        "options": [
          {
            "label": "Propose targeted compensation adjustments for the at-risk segment with a 90-day retention check-in program.",
            "next_node": "END",
            "impact": {"trust": 20, "compliance": 5, "budget": -15},
            "explanation": "Correct. Targeted intervention based on identified risk is far more cost-effective than broad salary adjustments or reactive backfill."
          },
          {
            "label": "Recommend a company-wide 5% salary increase to address the compensation gap broadly.",
            "next_node": "END",
            "impact": {"trust": 10, "compliance": 5, "budget": -30},
            "explanation": "A broad increase addresses the symptom without precision and costs significantly more than a targeted approach."
          }
        ]
      },
      "descriptive": {
        "text": "The CFO says the breakdown is interesting but asks what HR recommends doing about it. You do not have predictive analysis ready. What now?",
        "options": [
          {
            "label": "Commit to a cross-referenced analysis within one week and return with an intervention recommendation.",
            "next_node": "END",
            "impact": {"trust": 5, "compliance": 0, "budget": 0},
            "explanation": "A committed timeline recovers the situation. The lesson: predictive analysis should be built before the CFO asks."
          }
        ]
      }
    }
  }'
);


-- ============================================
-- SIMULATION SCENARIOS
-- 1 per skill — full branching scenario
-- These are the high-stakes, multi-node sims
-- that unlock after completing modules
-- ============================================

insert into public.simulation_scenarios
  (id, skill_id, title, description, environment, difficulty, config)
values

-- ---- People Operations Simulation ----
(
  'd1000000-0000-0000-0000-000000000001',
  'a1000000-0000-0000-0000-000000000001',
  'The high-performer retention pivot',
  'A top engineer has a competing offer. Matching their salary would break pay equity. Navigate the systemic risk.',
  'conversation',
  3,
  '{
    "initial_node": "start",
    "nodes": {
      "start": {
        "text": "Your Engineering VP calls you: a Senior Engineer ranked in the top 5% of performers has a competing offer at 30% above their current salary. The VP wants to match it immediately. Your recent equity audit shows three female engineers at the same level are already underpaid relative to market. What do you do?",
        "options": [
          {
            "label": "Approve the match — retaining top talent is the priority.",
            "next_node": "match_approved",
            "impact": {"trust": 5, "compliance": -20, "budget": -10},
            "explanation": "Retention win, but you have just widened an existing pay equity gap that is already legally risky."
          },
          {
            "label": "Refuse the match — the equity audit makes it too risky right now.",
            "next_node": "match_refused",
            "impact": {"trust": -10, "compliance": 15, "budget": 5},
            "explanation": "Legally safer but you may lose your top performer and the VP''s trust."
          },
          {
            "label": "Propose a non-monetary retention package while fast-tracking a company-wide salary band review.",
            "next_node": "systemic",
            "impact": {"trust": 10, "compliance": 10, "budget": -5},
            "explanation": "Addresses the immediate problem without worsening the equity gap, and creates a systemic fix."
          }
        ]
      },
      "match_approved": {
        "text": "Two weeks later, one of the underpaid female engineers discovers the salary discrepancy through a colleague. She retains an employment attorney. The VP asks why HR approved the match.",
        "options": [
          {
            "label": "Accept responsibility and propose an immediate remediation plan for all affected engineers.",
            "next_node": "END",
            "impact": {"trust": -5, "compliance": 10, "budget": -25},
            "explanation": "Correct crisis response, but the cost of remediation plus legal exposure far exceeds what a systemic review would have cost."
          },
          {
            "label": "Blame the VP for pressuring the decision.",
            "next_node": "END",
            "impact": {"trust": -20, "compliance": -10, "budget": -30},
            "explanation": "Deflecting blame destroys the VP relationship and does nothing to address the legal exposure."
          }
        ]
      },
      "match_refused": {
        "text": "The engineer accepts the competing offer and leaves. Over the next month, two more engineers on their team submit resignations citing compensation concerns. The VP blames HR.",
        "options": [
          {
            "label": "Present the equity audit data to the VP and propose a market-rate review for the whole engineering tier.",
            "next_node": "END",
            "impact": {"trust": 5, "compliance": 15, "budget": -15},
            "explanation": "The right long-term fix, but the attrition cost is already accruing. A proactive systemic proposal before the first resignation would have been stronger."
          }
        ]
      },
      "systemic": {
        "text": "The engineer appreciates the retention package but says they need an answer on salary within 48 hours. You have scheduled a salary band review meeting with the CFO for tomorrow. What do you tell the engineer?",
        "options": [
          {
            "label": "Tell them honestly that a salary band review is in progress and you will have a concrete answer within 72 hours.",
            "next_node": "END",
            "impact": {"trust": 15, "compliance": 15, "budget": -5},
            "explanation": "Correct. Transparency with a committed timeline respects the engineer and gives the systemic fix a chance to land."
          },
          {
            "label": "Stall by saying the review is complex and could take several weeks.",
            "next_node": "END",
            "impact": {"trust": -10, "compliance": 5, "budget": 0},
            "explanation": "Vague timelines signal that HR is not in control of the process and often accelerate the departure decision."
          }
        ]
      }
    }
  }'
),

-- ---- Conflict Resolution Simulation ----
(
  'd1000000-0000-0000-0000-000000000002',
  'a1000000-0000-0000-0000-000000000002',
  'The Slack incident',
  'Two senior leaders go public with a budget dispute. Contain the fallout and rebuild trust before it becomes a culture issue.',
  'inbox',
  3,
  '{
    "initial_node": "start",
    "nodes": {
      "start": {
        "text": "You open Slack on Monday morning to find a 47-message thread in #leadership-general where your Head of Product and Head of Engineering have been arguing about Q3 budget allocation since Sunday night. Other team members have started reacting with emojis. The thread is still active.",
        "options": [
          {
            "label": "Archive the thread immediately and send both leaders a private message to meet with you today.",
            "next_node": "archived",
            "impact": {"trust": 5, "compliance": 10, "budget": 0},
            "explanation": "Containing the public thread is the right first move. Private follow-up signals that you are taking it seriously."
          },
          {
            "label": "Post a message in the thread reminding everyone of the communication guidelines.",
            "next_node": "public_response",
            "impact": {"trust": -10, "compliance": 5, "budget": 0},
            "explanation": "A public post makes HR part of the public drama and rarely changes leadership behavior."
          },
          {
            "label": "Forward the thread to the CEO and let them handle it.",
            "next_node": "END",
            "impact": {"trust": -15, "compliance": -5, "budget": 0},
            "explanation": "Escalating immediately to the CEO without attempting resolution first signals that HR cannot handle leadership conflict."
          }
        ]
      },
      "archived": {
        "text": "Both leaders agree to meet. In the meeting, it becomes clear the budget conflict is a symptom of a deeper misalignment on product roadmap prioritization. Neither wants to back down. How do you structure the resolution?",
        "options": [
          {
            "label": "Facilitate a structured session where each leader presents their prioritization criteria, then identify where they actually agree.",
            "next_node": "END",
            "impact": {"trust": 20, "compliance": 10, "budget": 0},
            "explanation": "Correct. Moving from positions to underlying interests is the core of principled negotiation and usually reveals more common ground than expected."
          },
          {
            "label": "Tell them both to submit their proposals to the CEO for a final decision.",
            "next_node": "END",
            "impact": {"trust": -5, "compliance": 0, "budget": 0},
            "explanation": "Pushing to the CEO is an escalation, not a resolution. It avoids the conflict rather than developing the leaders'' ability to navigate it."
          }
        ]
      },
      "public_response": {
        "text": "Your post is met with silence from the two leaders and several eye-roll emojis from team members. The thread has now been screenshotted and shared in a private channel. How do you recover?",
        "options": [
          {
            "label": "Send direct messages to both leaders immediately and request an urgent private meeting.",
            "next_node": "END",
            "impact": {"trust": 0, "compliance": 5, "budget": 0},
            "explanation": "Recovery is possible but the public post has already reduced HR''s perceived authority in this situation."
          }
        ]
      }
    }
  }'
),

-- ---- Regulatory Compliance Simulation ----
(
  'd1000000-0000-0000-0000-000000000003',
  'a1000000-0000-0000-0000-000000000003',
  'The harassment investigation',
  'A credible harassment report lands on your desk. Navigate the investigation without creating additional liability.',
  'conversation',
  3,
  '{
    "initial_node": "start",
    "nodes": {
      "start": {
        "text": "A mid-level employee submits a formal complaint stating that their VP has made repeated comments about their appearance and sends after-hours personal messages. The VP is a high-revenue producer and close friend of the CEO. How do you proceed?",
        "options": [
          {
            "label": "Initiate a formal investigation immediately per your harassment policy, regardless of the VP status.",
            "next_node": "investigate",
            "impact": {"trust": 10, "compliance": 25, "budget": -5},
            "explanation": "Correct. Harassment policy applies equally at all levels — any deviation creates catastrophic legal liability."
          },
          {
            "label": "Have an informal conversation with the VP first to get their side of the story.",
            "next_node": "informal",
            "impact": {"trust": -10, "compliance": -20, "budget": 0},
            "explanation": "Tipping off the subject of an investigation before it is formally opened compromises the process and signals bias."
          },
          {
            "label": "Suggest the employee try to resolve it directly with the VP before escalating.",
            "next_node": "END",
            "impact": {"trust": -25, "compliance": -30, "budget": 0},
            "explanation": "Asking a harassment complainant to confront their harasser is a serious legal and ethical violation."
          }
        ]
      },
      "investigate": {
        "text": "The CEO learns about the investigation and calls you directly. They say the VP is critical to a pending acquisition and asks you to slow the process until the deal closes. What do you say?",
        "options": [
          {
            "label": "Tell the CEO clearly that pausing a harassment investigation on business grounds creates direct legal liability for the company and for you personally.",
            "next_node": "END",
            "impact": {"trust": 5, "compliance": 25, "budget": 0},
            "explanation": "Correct. This is the hardest conversation in HR — and the right one. Pausing an investigation for business reasons is illegal retaliation."
          },
          {
            "label": "Agree to slow the process but document the CEO instruction in writing.",
            "next_node": "END",
            "impact": {"trust": -10, "compliance": -15, "budget": 0},
            "explanation": "Documentation protects you personally but does not protect the company from retaliation liability."
          }
        ]
      },
      "informal": {
        "text": "The VP now knows about the complaint. They call the complainant directly and tell them it was all a misunderstanding. The complainant emails you saying they feel pressured to drop the complaint.",
        "options": [
          {
            "label": "Treat the VP contact as potential retaliation, document it, and escalate to legal counsel immediately.",
            "next_node": "END",
            "impact": {"trust": 5, "compliance": 15, "budget": -20},
            "explanation": "Correct escalation, but the retaliation scenario was created by the informal tip-off. The investigation process was already compromised."
          }
        ]
      }
    }
  }'
);