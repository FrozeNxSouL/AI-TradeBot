// pages/upload.tsx
import type { NextPage } from 'next';
import Head from 'next/head';
import FileUploader from './fileUploader';

const UploadPage: NextPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <Head>
        <title>Zip File Uploader</title>
        <meta name="description" content="Upload and rename zip files" />
      </Head>

      <main className="container mx-auto px-4">
        <h1 className="text-2xl font-bold text-center mb-8">Zip File Uploader</h1>
        <FileUploader />
      </main>
    </div>
  );
};

export default UploadPage;