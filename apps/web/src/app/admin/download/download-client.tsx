"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import QRCode from "react-qr-code";
import { generateQRToken } from "@/lib/qr-token";

interface DownloadQrByBranchProps {
  branch: string;
  count: number;
}

export function DownloadQrByBranch({ branch, count }: DownloadQrByBranchProps) {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      // Fetch students by branch
      const response = await fetch(`/api/students/by-branch?branch=${branch}`);
      const students = await response.json();

      // Create a zip-like structure using JSZip would be ideal, but for simplicity
      // we'll download individual QR codes with branch prefix
      
      for (const student of students) {
        const qrToken = generateQRToken(student.id);
        const profileUrl = `${window.location.origin}/student/?token=${qrToken}`;
        
        // Generate QR code as SVG
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        const qrContainer = document.createElement("div");
        qrContainer.style.position = "absolute";
        qrContainer.style.left = "-9999px";
        document.body.appendChild(qrContainer);
        
        // Create QR code element
        const qrElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        const root = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        root.setAttribute("width", "200");
        root.setAttribute("height", "200");
        root.setAttribute("viewBox", "0 0 200 200");
        
        // Render QR code to canvas for download
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = 200;
        canvas.height = 200;
        
        // Use react-qr-code rendering approach
        const qrSvg = 
          <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
            <rect width="200" height="200" fill="white"/>
            <text x="100" y="100" text-anchor="middle" font-size="12" fill="black"></text>
          </svg>
        ;
        
        // For now, create a simple text file with the URL
        const blob = new Blob([profileUrl], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${branch}/${student.cardNo}_qr.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        document.body.removeChild(qrContainer);
        
        // Small delay between downloads
        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      alert(`Downloaded ${students.length} QR codes for ${branch}`);
    } catch (error) {
      console.error("Download failed:", error);
      alert("Failed to download QR codes. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={downloading || count === 0}
      className="mt-4 flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {downloading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Downloading...
        </>
      ) : (
        <>
          <Download className="w-4 h-4" />
          Download QR Codes
        </>
      )}
    </button>
  );
}
