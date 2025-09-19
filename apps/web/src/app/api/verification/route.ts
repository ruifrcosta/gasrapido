import { NextResponse } from 'next/server';

// POST /api/verification/documents - Upload a verification document
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const userId = formData.get('userId') as string;
    const documentType = formData.get('documentType') as string;
    const file = formData.get('file') as File;
    
    // Validate input
    if (!userId || !documentType || !file) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    // Mock response for now
    return NextResponse.json({
      success: true,
      document: {
        id: 'mock-document-id',
        userId,
        documentType,
        fileName: file.name,
        mimeType: file.type,
        fileSize: file.size,
        status: 'pending',
        uploadedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// GET /api/verification/status - Get verification status for a user
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json({ error: 'Missing userId parameter' }, { status: 400 });
    }
    
    // Mock response for now
    return NextResponse.json({
      success: true,
      status: {
        userId,
        status: 'pending',
        documents: [
          {
            documentId: 'doc-1',
            type: 'id',
            status: 'uploaded',
            name: 'id-document.pdf',
            uploadedAt: new Date().toISOString()
          }
        ],
        lastUpdated: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}