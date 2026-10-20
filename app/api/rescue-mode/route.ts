import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getSessionUser();
    const userId = user?.id || 'usr_alex_chen_01';

    const plan = db.generateRescuePlan(userId);
    return NextResponse.json({ success: true, plan });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getSessionUser();
    const userId = user?.id || 'usr_alex_chen_01';

    const body = await req.json();
    const targetDate = body?.date || new Date().toISOString().slice(0, 10);

    const plan = db.generateRescuePlan(userId);

    // Convert emergency_schedule items to action plan items
    const newItems = plan.emergency_schedule.map((slot) => ({
      task_id: slot.task_id,
      scheduled_time_start: slot.time_start,
      scheduled_time_end: slot.time_end,
      is_completed: false,
      notes: `[RESCUE MODE] ${slot.focus_objective}`,
    }));

    const appliedPlan = db.bulkReplaceActionPlan(userId, targetDate, newItems);
    return NextResponse.json({
      success: true,
      message: 'Rescue schedule successfully applied to your daily agenda!',
      plan,
      actionPlan: appliedPlan,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
