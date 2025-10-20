import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const EscrowModule = buildModule("EscrowModule", (m) => {
  const escrow = m.contract("Escrow");

  return { escrow };
});

export default EscrowModule;
```

This is much simpler! Ignition handles all the deployment logic for us.

## Step 8: Get Your Private Key from MetaMask

**IMPORTANT: Keep this private! Never share it or commit it to GitHub!**

**In MetaMask:**
1. Click the three dots (⋮) next to your account
2. Click "Account details"
3. Click "Show private key"
4. Enter your password
5. Copy your private key (long string of characters)
cf080a9629ec29c7bb372ba092d400d96150a6f640c750d4078421b9666d59ec

## Step 9: Configure Environment Variables

1. **Create a file in your project root called `.env`** (exactly that name, with the dot)
2. **Add these lines** (replace with your actual private key):
```