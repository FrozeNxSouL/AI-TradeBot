// components/ZipFileUploader.tsx
'use client';

import { Modeltype, Timeframetype } from '@/types/types';
import { Input } from '@heroui/input';
import { Select, SelectItem } from '@heroui/select';
import { useState, useRef, ChangeEvent, FormEvent } from 'react';

interface UploadResponse {
  success: boolean;
  message: string;
  filePath?: string;
}

export default function ZipFileUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadStatus, setUploadStatus] = useState<UploadResponse | null>(null);
  const [inputTimeframe, setInputTimeframe] = useState<string>("");
  const [inputCurrency, setInputCurrency] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];

    if (selectedFile && selectedFile.type ==='application/x-zip-compressed') {
      setFile(selectedFile);
      // Set default new filename (original name without extension)
      // const nameWithoutExtension = selectedFile.name.replace(/\.zip$/, '');
    } else if (selectedFile) {
      alert('Please select a zip file');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!file || !inputCurrency || !inputTimeframe) {
      alert('Please select a file and Select all Data');
      return;
    }

    setIsUploading(true);
    setUploadStatus(null);

    try {
      const formData = new FormData();
      formData.append('zipFile', file);
      formData.append('currency', inputCurrency);
      formData.append('timeframe', inputTimeframe);

      const response = await fetch('/api/admin/upload_model', {
        method: 'POST',
        body: formData,
      });

      const result: UploadResponse = await response.json();

      setUploadStatus(result);

      if (result.success) {
        // Reset form on success
        setFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    } catch (error) {
      console.error('Upload error:', error);
      setUploadStatus({
        success: false,
        message: 'An error occurred during upload'
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Upload Zip File</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="zipFile" className="block text-sm font-medium text-gray-700">
            Select Zip File
          </label>
          <input
            type="file"
            id="zipFile"
            accept=".zip"
            onChange={handleFileChange}
            ref={fileInputRef}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            required
          />
        </div>

        <div className="flex w-full flex-wrap md:flex-nowrap md:mb-0 gap-4">
          <Select
            id="currency"
            color="primary"
            labelPlacement="outside"
            size="lg"
            className="max-w-md font-semibold mx-10 p-5"
            label="CURRENCY"
            variant="underlined"
            placeholder="Select Currency"
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setInputCurrency(e.target.value)}
            required
          >
            {Object.values(Modeltype).map((value) => (
              <SelectItem key={value} className="text-foreground px-5">
                {value}
              </SelectItem>
            ))}
          </Select>
        </div>

        <div className="flex w-full flex-wrap md:flex-nowrap md:mb-0 gap-4">
          <Select
            id="timeframe"
            color="primary"
            labelPlacement="outside"
            size="lg"
            className="max-w-md font-semibold mx-10 p-5"
            label="TIMEFRAME"
            variant="underlined"
            placeholder="Select Timeframe"
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setInputTimeframe(e.target.value)}
            required
          >
            {Object.values(Timeframetype).map((value) => (
              <SelectItem key={value} className="text-foreground px-5">
                {value}
              </SelectItem>
            ))}
          </Select>
        </div>

        {file && (
          <div className="space-y-2">
            <p className="block text-sm font-medium text-gray-700">
              Filename : {inputCurrency} {inputTimeframe}
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={!file || isUploading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed"
        >
          {isUploading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Uploading...
            </span>
          ) : (
            'Upload File'
          )}
        </button>
      </form>

      {uploadStatus && (
        <div className={`mt-4 p-3 rounded-md ${uploadStatus.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          <p>{uploadStatus.message}</p>
          {uploadStatus.success && uploadStatus.filePath && (
            <p className="text-sm mt-1">Saved to: {uploadStatus.filePath}</p>
          )}
        </div>
      )}
    </div>
  );
}