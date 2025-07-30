#!/usr/bin/env node

const fs = require('fs');
const { exec } = require('child_process');

// Read the backup file
const originalContent = fs.readFileSync('/Users/bentyson/pad/src/app/dashboard/profile/page.tsx.backup', 'utf8');
const lines = originalContent.split('\n');

// Create a minimal component template
const minimalComponent = `'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  
  if (status === 'loading') {
    return <div>Loading...</div>;
  }
  
  if (!session?.user) {
    return <div>Not authenticated</div>;
  }
  
  return (
    <div className="min-h-screen bg-white">
      <h1>Profile Page</h1>
    </div>
  );
}`;

// Test function to check if compilation works
function testCompilation() {
  return new Promise((resolve) => {
    exec('npm run build', { cwd: '/Users/bentyson/pad' }, (error, stdout, stderr) => {
      if (error || stderr.includes('Failed to compile')) {
        resolve(false);
      } else {
        resolve(true);
      }
    });
  });
}

async function findProblemSection() {
  console.log('Starting systematic debugging...');
  
  // First test with minimal component
  fs.writeFileSync('/Users/bentyson/pad/src/app/dashboard/profile/page.tsx', minimalComponent);
  const minimalWorks = await testCompilation();
  console.log('Minimal component works:', minimalWorks);
  
  if (!minimalWorks) {
    console.log('Even minimal component fails - issue is in imports or basic structure');
    return;
  }
  
  // Now we know the issue is in the component content
  // Let's add back sections progressively
  const sections = [
    { name: 'Constants and imports', start: 1, end: 154 },
    { name: 'Component start and basic state', start: 155, end: 220 },
    { name: 'Additional state', start: 221, end: 330 },
    { name: 'useEffect', start: 332, end: 487 },
    { name: 'Loading and auth checks', start: 489, end: 523 },
    { name: 'Helper functions', start: 535, end: 823 },
    { name: 'handleSave function', start: 825, end: 856 }
  ];
  
  let workingContent = minimalComponent;
  
  for (const section of sections) {
    console.log(`Testing section: ${section.name}`);
    const sectionContent = lines.slice(section.start - 1, section.end).join('\n');
    const newContent = workingContent.replace(
      'export default function ProfilePage() {',
      sectionContent + '\n\nexport default function ProfilePage() {'
    );
    
    fs.writeFileSync('/Users/bentyson/pad/src/app/dashboard/profile/page.tsx', newContent);
    const works = await testCompilation();
    
    if (!works) {
      console.log(`❌ Section "${section.name}" (lines ${section.start}-${section.end}) causes the error!`);
      console.log('First few lines of problematic section:');
      console.log(sectionContent.split('\n').slice(0, 5).join('\n'));
      break;
    } else {
      console.log(`✅ Section "${section.name}" is fine`);
      workingContent = newContent;
    }
  }
}

findProblemSection().catch(console.error);