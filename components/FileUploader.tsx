'use client';

import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File } from 'lucide-react';

interface Props {
  onUpload: (file: File) => void;
  uploading: boolean;
}

export function FileUploader({ onUpload, uploading }: Props) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles[0]) {
      onUpload(acceptedFiles[0]);
    }
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    maxSize: 100 * 1024 * 1024, // 100MB
    disabled: uploading,
  });

  return (
    <div
      {...getRootProps()}
      className={`
        border-2 border-dashed rounded-xl p-12 text-center 
        cursor-pointer transition-all
        ${uploading ? 'opacity-50 cursor-not-allowed bg-gray-50' : ''}
        ${isDragActive 
          ? 'border-blue-500 bg-blue-50 scale-105' 
          : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
        }
      `}
    >
      <input {...getInputProps()} />
      
      <div className="flex flex-col items-center gap-4">
        {uploading ? (
          <>
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <div>
              <p className="text-lg font-medium text-gray-700">Uploading...</p>
              <p className="text-sm text-gray-500 mt-1">
                This may take a moment
              </p>
            </div>
          </>
        ) : isDragActive ? (
          <>
            <Upload className="w-16 h-16 text-blue-500" />
            <p className="text-lg font-medium text-blue-600">
              Drop your file here
            </p>
          </>
        ) : (
          <>
            <File className="w-16 h-16 text-gray-400" />
            <div>
              <p className="text-lg font-semibold text-gray-700 mb-2">
                Drag & drop your file here
              </p>
              <p className="text-sm text-gray-500">
                or click to browse
              </p>
              <p className="text-xs text-gray-400 mt-2">
                Max file size: 100MB
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
