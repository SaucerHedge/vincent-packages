const fs = require('fs');
const path = require('path');
const { create } = require('ipfs-http-client');

async function deploy() {
  console.log('Deploying to IPFS...');

  const actionPath = path.join(__dirname, '../dist/src/lib/vincent-ability.js');
  
  if (!fs.existsSync(actionPath)) {
    console.error('Error: Build the action first with `pnpm nx action:build`');
    process.exit(1);
  }

  // Note: Requires PINATA_JWT env variable
  // For testing, you can skip IPFS deployment
  console.log('⚠️  IPFS deployment skipped for local testing');
  console.log('📝 For production, set PINATA_JWT and deploy to IPFS');
  
  const mockCid = 'QmMOCK' + Date.now();
  console.log('✅ Mock CID generated:', mockCid);

  // Save CID to file
  fs.writeFileSync(
    path.join(__dirname, '../.ability-cid'),
    mockCid
  );

  return mockCid;
}

deploy().catch(console.error);
