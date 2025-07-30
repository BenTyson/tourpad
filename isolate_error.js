#!/usr/bin/env node

const fs = require('fs');
const { exec } = require('child_process');

const originalFile = '/Users/bentyson/pad/src/app/dashboard/profile/page.tsx.backup';
const targetFile = '/Users/bentyson/pad/src/app/dashboard/profile/page.tsx';

function testCompilation() {
  return new Promise((resolve) => {
    exec('timeout 30s npm run build', { cwd: '/Users/bentyson/pad' }, (error, stdout, stderr) => {
      if (error || stderr.includes('Failed to compile') || stdout.includes('Failed to compile')) {
        resolve(false);
      } else if (stdout.includes('✓ Compiled successfully')) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  });
}

async function binarySearchError() {
  const content = fs.readFileSync(originalFile, 'utf8');
  const lines = content.split('\n');
  
  // We know the error is at line 862 in the return statement
  // So we need to find what before line 861 is causing the issue
  
  console.log('Starting binary search for the problematic line...');
  
  let start = 1;
  let end = 860; // Just before the return statement
  
  while (start < end) {
    const mid = Math.floor((start + end) / 2);
    console.log(`Testing with lines 1-${mid} + minimal return...`);
    
    // Create test content with lines 1 to mid, then add minimal return
    const testLines = lines.slice(0, mid);
    
    // Add a minimal component structure to close any open constructs
    const minimalEnd = `
  
  return (
    <div className="min-h-screen bg-white">
      <h1>Profile Page</h1>
    </div>
  );
}`;
    
    const testContent = testLines.join('\n') + minimalEnd;
    fs.writeFileSync(targetFile, testContent);
    
    const works = await testCompilation();
    
    if (works) {
      console.log(`✅ Lines 1-${mid} are OK`);
      start = mid + 1;
    } else {
      console.log(`❌ Problem is in lines 1-${mid}`);
      end = mid;
    }
  }
  
  console.log(`🎯 The problem is at line ${start}!`);
  console.log('Problematic line content:');
  console.log(`${start}: ${lines[start - 1]}`);
  
  // Show context around the problematic line
  console.log('\nContext (5 lines before and after):');
  for (let i = Math.max(0, start - 6); i < Math.min(lines.length, start + 5); i++) {
    const marker = i === start - 1 ? '>>> ' : '    ';
    console.log(`${marker}${i + 1}: ${lines[i]}`);
  }
}

binarySearchError().catch(console.error);