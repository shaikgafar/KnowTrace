'use client';

import React, { useState, useRef } from 'react';
import { CourseMaterial, MaterialType } from '@/types';
import {
  UploadCloud,
  FileText,
  Presentation,
  Video,
  Trash2,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

interface UploadDropzoneProps {
  materials: CourseMaterial[];
  onAddMaterial: (mat: { name: string; type: MaterialType; size: string }) => void;
  onRemoveMaterial: (id: string) => void;
  onPreloadDemoFiles: () => void;
}

export function UploadDropzone({
  materials,
  onAddMaterial,
  onRemoveMaterial,
  onPreloadDemoFiles,
}: UploadDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const processFiles = (files: FileList | null) => {
    if (!files) return;
    for (let i = 0; i < files.length; i++) {
      const f = files[i];
      let type: MaterialType = 'pdf';
      const ext = f.name.split('.').pop()?.toLowerCase();
      if (ext === 'ppt' || ext === 'pptx') type = 'pptx';
      else if (ext === 'mp4' || ext === 'mov' || ext === 'webm') type = 'video';

      const sizeStr = (f.size / (1024 * 1024)).toFixed(1) + ' MB';
      onAddMaterial({
        name: f.name,
        type,
        size: sizeStr,
      });
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    processFiles(e.dataTransfer.files);
  };

  const getIcon = (type: MaterialType) => {
    switch (type) {
      case 'pdf':
        return <FileText className="w-5 h-5 text-indigo-500" />;
      case 'ppt':
      case 'pptx':
        return <Presentation className="w-5 h-5 text-amber-500" />;
      case 'video':
        return <Video className="w-5 h-5 text-rose-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative p-8 sm:p-12 rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center text-center cursor-pointer ${
          isDragging
            ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/30 scale-[1.01]'
            : 'border-zinc-300 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-900/30 hover:border-indigo-400 hover:bg-zinc-50 dark:hover:bg-zinc-900/60'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.ppt,.pptx,.mp4,.mov"
          className="hidden"
          onChange={(e) => processFiles(e.target.files)}
        />

        <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-4 shadow-xs">
          <UploadCloud className="w-8 h-8" />
        </div>

        <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mb-1">
          Drag & Drop Files Here
        </h3>
        <p className="text-xs text-zinc-500 mb-4 max-w-sm">
          or <span className="text-indigo-600 dark:text-indigo-400 font-semibold underline">Browse your computer</span> to upload textbooks, lecture slides, and videos
        </p>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-[11px] font-semibold text-zinc-600 dark:text-zinc-400 font-mono">
          <span>PDF</span> • <span>PPT / PPTX</span> • <span>MP4 Video</span>
        </div>
      </div>

      <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 border border-indigo-100 dark:border-indigo-900/40">
        <div className="flex items-center gap-3">
          <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
          <div className="text-xs">
            <span className="font-bold text-indigo-950 dark:text-indigo-200">
              Need sample lecture materials?
            </span>
            <p className="text-indigo-700/80 dark:text-indigo-300/80">
              1-click load real CS 229 Machine Learning slides, notes, and video session.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onPreloadDemoFiles}
          className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors shrink-0 cursor-pointer"
        >
          Load Demo Materials
        </button>
      </div>

      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-3">
          Uploaded Materials ({materials.length})
        </h4>

        {materials.length === 0 ? (
          <div className="p-6 text-center text-xs text-zinc-400 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900">
            No files staged for processing yet.
          </div>
        ) : (
          <div className="space-y-2">
            {materials.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xs hover:border-zinc-300 dark:hover:border-zinc-700 transition-all"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2 rounded-lg bg-zinc-50 dark:bg-zinc-800">
                    {getIcon(file.type)}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate">
                      {file.name}
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-zinc-400 font-mono mt-0.5">
                      <span className="uppercase">{file.type}</span>
                      <span>•</span>
                      <span>{file.size}</span>
                      <span>•</span>
                      <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-sans">
                        <CheckCircle2 className="w-3 h-3" /> Ready
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onRemoveMaterial(file.id)}
                  className="p-2 text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
                  title="Remove file"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
