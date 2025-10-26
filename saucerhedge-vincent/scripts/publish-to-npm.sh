#!/bin/bash

packages=(
  "deposit-to-vault-ability"
  "open-vault-hedged-position-ability"
  "get-position-status-ability"
  "close-vault-hedged-position-ability"
  "open-hedged-position-ability"
  "close-hedged-position-ability"
  "max-position-size-policy"
)

echo "🚀 Publishing SaucerHedge Vincent Packages to NPM"
echo "============================================================"

for pkg in "${packages[@]}"; do
  echo ""
  echo "📦 Publishing $pkg..."
  cd "packages/$pkg"
  
  npm publish --access public
  
  if [ $? -eq 0 ]; then
    echo "✅ Successfully published $pkg"
  else
    echo "❌ Failed to publish $pkg"
  fi
  
  cd ../..
done

echo ""
echo "✅ NPM Publishing Complete!"
