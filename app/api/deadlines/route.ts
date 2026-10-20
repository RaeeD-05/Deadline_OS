import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';
import { DeadlineSource, RiskScore, TaskStatus } from '@/types';

function computeRiskScore(dueDateStr: string, estimatedHours: number): RiskScore {
  const now = new Date().getTime();
  const due = new Date(dueDateStr).getTime();
  const hoursRemaining = Math.max(0, (due - now) / (1000 * 60 * 60));

  if (hoursRemaining <= 36 || (hoursRemaining <= 72 && estimatedHours >= 5)) {
    return 'High';
  }
  if (hoursRemaining <= 96 || estimatedHours >= 4) {
    return 'Medium';
  }
  return 'Low';
}

export async function GET(req: Request) {
  try {
    const user = await getSessionUser();
    const userId = user?.id || 'usr_alex_chen_01'; // Fallback to demo user

    const { searchParams } = new URL(req.url);
    const source = searchParams.get('source') || undefined;
    const status = searchParams.get('status') || undefined;
    const risk = searchParams.get('risk') || undefined;

    const deadlines = db.getDeadlines(userId, { source, status, risk });
    return NextResponse.json({ success: true, deadlines });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getSessionUser();
    const userId = user?.id || 'usr_alex_chen_01';

    const body = await req.json();
    const { title, course_name, source, due_date, estimated_hours, description, tags, risk_score, status } = body;

    if (!title || !course_name || !due_date) {
      return NextResponse.json(
        { error: 'Title, course name, and due date are required.' },
        { status: 400 }
      );
    }

    const estHours = Number(estimated_hours) || 2;
    const finalRisk: RiskScore = risk_score || computeRiskScore(due_date, estHours);
    const finalStatus: TaskStatus = status || 'Pending';
    const finalSource: DeadlineSource = source || 'Google Classroom';

    const newDeadline = db.createDeadline({
      user_id: userId,
      title: title.trim(),
      course_name: course_name.trim(),
      source: finalSource,
      due_date,
      risk_score: finalRisk,
      status: finalStatus,
      estimated_hours: estHours,
      description: (description || '').trim(),
      tags: Array.isArray(tags) ? tags : [],
    });

    return NextResponse.json({ success: true, deadline: newDeadline }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
