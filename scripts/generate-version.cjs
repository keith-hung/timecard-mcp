#!/usr/bin/env node

/**
 * Generate version.json with git information
 * This script is run during prebuild to capture version info
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function getGitInfo() {
  try {
    // Get short commit hash
    const commit = execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim();

    // Get branch name
    const branch = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' }).trim();

    // Check if there are uncommitted changes (dirty)
    let dirty = false;
    try {
      execSync('git diff --quiet', { encoding: 'utf8' });
      execSync('git diff --cached --quiet', { encoding: 'utf8' });
    } catch {
      dirty = true;
    }

    return {
      commit: dirty ? `${commit}-dirty` : commit,
      branch,
      buildDate: new Date().toISOString()
    };
  } catch (error) {
    // Not a git repository or git not available
    return {
      commit: 'unknown',
      branch: 'unknown',
      buildDate: new Date().toISOString()
    };
  }
}

const versionInfo = getGitInfo();

// Generate to both src/ (for TypeScript) and dist/ (for runtime)
const srcPath = path.join(__dirname, '..', 'src', 'version.json');
const distPath = path.join(__dirname, '..', 'dist', 'version.json');

// Ensure dist directory exists
const distDir = path.join(__dirname, '..', 'dist');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

fs.writeFileSync(srcPath, JSON.stringify(versionInfo, null, 2));
fs.writeFileSync(distPath, JSON.stringify(versionInfo, null, 2));

console.log(`Generated version.json: ${versionInfo.commit} (${versionInfo.branch})`);
