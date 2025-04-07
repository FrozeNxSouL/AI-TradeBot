'use client';

import { Button } from "@heroui/button";

const downloadLink = "https://drive.google.com/uc?export=download&id=11VS1Kafu8VIxes2fyQRkXKF1W-eHhHlq";

export default function FileDownloader() {
  return (
    <Button
      onPress={() => window.open(downloadLink, "_blank")}
      className="w-fit bg-primary text-background hover:bg-background hover:text-primary hover:ring-2 hover:ring-primary"
    >
      <svg className="-ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
      Get Expert Advisor
    </Button>
  )
}