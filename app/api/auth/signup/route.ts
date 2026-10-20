import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { hashPassword, createSessionToken, getSessionCookieConfig } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password, college_name, semester } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required.' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters.' },
        { status: 400 }
      );
    }

    const existingUser = db.findUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email already exists.' },
        { status: 409 }
      );
    }

    const password_hash = await hashPassword(password);
    const user = db.createUser({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password_hash,
      college_name: (college_name || 'University Student').trim(),
      semester: (semester || 'Current Semester').trim(),
    });

    const token = await createSessionToken(user);
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        college_name: user.college_name,
        semester: user.semester,
      },
    });

    response.cookies.set(getSessionCookieConfig(token));
    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Signup failed' }, { status: 500 });
  }
}
