'use client';

import { useState } from 'react';
import { Check, Copy, RotateCcw } from 'lucide-react';

interface Props {
  url: string;
  expiresAt: string;
  onReset: () => void;
}

export function ShareLink({ url, expiresAt, onReset }: Props) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatExpiry = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
      {/* Success Icon */}
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <Check className="w-10 h-10 text-green-600" />
      </div>
      
      <h2 className="text-3xl font-bold mb-2 text-gray-900">
        File Uploaded!
      </h2>
      
      <p className="text-gray-600 mb-8">
        Share this link with anyone
      </p>

      {/* Share Link */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-2">
          <code className="text-sm flex-1 text-left overflow-x-auto text-gray-700">
            {url}
          </code>
          <button
            onClick={copyToClipboard}
            className="flex-shrink-0 p-2 hover:bg-gray-200 rounded-lg transition-colors"
            title="Copy to clipboard"
          >
            {copied ? (
              <Check className="w-5 h-5 text-green-600" />
            ) : (
              <Copy className="w-5 h-5 text-gray-600" />
            )}
          </button>
        </div>
      </div>

      {/* Expiration Info */}
      <div className="mb-8 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-800">
          ⏰ Expires on {formatExpiry(expiresAt)}
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={copyToClipboard}
          className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
        >
          {copied ? (
            <>
              <Check className="w-5 h-5" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-5 h-5" />
              Copy Link
            </>
          )}
        </button>
        
        <button
          onClick={onReset}
          className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-5 h-5" />
          Upload Another
        </button>
      </div>
    </div>
  );
}
