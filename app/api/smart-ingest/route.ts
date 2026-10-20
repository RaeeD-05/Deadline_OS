import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';
import { DeadlineSource, RiskScore } from '@/types';

// Intelligent parsing heuristics for student messages
function parseIncomingSnippet(rawText: string, defaultSource: DeadlineSource = 'WhatsApp') {
  const text = rawText.trim();
  const lower = text.toLowerCase();
  const now = new Date();

  // 1. Detect Source
  let source: DeadlineSource = defaultSource;
  if (lower.includes('classroom.google.com') || lower.includes('google classroom')) {
    source = 'Google Classroom';
  } else if (lower.includes('subject:') || lower.includes('from:') || lower.includes('@') || lower.includes('email')) {
    source = 'Email';
  } else if (lower.includes('canvas') || lower.includes('moodle') || lower.includes('blackboard') || lower.includes('portal')) {
    source = 'Portal';
  } else if (lower.includes('syllabus') || lower.includes('.pdf') || lower.includes('page ')) {
    source = 'PDF';
  }

  // 2. Detect Course
  let course_name = 'CS101: Computer Science';
  const courseMatch = text.match(/([A-Z]{2,4}\s*[-:]?\s*\d{3}[A-Z]?|[A-Za-z]+(?:\s+[A-Za-z]+)?\s+(?:Lab|Project|Course|Seminar))/i);
  if (courseMatch) {
    course_name = courseMatch[0].trim();
  } else if (lower.includes('os') || lower.includes('operating system')) {
    course_name = 'CS401: Operating Systems';
  } else if (lower.includes('dbms') || lower.includes('database')) {
    course_name = 'CS320: Database Systems';
  } else if (lower.includes('network') || lower.includes('cn')) {
    course_name = 'CS312: Computer Networks';
  } else if (lower.includes('math') || lower.includes('linear algebra')) {
    course_name = 'MATH204: Linear Algebra';
  }

  // 3. Detect Title
  let title = 'Course Assignment';
  const lines = text.split('\n').filter((l) => l.trim().length > 0);
  if (lines.length > 0) {
    // Look for lines containing "Assignment", "Lab", "Project", "Homework", "Midterm"
    const keyLine = lines.find((l) => /(assignment|lab|project|homework|submission|report|milestone)/i.test(l));
    if (keyLine) {
      title = keyLine.replace(/^(urgent|reminder|notice|announcement)[:\s-]*/i, '').slice(0, 65).trim();
    } else {
      title = lines[0].replace(/^(urgent|reminder|notice|announcement)[:\s-]*/i, '').slice(0, 65).trim();
    }
  }

  // 4. Detect Due Date / Time
  // Default to 48 hours from now
  let dueDate = new Date(now.getTime() + 48 * 60 * 60 * 1000);

  if (lower.includes('tomorrow') || lower.includes('tonight')) {
    dueDate = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    dueDate.setHours(23, 59, 0, 0);
  } else if (lower.includes('friday')) {
    const daysUntilFriday = (5 - now.getDay() + 7) % 7 || 7;
    dueDate = new Date(now.getTime() + daysUntilFriday * 24 * 60 * 60 * 1000);
    dueDate.setHours(23, 59, 0, 0);
  } else if (lower.includes('sunday')) {
    const daysUntilSunday = (7 - now.getDay() + 7) % 7 || 7;
    dueDate = new Date(now.getTime() + daysUntilSunday * 24 * 60 * 60 * 1000);
    dueDate.setHours(23, 59, 0, 0);
  } else if (lower.includes('in 3 days') || lower.includes('in three days')) {
    dueDate = new Date(now.getTime() + 72 * 60 * 60 * 1000);
    dueDate.setHours(23, 59, 0, 0);
  }

  // 5. Detect Estimated Effort
  let estimated_hours = 3.5;
  const hourMatch = text.match(/(\d+(?:\.\d+)?)\s*(?:hrs?|hours?)/i);
  if (hourMatch) {
    estimated_hours = parseFloat(hourMatch[1]);
  } else if (lower.includes('project') || lower.includes('paper') || lower.includes('midterm')) {
    estimated_hours = 6.0;
  } else if (lower.includes('quiz') || lower.includes('form') || lower.includes('quick')) {
    estimated_hours = 1.5;
  }

  // 6. Calculate Risk
  const hoursUntilDue = (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60);
  let risk_score: RiskScore = 'Low';
  if (hoursUntilDue <= 36 || (hoursUntilDue <= 60 && estimated_hours >= 4)) {
    risk_score = 'High';
  } else if (hoursUntilDue <= 96 || estimated_hours >= 4) {
    risk_score = 'Medium';
  }

  return {
    title,
    course_name,
    source,
    due_date: dueDate.toISOString(),
    estimated_hours,
    risk_score,
    description: text,
    tags: ['Auto-Captured', source],
  };
}

export async function POST(req: Request) {
  try {
    const user = await getSessionUser();
    const userId = user?.id || 'usr_alex_chen_01';

    const body = await req.json();
    const { raw_text, source_hint } = body;

    if (!raw_text || raw_text.trim().length === 0) {
      return NextResponse.json(
        { error: 'raw_text content is required for smart ingestion.' },
        { status: 400 }
      );
    }

    const parsed = parseIncomingSnippet(raw_text, source_hint);
    const createdDeadline = db.createDeadline({
      user_id: userId,
      ...parsed,
      status: 'Pending',
    });

    return NextResponse.json({
      success: true,
      message: `Parsed and auto-captured from ${parsed.source}!`,
      parsed,
      deadline: createdDeadline,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
