import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getSessionUser();
    const userId = user?.id || 'usr_alex_chen_01';

    const conflicts = db.calculateConflicts(userId);
    return NextResponse.json({ success: true, conflicts });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
