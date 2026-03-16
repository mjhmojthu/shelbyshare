import { notFound } from 'next/navigation';
import { DownloadButton } from '@/components/DownloadButton';
import { createClient } from '@/lib/supabase';

export default async function DownloadPage({
  params,
}: {
  params: { shareId: string };
}) {
  const supabase = createClient();

  const { data: upload } = await supabase
    .from('uploads')
    .select('*')
    .eq('share_id', params.shareId)
    .single();

  if (!upload) {
    notFound();
  }

  // Check if expired
  const isExpired = new Date(upload.expires_at) < new Date();

  if (isExpired) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="text-center bg-white rounded-2xl shadow-xl p-12 max-w-md">
          <div className="text-6xl mb-6">⏰</div>
          <h1 className="text-3xl font-bold mb-4 text-gray-900">
            File Expired
          </h1>
          <p className="text-gray-600 mb-8">
            This file is no longer available.
          </p>
          <a
            href="/"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Upload a File
          </a>
        </div>
      </div>
    );
  }

  const fileSizeMB = (upload.file_size / 1024 / 1024).toFixed(2);
  const expiresAt = new Date(upload.expires_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 max-w-lg w-full">
        <div className="text-center">
          {/* File Icon */}
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">📁</span>
          </div>
          
          {/* File Info */}
          <h1 className="text-2xl md:text-3xl font-bold mb-2 text-gray-900 break-all">
            {upload.original_filename}
          </h1>
          
          <p className="text-gray-600 mb-8">
            Size: {fileSizeMB} MB
          </p>

          {/* Download Button */}
          <DownloadButton 
            shareId={params.shareId}
            filename={upload.original_filename}
          />

          {/* Expiration Notice */}
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              ⏰ Expires: {expiresAt}
            </p>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500 mb-3">
              Powered by Shelby Protocol
            </p>
            <a
              href="/"
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Upload your own file →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
