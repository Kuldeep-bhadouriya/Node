"use client";

import { Download, Loader2 } from "lucide-react";
import { useState } from "react";

interface DownloadQrByBranchProps {
  branch: string;
  count: number;
}

interface BranchStudent {
  cardNo: string;
  name: string;
  profileUrl: string;
}

export function DownloadQrByBranch({ branch, count }: DownloadQrByBranchProps) {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      // Fetch students by branch with server-signed profile URLs
      const response = await fetch(`/api/students/by-branch?branch=${branch}`);
      const students: BranchStudent[] = await response.json();

      for (const student of students) {
        // For now, create a simple text file with the URL
        const blob = new Blob([student.profileUrl], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${branch}/${student.cardNo}_qr.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

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
      type="button"
      onClick={handleDownload}
      disabled={downloading || count === 0}
      className="mt-4 flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {downloading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Downloading...
        </>
      ) : (
        <>
          <Download className="h-4 w-4" />
          Download QR Codes
        </>
      )}
    </button>
  );
}
