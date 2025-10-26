#!/bin/bash

echo "📦 Compiling Mock Tokens..."

# Install solc if not present
if ! command -v solc &> /dev/null; then
    echo "Installing solc..."
    npm install -g solc
fi

# Compile MockHBAR
echo "Compiling MockHBAR..."
solcjs --abi --bin --optimize --output-dir tests/mock-tokens/abis tests/mock-tokens/contracts/MockHBAR.sol

# Compile MockUSDC
echo "Compiling MockUSDC..."
solcjs --abi --bin --optimize --output-dir tests/mock-tokens/abis tests/mock-tokens/contracts/MockUSDC.sol

echo "✅ Compilation complete!"
