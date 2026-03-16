'use client';

import { useState } from 'react';
import { FileUploader } from '@/components/FileUploader';
import { ShareLink } from '@/components/ShareLink';

export default function Home() {
  const [shareData, setShareData] = useState<{
    url: string;
    expiresAt: string;
  } | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleUpload = async (file: File) => {
    setUploading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Upload failed');
      }

      const data = await res.json();
      setShareData({
        url: data.shareUrl,
        expiresAt: data.expiresAt,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleReset = () => {
    setShareData(null);
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">S</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">ShelbyShare</h1>
          </div>
          <a 
            href="https://github.com/mjhmojthu/shelbyshare" 
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            GitHub
          </a>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 md:py-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-6xl font-bold mb-4 text-gray-900">
            Share Files. <span className="text-blue-600">Securely.</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Decentralized file sharing powered by Shelby Protocol.
            No signup required.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          {!shareData ? (
            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
              <FileUploader 
                onUpload={handleUpload}
                uploading={uploading}
              />
              {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}
            </div>
          ) : (
            <ShareLink 
              url={shareData.url} 
              expiresAt={shareData.expiresAt}
              onReset={handleReset}
            />
          )}
        </div>

        {/* Features */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <FeatureCard
            icon="🔒"
            title="Decentralized"
            description="Files stored on distributed network, not centralized servers"
          />
          <FeatureCard
            icon="⚡"
            title="Fast & Simple"
            description="Upload and share in seconds. No account required"
          />
          <FeatureCard
            icon="⏰"
            title="Auto-Delete"
            description="Files automatically expire after 7 days"
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 mt-20 text-center text-sm text-gray-500">
        <p>Powered by 2NH on Shelby 🚀</p>
      </footer>
    </div>
  );
}

function FeatureCard({ 
  icon, 
  title, 
  description 
}: { 
  icon: string; 
  title: string; 
  description: string;
}) {
  return (
    <div className="text-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
      <div className="text-4xl mb-3">{icon}</div>
      <h3 className="text-lg font-semibold mb-2 text-gray-900">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
}
