#!/usr/bin/env tsx

import { PinataSDK } from 'pinata-web3';
import * as fs from 'fs';
import * as path from 'path';
import { config } from 'dotenv';

config();

const pinata = new PinataSDK({
  pinataJwt: process.env.PINATA_JWT!,
  pinataGateway: process.env.PINATA_GATEWAY || 'gateway.pinata.cloud',
});

const packages = [
  'deposit-to-vault-ability',
  'open-vault-hedged-position-ability',
  'get-position-status-ability',
  'close-vault-hedged-position-ability',
  'open-hedged-position-ability',
  'close-hedged-position-ability',
  'max-position-size-policy',
];

async function uploadPackageToIPFS(packageName: string) {
  console.log(`\n📦 Uploading ${packageName} to IPFS...`);

  const packagePath = path.join(__dirname, '..', 'packages', packageName);
  const distPath = path.join(packagePath, 'dist');

  if (!fs.existsSync(distPath)) {
    console.error(`❌ No dist folder found for ${packageName}. Run build first!`);
    return null;
  }

  const packageJsonPath = path.join(packagePath, 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

  const vincentAbilityPath = path.join(distPath, 'lib','lib', 'vincent-ability.js');
  const vincentPolicyPath = path.join(distPath, 'lib','lib', 'vincent-policy.js');
  
  let codePath = vincentAbilityPath;
  if (packageName.includes('policy')) {
    codePath = vincentPolicyPath;
  }

  if (!fs.existsSync(codePath)) {
    console.error(`❌ No compiled file found at ${codePath}`);
    return null;
  }

  const bundle = {
    name: packageJson.name,
    version: packageJson.version,
    description: packageJson.description,
    main: packageJson.main,
    code: fs.readFileSync(codePath, 'utf-8'),
  };

  try {
    const upload = await pinata.upload.json(bundle);
    console.log(`✅ Uploaded to IPFS: ${upload.IpfsHash}`);
    console.log(`🔗 Gateway URL: https://${process.env.PINATA_GATEWAY}/ipfs/${upload.IpfsHash}`);

    return {
      package: packageName,
      npm: packageJson.name,
      cid: upload.IpfsHash,
      url: `https://${process.env.PINATA_GATEWAY}/ipfs/${upload.IpfsHash}`,
    };
  } catch (error) {
    console.error(`❌ Failed to upload ${packageName}:`, error);
    return null;
  }
}

async function deployAll() {
  console.log('🚀 Deploying SaucerHedge Vincent Abilities to IPFS');
  console.log('='.repeat(60));

  const results = [];

  for (const pkg of packages) {
    const result = await uploadPackageToIPFS(pkg);
    if (result) {
      results.push(result);
    }
  }

  console.log('\n✅ Deployment Complete!');
  console.log('='.repeat(60));
  console.log('\n📋 Deployment Manifest:\n');
  console.log(JSON.stringify(results, null, 2));

  fs.writeFileSync(
    path.join(__dirname, '..', 'ipfs-deployment-manifest.json'),
    JSON.stringify(results, null, 2)
  );
  console.log('\n💾 Manifest saved to: ipfs-deployment-manifest.json');
}

deployAll().catch(console.error);
