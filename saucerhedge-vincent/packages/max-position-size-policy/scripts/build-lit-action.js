#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const esbuild = require('esbuild');

async function buildLitAction() {
  console.log('🔨 Building Lit Action for max-position-size-policy...');
  
  const packageDir = path.join(__dirname, '..');
  const distPath = path.join(packageDir, 'dist');
  const srcPath = path.join(packageDir, 'src/lib/vincent-policy.ts');
  
  // Check if TypeScript compiled dist exists
  if (!fs.existsSync(distPath)) {
    console.error('❌ Error: dist folder not found. Run `pnpm nx build max-position-size-policy` first.');
    process.exit(1);
  }

  console.log('📦 Bundling policy for Lit Action...');

  try {
    // Create output directory
    const litActionDir = path.join(distPath, 'lit-action');
    fs.mkdirSync(litActionDir, { recursive: true });

    // Bundle the policy into a single file
    await esbuild.build({
      entryPoints: [path.join(distPath, 'src/lib/vincent-policy.js')],
      bundle: true,
      platform: 'node',
      target: 'es2020',
      format: 'esm',
      outfile: path.join(litActionDir, 'bundled-policy.js'),
      external: ['ethers'], // Lit Actions provide ethers
      minify: false, // Keep readable for debugging
    });

    console.log('✅ Lit Action bundled successfully');

    // Create metadata file
    const metadata = {
      packageName: '@saucerhedge/max-position-size-policy',
      version: '1.0.0',
      type: 'policy',
      builtAt: new Date().toISOString(),
    };

    fs.writeFileSync(
      path.join(litActionDir, 'metadata.json'),
      JSON.stringify(metadata, null, 2)
    );

    console.log('📝 Metadata created');

    // Create bundled policy reference
    const generatedDir = path.join(distPath, 'src/generated');
    fs.mkdirSync(generatedDir, { recursive: true });

    const bundleContent = `
export const bundledVincentPolicy = {
  packageName: '@saucerhedge/max-position-size-policy',
  version: '1.0.0',
  ipfsCid: '', // Will be set during deployment
};
`;

    fs.writeFileSync(
      path.join(generatedDir, 'vincent-bundled-policy.js'),
      bundleContent
    );

    console.log('✅ Build completed successfully!');
    console.log('📂 Output:', path.join(litActionDir, 'bundled-policy.js'));

  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
}

buildLitAction().catch(console.error);
