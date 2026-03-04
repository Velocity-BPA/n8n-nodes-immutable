# n8n-nodes-immutable

> **[Velocity BPA Licensing Notice]**
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

This n8n community node provides comprehensive integration with Immutable's NFT and gaming infrastructure platform. With 6 core resources (Assets, Collections, Minting, Orders, Trades, Users, Projects), it enables seamless automation of NFT marketplace operations, collection management, and blockchain gaming workflows on Immutable X.

![n8n Community Node](https://img.shields.io/badge/n8n-Community%20Node-blue)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![NFT](https://img.shields.io/badge/NFT-Marketplace-purple)
![Blockchain](https://img.shields.io/badge/Blockchain-Gaming-green)
![Layer 2](https://img.shields.io/badge/Layer%202-Immutable%20X-orange)

## Features

- **Asset Management** - Create, retrieve, update, and transfer digital assets across collections
- **Collection Operations** - Manage NFT collections with metadata, royalties, and trading configurations  
- **Automated Minting** - Streamline batch and individual NFT minting processes with metadata handling
- **Order Processing** - Create, cancel, and fulfill buy/sell orders on Immutable X marketplace
- **Trade Monitoring** - Track and analyze trading activity, volume, and market performance
- **User Management** - Handle user profiles, wallets, and authentication workflows
- **Project Administration** - Configure and manage gaming projects and their associated assets
- **Real-time Data** - Access live marketplace data and blockchain state information

## Installation

### Community Nodes (Recommended)

1. Open n8n
2. Go to **Settings** → **Community Nodes**
3. Click **Install a community node**
4. Enter `n8n-nodes-immutable`
5. Click **Install**

### Manual Installation

```bash
cd ~/.n8n
npm install n8n-nodes-immutable
```

### Development Installation

```bash
git clone https://github.com/Velocity-BPA/n8n-nodes-immutable.git
cd n8n-nodes-immutable
npm install
npm run build
mkdir -p ~/.n8n/custom
ln -s $(pwd) ~/.n8n/custom/n8n-nodes-immutable
n8n start
```

## Credentials Setup

| Field | Description | Required |
|-------|-------------|----------|
| API Key | Your Immutable X API key from the developer dashboard | Yes |
| Environment | Choose between 'sandbox' or 'mainnet' | Yes |
| Private Key | Your Ethereum private key for signing transactions | Yes |
| Public Key | Your Ethereum public key (auto-derived if not provided) | No |

## Resources & Operations

### 1. Assets

| Operation | Description |
|-----------|-------------|
| Get Asset | Retrieve details of a specific asset by token ID and contract address |
| List Assets | Get a paginated list of assets with filtering options |
| Create Asset | Mint a new asset to a specified wallet address |
| Transfer Asset | Transfer an asset from one wallet to another |
| Update Metadata | Update the metadata URI for an existing asset |

### 2. Collections

| Operation | Description |
|-----------|-------------|
| Get Collection | Retrieve collection details including stats and configuration |
| List Collections | Get all collections with pagination and filtering |
| Create Collection | Deploy a new NFT collection contract |
| Update Collection | Modify collection metadata and settings |
| Get Collection Stats | Retrieve trading statistics and analytics for a collection |

### 3. Minting

| Operation | Description |
|-----------|-------------|
| Mint Asset | Mint a single NFT to a specified address |
| Batch Mint | Mint multiple NFTs in a single transaction |
| Get Mint Status | Check the status of a pending mint operation |
| List Mint Requests | Retrieve all mint requests for a project |
| Cancel Mint | Cancel a pending mint request |

### 4. Orders

| Operation | Description |
|-----------|-------------|
| Create Order | Place a buy or sell order on the marketplace |
| Get Order | Retrieve details of a specific order |
| List Orders | Get orders with filtering by user, asset, or status |
| Cancel Order | Cancel an active order |
| Fill Order | Execute a trade by filling an existing order |

### 5. Trades

| Operation | Description |
|-----------|-------------|
| Get Trade | Retrieve details of a completed trade |
| List Trades | Get trading history with filtering and pagination |
| Get Trade Stats | Retrieve trading statistics for assets or collections |
| Export Trades | Export trade data in various formats |

### 6. Users

| Operation | Description |
|-----------|-------------|
| Get User | Retrieve user profile and wallet information |
| List Users | Get users with filtering options |
| Register User | Register a new user on Immutable X |
| Update Profile | Update user profile information |
| Get User Assets | Retrieve all assets owned by a user |

### 7. Projects

| Operation | Description |
|-----------|-------------|
| Get Project | Retrieve project configuration and details |
| List Projects | Get all projects associated with your API key |
| Create Project | Create a new gaming project |
| Update Project | Modify project settings and configuration |
| Get Project Stats | Retrieve analytics and performance metrics |

## Usage Examples

### Mint NFT to User Wallet
```javascript
{
  "collection_address": "0x1234567890123456789012345678901234567890",
  "user": "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd",
  "token_id": "12345",
  "metadata": {
    "name": "Epic Sword",
    "description": "A legendary weapon forged in dragon fire",
    "image": "https://cdn.example.com/sword.png",
    "attributes": [
      {"trait_type": "Rarity", "value": "Legendary"},
      {"trait_type": "Damage", "value": 150}
    ]
  }
}
```

### Create Marketplace Order
```javascript
{
  "type": "sell",
  "asset_id": "0x1234567890123456789012345678901234567890:12345",
  "price": "0.5",
  "currency": "ETH",
  "expiry": "2024-12-31T23:59:59Z",
  "fees": [{
    "recipient": "0xfeerecipient123456789012345678901234567890",
    "percentage": 2.5
  }]
}
```

### Get Collection Trading Stats
```javascript
{
  "collection_address": "0x1234567890123456789012345678901234567890",
  "period": "24h",
  "metrics": ["volume", "sales_count", "floor_price", "unique_buyers"]
}
```

### Batch Transfer Assets
```javascript
{
  "transfers": [
    {
      "token_id": "12345",
      "from": "0xsender123456789012345678901234567890",
      "to": "0xrecipient123456789012345678901234567890"
    },
    {
      "token_id": "12346", 
      "from": "0xsender123456789012345678901234567890",
      "to": "0xrecipient123456789012345678901234567890"
    }
  ],
  "collection_address": "0x1234567890123456789012345678901234567890"
}
```

## Error Handling

| Error | Description | Solution |
|-------|-------------|----------|
| Invalid API Key | Authentication failed with provided credentials | Verify API key is correct and has proper permissions |
| Insufficient Balance | User lacks ETH for gas fees or trading | Ensure wallet has sufficient balance for transaction |
| Asset Not Found | Requested asset does not exist | Verify token ID and collection address are correct |
| Order Expired | Attempting to fill an expired marketplace order | Create a new order or check order expiration times |
| Rate Limited | Too many API requests in short timeframe | Implement exponential backoff and respect rate limits |
| Invalid Signature | Transaction signature verification failed | Check private key configuration and network settings |

## Development

```bash
npm install
npm run build
npm test
npm run lint
npm run dev
```

## Author

**Velocity BPA**
- Website: [velobpa.com](https://velobpa.com)
- GitHub: [Velocity-BPA](https://github.com/Velocity-BPA)

## Licensing

This n8n community node is licensed under the **Business Source License 1.1**.

### Free Use
Permitted for personal, educational, research, and internal business use.

### Commercial Use
Use of this node within any SaaS, PaaS, hosted platform, managed service, or paid automation offering requires a commercial license.

For licensing inquiries: **licensing@velobpa.com**

See [LICENSE](LICENSE), [COMMERCIAL_LICENSE.md](COMMERCIAL_LICENSE.md), and [LICENSING_FAQ.md](LICENSING_FAQ.md) for details.

## Contributing

Contributions are welcome! Please ensure:

1. Code follows existing style conventions
2. All tests pass (`npm test`)
3. Linting passes (`npm run lint`)
4. Documentation is updated for new features
5. Commit messages are descriptive

## Support

- **Issues**: [GitHub Issues](https://github.com/Velocity-BPA/n8n-nodes-immutable/issues)
- **Immutable X Documentation**: [docs.immutable.com](https://docs.immutable.com)
- **Developer Discord**: [discord.gg/immutable](https://discord.gg/immutable)