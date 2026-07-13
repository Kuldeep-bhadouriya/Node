import Link from "next/link";
import { ShieldAlert } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-sm border max-w-md w-full text-center flex flex-col items-center">
        <ShieldAlert className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-slate-900">Invalid ID Card</h2>
        <p className="text-slate-500 mt-2 mb-6">
          The scanned QR code is invalid or the student profile could not be found in the database.
        </p>
        <Link 
          href="/" 
          className="bg-slate-900 text-white px-6 py-2 rounded-lg font-medium hover:bg-slate-800 transition-colors"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
