import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const { is_completed } = body;

    const updated = db.toggleActionItem(params.id, Boolean(is_completed));
    if (!updated) {
      return NextResponse.json({ error: 'Action item not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, item: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const success = db.deleteActionItem(params.id);
    if (!success) {
      return NextResponse.json({ error: 'Action item not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: 'Action item deleted' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
