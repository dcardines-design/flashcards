'use client';

import { useState, useCallback } from 'react';
import { Upload, FileText, X, Loader2 } from 'lucide-react';

interface FileUploaderProps {
  onFileContent: (content: string, fileName: string) => void;
  isProcessing?: boolean;
}

export default function FileUploader({ onFileContent, isProcessing }: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const acceptedTypes = ['.pdf', '.docx', '.txt', '.md'];

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragOut = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const processFile = async (selectedFile: File) => {
    setError(null);
    const extension = selectedFile.name.split('.').pop()?.toLowerCase();

    if (!extension || !['pdf', 'docx', 'txt', 'md'].includes(extension)) {
      setError('Please upload a PDF, DOCX, TXT, or MD file');
      return;
    }

    setFile(selectedFile);

    // Create FormData and send to API for parsing
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await fetch('/api/parse', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to parse file');
      }

      const { content } = await response.json();
      onFileContent(content, selectedFile.name);
    } catch {
      setError('Failed to parse file. Please try again.');
      setFile(null);
    }
  };

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile) {
        await processFile(droppedFile);
      }
    },
    [onFileContent]
  );

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      await processFile(selectedFile);
    }
  };

  const clearFile = () => {
    setFile(null);
    setError(null);
  };

  return (
    <div className="w-full">
      {!file ? (
        <div
          onDrag={handleDrag}
          onDragEnter={handleDragIn}
          onDragLeave={handleDragOut}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
            isDragging
              ? 'border-emerald-500 bg-emerald-500/10'
              : 'border-zinc-700 hover:border-zinc-600 bg-zinc-900'
          }`}
        >
          <input
            type="file"
            accept={acceptedTypes.join(',')}
            onChange={handleFileSelect}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <Upload
            className={`w-10 h-10 mx-auto mb-3 ${
              isDragging ? 'text-emerald-400' : 'text-zinc-500'
            }`}
          />
          <p className="text-zinc-300 font-medium">
            Drop your file here or click to browse
          </p>
          <p className="text-sm text-zinc-600 mt-1">
            Supports PDF, DOCX, TXT, MD
          </p>
        </div>
      ) : (
        <div className="flex items-center gap-3 p-4 bg-zinc-900 border border-zinc-800 rounded-xl">
          <div className="p-2 bg-emerald-500/20 rounded-lg">
            <FileText className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {file.name}
            </p>
            <p className="text-xs text-zinc-500">
              {(file.size / 1024).toFixed(1)} KB
            </p>
          </div>
          {isProcessing ? (
            <Loader2 className="w-5 h-5 text-emerald-400 animate-spin" />
          ) : (
            <button
              onClick={clearFile}
              className="p-1 hover:bg-zinc-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-zinc-500" />
            </button>
          )}
        </div>
      )}

      {error && (
        <p className="mt-2 text-sm text-red-400">{error}</p>
      )}
    </div>
  );
}
