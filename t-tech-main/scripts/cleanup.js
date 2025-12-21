// Clean up build files and temp directories
const fs = require('fs');
const path = require('path');

const dirsToRemove = [
  '.next',
  'node_modules',
  '.vercel',
  'logs',
  'temp',
  'dist',
  'build',
  'data'
];

const filesToRemove = [
  'index.html',               // Old Vite file
  'vite.config.ts',           // Old Vite config
  'DEPLOYMENT_COMPLETE.md',   // Redundant docs
  'GITHUB_READY.md',          // Redundant docs
  'LOCAL_DEVELOPMENT.md',     // Redundant docs
  'PRODUCTION.md',            // Redundant docs
  'REQUIRED_SERVICES.md',     // Redundant docs
  'TESTING_GUIDE.md',         // Redundant docs
  'ATTRIBUTIONS.md',          // Not needed
  'SETUP.md',                 // Covered in README
  '.DS_Store',
  'Thumbs.db',
  'npm-debug.log',
  'yarn-error.log'
];

console.log('🧹 Cleaning unnecessary files...');

dirsToRemove.forEach(dir => {
  const dirPath = path.join(process.cwd(), dir);
  if (fs.existsSync(dirPath)) {
    console.log(`Removing directory: ${dir}`);
    fs.rmSync(dirPath, { recursive: true, force: true });
  }
});

filesToRemove.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    console.log(`Removing file: ${file}`);
    fs.rmSync(filePath, { force: true });
  }
});

console.log('✅ Cleanup complete!');
console.log('📝 Ready for GitHub push!');