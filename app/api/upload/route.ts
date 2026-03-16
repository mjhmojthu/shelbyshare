import { NextRequest, NextResponse } from 'next/server';
import { writeFile, unlink } from 'fs/promises';
import { join } from 'path';
import { tmpdir } from 'os';
import { uploadToShelby } from '@/lib/shelby';
import { createServiceClient } from '@/lib/supabase';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  let tempPath: string | null = null;

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file size (100MB max)
    const maxSize = 100 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 100MB' },
        { status: 400 }
      );
    }

    // Save file temporarily
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(7);
    tempPath = join(tmpdir(), `upload-${timestamp}-${randomStr}`);
    
    await writeFile(tempPath, buffer);
    console.log('File saved temporarily:', tempPath);

    // Upload to Shelby
    console.log('Uploading to Shelby...');
    const { shelbyPath, shareId } = await uploadToShelby(tempPath, 7);
    console.log('Shelby upload complete:', { shelbyPath, shareId });

    // Save metadata to database
    const supabase = createServiceClient();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const { data, error: dbError } = await supabase
      .from('uploads')
      .insert({
        share_id: shareId,
        original_filename: file.name,
        shelby_path: shelbyPath,
        file_size: file.size,
        mime_type: file.type || 'application/octet-stream',
        expires_at: expiresAt.toISOString(),
        ip_address: req.headers.get('x-forwarded-for') || 'unknown',
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      throw new Error('Failed to save upload metadata');
    }

    // Update stats
    await supabase.rpc('increment_upload_stats', {
      bytes: file.size,
    });

    console.log('Upload complete:', data);

    return NextResponse.json({
      shareId,
      shareUrl: `${process.env.NEXT_PUBLIC_URL}/d/${shareId}`,
      expiresAt: data.expires_at,
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Upload failed',
      },
      { status: 500 }
    );
  } finally {
    // Cleanup temp file
    if (tempPath) {
      try {
        await unlink(tempPath);
        console.log('Temp file cleaned up');
      } catch (err) {
        console.error('Failed to cleanup temp file:', err);
      }
    }
  }
}
