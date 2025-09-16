'use client';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function MessagesHeader() {
  return (
    <div className="border-b border-neutral-200 bg-white">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard">
              <button className="inline-flex items-center px-3 py-2 text-sm font-medium text-neutral-700 bg-transparent hover:bg-neutral-100 rounded-md transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Dashboard
              </button>
            </Link>
            <div className="h-6 w-px bg-neutral-200"></div>
            <h1 className="text-xl font-semibold text-neutral-900">Messages</h1>
          </div>
        </div>
      </div>
    </div>
  );
}