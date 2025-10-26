const fs = require('fs');
const path = require('path');

console.log('Building Lit Action for open-hedged-position-ability...');

const distPath = path.join(__dirname, '../dist');
if (!fs.existsSync(distPath)) {
  console.error('Error: dist folder not found. Run `pnpm build` first.');
  process.exit(1);
}

// Create bundled ability marker
const bundlePath = path.join(distPath, 'src/generated');
fs.mkdirSync(bundlePath, { recursive: true });

const bundleContent = `
export const bundledVincentAbility = {
  packageName: '@saucerhedge/open-hedged-position-ability',
  version: '1.0.0',
  ipfsCid: '', // Will be set during deployment
};
`;

fs.writeFileSync(path.join(bundlePath, 'vincent-bundled-ability.js'), bundleContent);

console.log('✅ Lit Action built successfully');
