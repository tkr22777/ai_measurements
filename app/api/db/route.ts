import { NextRequest, NextResponse } from 'next/server';
import { db, initializeDb } from '@/app/utils/db';

// Initialize the database
initializeDb();

// Track last increment time to prevent duplicate increments
let lastIncrementTime = 0;
const THROTTLE_INTERVAL = 3000; // 3 seconds

/**
 * GET /api/db - Get all data or a specific key
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const key = searchParams.get('key');
  
  // If a key is provided, return just that value
  if (key) {
    const value = db.get(key);
    if (value === undefined) {
      return NextResponse.json({ error: 'Key not found' }, { status: 404 });
    }
    return NextResponse.json({ [key]: value });
  }
  
  // Otherwise return all data
  return NextResponse.json(db.getAll());
}

/**
 * POST /api/db - Set a value for a key
 * Body: { key: string, value: any }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { key, value } = body;
    
    if (!key) {
      return NextResponse.json({ error: 'Key is required' }, { status: 400 });
    }
    
    const result = db.set(key, value);
    return NextResponse.json({ [key]: result }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}

/**
 * PATCH /api/db - Increment a counter value
 */
export async function PATCH(request: NextRequest) {
  const now = Date.now();
  const searchParams = request.nextUrl.searchParams;
  const key = searchParams.get('key') || 'visitCount';
  
  // Prevent rapid successive increments (throttling)
  if (now - lastIncrementTime < THROTTLE_INTERVAL) {
    // If a request comes in too quickly after the last one, just return the current count
    return NextResponse.json({ 
      key,
      value: db.get(key) || 0,
      throttled: true
    });
  }
  
  // Update the last increment time
  lastIncrementTime = now;
  
  // Increment the counter for the specified key
  const currentCount = db.get(key) || 0;
  const newCount = currentCount + 1;
  db.set(key, newCount);
  
  return NextResponse.json({ key, value: newCount });
} 