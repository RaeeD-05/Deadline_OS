import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const user = await getSessionUser();
    const userId = user?.id || 'usr_alex_chen_01';

    const { searchParams } = new URL(req.url);
    const date = searchParams.get('date') || new Date().toISOString().slice(0, 10);

    const actionPlan = db.getActionPlan(userId, date);
    return NextResponse.json({ success: true, date, actionPlan });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getSessionUser();
    const userId = user?.id || 'usr_alex_chen_01';

    const body = await req.json();
    const { task_id, scheduled_time_start, scheduled_time_end, date, notes } = body;

    if (!task_id || !scheduled_time_start || !scheduled_time_end) {
      return NextResponse.json(
        { error: 'task_id, scheduled_time_start, and scheduled_time_end are required.' },
        { status: 400 }
      );
    }

    const targetDate = date || new Date().toISOString().slice(0, 10);
    const newItem = db.createActionItem({
      user_id: userId,
      task_id,
      scheduled_time_start,
      scheduled_time_end,
      date: targetDate,
      is_completed: false,
      notes: notes || '',
    });

    return NextResponse.json({ success: true, item: newItem }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
