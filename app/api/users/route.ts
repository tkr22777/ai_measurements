import { NextRequest, NextResponse } from 'next/server';
import { createUser, getUserById } from '../../../lib/userService';
import type { CreateUserRequest } from '../../../types/user';

// POST /api/users - Create user
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as CreateUserRequest;

    if (!body.email || !body.name) {
      return NextResponse.json({ error: 'Email and name are required' }, { status: 400 });
    }

    // Create new user
    const newUser = await createUser(body);
    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/users:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// GET /api/users?id=...
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'User ID parameter is required' }, { status: 400 });
    }

    const user = await getUserById(id);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error in GET /api/users:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
