import { NextRequest, NextResponse } from 'next/server';
import { createUser, getUserById } from '../../../lib/userService';
import type { CreateUserRequest } from '../../../types/user';
import { log } from '../../utils/logger';

// POST /api/users - Create user
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as CreateUserRequest;

    if (!body.email || !body.name) {
      return NextResponse.json({ error: 'Email and name are required' }, { status: 400 });
    }

    // Create new user
    const newUser = await createUser(body);
    log.api.response('POST', '/api/users', 201);
    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    log.api.error('POST', '/api/users', error as Error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// GET /api/users?id=...
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  try {
    if (!id) {
      return NextResponse.json({ error: 'User ID parameter is required' }, { status: 400 });
    }

    const user = await getUserById(id);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    log.api.response('GET', '/api/users', 200);
    return NextResponse.json(user);
  } catch (error) {
    log.api.error('GET', '/api/users', error as Error, id || undefined);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
