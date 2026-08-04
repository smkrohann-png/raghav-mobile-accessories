const fs = require('fs');
const path = require('path');

const dirsToScan = ['app', 'components'];

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  // Only replace "orange" when it is part of a tailwind color class e.g., orange-50, orange-100, etc.
  // Or text-orange, bg-orange, hover:bg-orange, etc.
  // Using a simple regex to replace 'orange-' with 'emerald-'
  // We'll also check if it's 'orange' exactly in some contexts, but mostly 'orange-' is safe.
  const regex = /orange-/g;
  
  if (regex.test(content)) {
    content = content.replace(regex, 'emerald-');
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${filePath}`);
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      walkDir(fullPath);
    } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) {
      replaceInFile(fullPath);
    }
  }
}

dirsToScan.forEach(dir => {
  const fullDirPath = path.join(__dirname, dir);
  if (fs.existsSync(fullDirPath)) {
    walkDir(fullDirPath);
  }
});

console.log('Theme change complete.');
