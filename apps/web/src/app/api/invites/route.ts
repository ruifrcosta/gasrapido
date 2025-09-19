import { NextResponse } from 'next/server';

// POST /api/invites - Create a new invitation
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, email, expiryDays } = body;
    
    // Validate input
    if (!type || !email) {
      return NextResponse.json({ error: 'Missing required fields: type and email' }, { status: 400 });
    }
    
    // Mock response for now
    return NextResponse.json({
      success: true,
      invite: {
        id: 'mock-id',
        code: 'ABC123',
        type,
        email,
        status: 'pending',
        expiresAt: new Date(Date.now() + (expiryDays || 7) * 24 * 60 * 60 * 1000).toISOString()
      }
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// GET /api/invites - Get all invitations with optional filters
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const status = searchParams.get('status');
    
    // Mock response for now
    return NextResponse.json({
      success: true,
      invites: [
        {
          id: 'mock-id-1',
          code: 'ABC123',
          type: 'vendor',
          email: 'vendor@example.com',
          status: 'pending',
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'mock-id-2',
          code: 'XYZ789',
          type: 'courier',
          email: 'courier@example.com',
          status: 'accepted',
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
        }
      ]
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}