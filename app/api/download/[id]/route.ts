import { NextRequest, NextResponse } from 'next/server';
import { unlink } from 'fs/promises';
import { join } from 'path';
import { tmpdir } from 'os';
import { readFile } from 'fs/promises';
import { downloadFromShelby } from '@/lib/shelby';
import { createServiceClient } from '@/lib/supabase';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  let tempPath: string | null = null;

  try {
    const { id: shareId } = await params;  // <-- THÊM DÒNG NÀY
    
    // Thay "const shareId = params.id;" bằng dòng trên

    // Get file metadata from database
    const supabase = createServiceClient();
    const { data: upload, error: dbError } = await supabase
      .from('uploads')
      .select('*')
      .eq('share_id', shareId)
      .single();

    if (dbError || !upload) {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      );
    }

    // Check if expired
    if (new Date(upload.expires_at) < new Date()) {
      return NextResponse.json(
        { error: 'File has expired' },
        { status: 410 }
      );
    }

    // Download from Shelby to temp file
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(7);
    tempPath = join(tmpdir(), `download-${timestamp}-${randomStr}`);

    console.log('Downloading from Shelby:', upload.shelby_path);
    await downloadFromShelby(upload.shelby_path, tempPath);
    console.log('Download complete');

    // Read file
    const fileBuffer = await readFile(tempPath);

    // Increment download count
    await supabase
      .from('uploads')
      .update({ download_count: upload.download_count + 1 })
      .eq('id', upload.id);

    // Update stats
    await supabase.rpc('increment_download_stats');

    // Return file
    const response = new NextResponse(fileBuffer);
    response.headers.set('Content-Type', upload.mime_type || 'application/octet-stream');
    response.headers.set('Content-Disposition', `attachment; filename="${upload.original_filename}"`);
    response.headers.set('Content-Length', upload.file_size.toString());

    // Cleanup happens after response is sent
    if (tempPath) {
      setImmediate(async () => {
        try {
          await unlink(tempPath!);
          console.log('Temp file cleaned up');
        } catch (err) {
          console.error('Failed to cleanup temp file:', err);
        }
      });
    }

    return response;

  } catch (error) {
    console.error('Download error:', error);
    
    // Cleanup on error
    if (tempPath) {
      try {
        await unlink(tempPath);
      } catch (err) {
        console.error('Failed to cleanup temp file:', err);
      }
    }

    return NextResponse.json(
      { error: 'Download failed' },
      { status: 500 }
    );
  }
}
