import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const deadline = db.getDeadlineById(params.id);
    if (!deadline) {
      return NextResponse.json({ error: 'Deadline not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, deadline });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const updated = db.updateDeadline(params.id, body);
    if (!updated) {
      return NextResponse.json({ error: 'Deadline not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, deadline: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const success = db.deleteDeadline(params.id);
    if (!success) {
      return NextResponse.json({ error: 'Deadline not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: 'Deadline removed successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
