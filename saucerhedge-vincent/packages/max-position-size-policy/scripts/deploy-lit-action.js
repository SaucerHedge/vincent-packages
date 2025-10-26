#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { PinataSDK } = require('pinata-web3');

async function deployLitAction() {
  console.log('🚀 Deploying Lit Action to IPFS...');
  
  const packageDir = path.join(__dirname, '..');
  const litActionPath = path.join(packageDir, 'dist/lit-action/bundled-policy.js');
  
  // Check if build exists
  if (!fs.existsSync(litActionPath)) {
    console.error('❌ Error: bundled-policy.js not found.');
    console.error('💡 Run `pnpm nx action:build max-position-size-policy` first.');
    process.exit(1);
  }

  // Check for Pinata JWT
  const pinataJWT = process.env.PINATA_JWT;
  
  if (!pinataJWT) {
    console.warn('⚠️  PINATA_JWT not set - skipping IPFS deployment');
    console.log('📝 For local testing, this is fine.');
    console.log('💡 For production, set PINATA_JWT environment variable.');
    
    // Create mock CID for local testing
    const mockCid = 'QmMOCK_POLICY_' + Date.now();
    console.log('✅ Mock CID generated:', mockCid);
    
    // Save CID to file
    fs.writeFileSync(
      path.join(packageDir, '.policy-cid'),
      mockCid
    );
    
    console.log('📂 CID saved to .policy-cid file');
    return mockCid;
  }

  try {
    console.log('📤 Uploading to Pinata...');

    const pinata = new PinataSDK({
      pinataJwt: pinataJWT,
    });

    // Read the bundled policy
    const policyCode = fs.readFileSync(litActionPath, 'utf8');
    
    // Upload to IPFS
    const file = new File([policyCode], 'bundled-policy.js', {
      type: 'application/javascript',
    });

    const upload = await pinata.upload.file(file);
    const ipfsCid = upload.IpfsHash;

    console.log('✅ Deployed to IPFS!');
    console.log('📍 IPFS CID:', ipfsCid);
    console.log('🔗 Gateway URL:', `https://gateway.pinata.cloud/ipfs/${ipfsCid}`);

    // Save CID to file
    fs.writeFileSync(
      path.join(packageDir, '.policy-cid'),
      ipfsCid
    );

    // Update bundled policy reference with real CID
    const generatedDir = path.join(packageDir, 'dist/src/generated');
    const bundleContent = `
export const bundledVincentPolicy = {
  packageName: '@saucerhedge/max-position-size-policy',
  version: '1.0.0',
  ipfsCid: '${ipfsCid}',
};
`;

    fs.writeFileSync(
      path.join(generatedDir, 'vincent-bundled-policy.js'),
      bundleContent
    );

    console.log('✅ CID saved to .policy-cid file');
    console.log('✅ Bundled policy reference updated');

    return ipfsCid;

  } catch (error) {
    console.error('❌ Deployment failed:', error);
    process.exit(1);
  }
}

deployLitAction().catch(console.error);
