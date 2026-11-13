<?php
declare(strict_types=1);
require __DIR__ . '/includes/bootstrap.php';
?><!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Privacy Policy — Kip Cold Wallet</title>
  <link rel="icon" type="image/svg+xml" href="assets/img/kip-icon.svg" />
  <style>
    :root {
      --bg: #0B0F19;
      --card: #111827;
      --border: #1F2937;
      --gold: #F3BA2F;
      --text: #F3F4F6;
      --muted: #9CA3AF;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: var(--bg);
      color: var(--text);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Inter, sans-serif;
      line-height: 1.65;
      padding: 48px 20px 80px;
    }
    .wrap {
      max-width: 780px;
      margin: 0 auto;
    }
    .brand {
      display: inline-flex;
      align-items: center;
      gap: 12px;
      color: var(--gold);
      text-decoration: none;
      font-weight: 800;
      font-size: 20px;
      margin-bottom: 28px;
    }
    .card {
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 20px;
      padding: 36px 32px;
    }
    h1 { font-size: 30px; margin-bottom: 8px; color: #FFFFFF; }
    .updated { color: var(--muted); font-size: 14px; margin-bottom: 28px; }
    h2 { font-size: 19px; color: var(--gold); margin: 26px 0 10px; }
    p, li { color: var(--text); font-size: 15px; margin-bottom: 10px; }
    ul { padding-left: 22px; margin-bottom: 12px; }
    a { color: var(--gold); }
  </style>
</head>
<body>
  <div class="wrap">
    <a class="brand" href="/">
      <img src="assets/img/kip-icon.svg" alt="Kip" width="36" height="36" />
      <span>Kip Cold Wallet</span>
    </a>
    <div class="card">
      <h1>Privacy Policy</h1>
      <p class="updated">Effective date: November 2026 — Applies to Kip Cold Wallet (iOS, Android &amp; Chrome Extension)</p>

      <h2>1. Non-Custodial &amp; Zero Key Collection</h2>
      <p>Kip Cold Wallet is a self-custody cryptocurrency wallet. Your 12/24-word recovery phrase, private keys, and PIN are generated and encrypted strictly on your own device (using hardware keystore on mobile and WebCrypto PBKDF2 + AES-256-GCM inside <code>chrome.storage.local</code> in the Chrome Extension). Kip never transmits, stores, or has access to your seed phrase, private keys, or PIN.</p>

      <h2>2. Information Processed</h2>
      <ul>
        <li><strong>Public Blockchain Requests:</strong> To display token balances, token metadata, live market prices, and broadcast signed transactions, the app and browser extension send standard JSON-RPC / HTTPS requests containing public wallet addresses or signed transactions to public blockchain nodes (BNB Smart Chain, Ethereum, Base, Arbitrum, OP Mainnet, Avalanche, Polygon, TRON, Solana, Polkadot, NEAR, TON, and Aptos) and public price tickers.</li>
        <li><strong>Gas Station &amp; Remote Configuration:</strong> The wallet fetches public network/fee configuration from <code>kip.money</code> and, when applicable on BNB Smart Chain, may submit your public wallet address to sponsor network gas for token transfers.</li>
        <li><strong>Local Preferences:</strong> Selected network, custom token contract addresses, saved contacts, and display preferences are stored locally on your device.</li>
      </ul>

      <h2>3. Chrome Extension Permissions</h2>
      <ul>
        <li><code>storage</code>: Stores your AES-256-GCM encrypted vault, selected network, and custom token list locally on your computer.</li>
        <li><code>clipboardWrite</code>: Copies your wallet address or recovery phrase to your clipboard only when you explicitly click a Copy button.</li>
        <li><code>sidePanel</code>: Allows opening Kip Cold Wallet in Chrome&rsquo;s side panel when selected from the menu.</li>
        <li><code>host_permissions (https://*/*)</code> &amp; content script: Injects the standard EIP-1193 / EIP-6963 Web3 provider (<code>window.kip</code>) so decentralized applications can detect Kip Wallet, and enables direct communication with public blockchain RPC endpoints.</li>
      </ul>

      <h2>4. No Tracking, Analytics, or Data Sales</h2>
      <p>We do not sell, rent, or monetize user data, browsing history, or personal information. We do not run third-party advertising SDKs inside the mobile wallet or Chrome Extension.</p>

      <h2>5. Contact</h2>
      <p>If you have questions about this Privacy Policy, contact us via <a href="https://kip.money">https://kip.money</a>.</p>
    </div>
  </div>
</body>
</html>
