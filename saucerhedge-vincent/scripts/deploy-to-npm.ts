import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

const packages = [
  'open-hedged-position-ability',
  'close-hedged-position-ability',
  'open-vault-hedged-position-ability',
  'close-vault-hedged-position-ability',
  'get-position-status-ability',
  'deposit-to-vault-ability',
  'max-position-size-policy'
];

console.log('🚀 Publishing SaucerHedge Vincent Abilities to NPM');
console.log('============================================================\n');

for (const pkg of packages) {
  const packagePath = path.join(process.cwd(), 'packages', pkg);
  const packageJsonPath = path.join(packagePath, 'package.json');
  
  if (!fs.existsSync(packageJsonPath)) {
    console.log(`⚠️  Package ${pkg} not found, skipping...`);
    continue;
  }

  console.log(`📦 Publishing ${pkg}...`);
  
  try {
    // Publish to NPM with public access
    execSync('npm publish --access public', {
      cwd: packagePath,
      stdio: 'inherit'
    });
    
    console.log(`✅ Published ${pkg} to NPM\n`);
  } catch (error) {
    console.error(`❌ Failed to publish ${pkg}:`, error);
  }
}

console.log('✅ NPM Deployment Complete!');
console.log('============================================================');
