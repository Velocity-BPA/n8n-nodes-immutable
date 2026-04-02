# n8n-nodes-immutable

> **[Velocity BPA Licensing Notice]**
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

A comprehensive n8n community node for integrating with Immutable's Web3 gaming platform. This node provides access to 7 core resources including NFT collections, digital assets, trading orders, marketplace transactions, user management, and withdrawal operations, enabling seamless automation of gaming economy workflows.

![n8n Community Node](https://img.shields.io/badge/n8n-Community%20Node-blue)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![Web3](https://img.shields.io/badge/Web3-Gaming-purple)
![NFT](https://img.shields.io/badge/NFT-Compatible-green)
![Immutable](https://img.shields.io/badge/Immutable-Platform-orange)

## Features

- **Collections Management** - Create, update, and manage NFT collections with metadata and royalty configurations
- **Asset Operations** - Mint, transfer, and track digital assets across gaming ecosystems
- **Order Processing** - Handle buy/sell orders, auction listings, and marketplace transactions
- **Trade Execution** - Monitor and execute peer-to-peer trades with automatic settlement
- **Transfer Tracking** - Process asset transfers between wallets with transaction verification
- **User Management** - Register users, manage profiles, and handle authentication flows
- **Withdrawal Processing** - Execute cryptocurrency and asset withdrawals to external wallets
- **Real-time Monitoring** - Track transaction status and receive updates on blockchain confirmations

## Installation

### Community Nodes (Recommended)

1. Open n8n
2. Go to **Settings** → **Community Nodes**
3. Click **Install a community node**
4. Enter `n8n-nodes-immutable`
5. Click **Install**

### Manual Installation

bash
cd ~/.n8n
npm install n8n-nodes-immutable


### Development Installation

bash
git clone https://github.com/Velocity-BPA/n8n-nodes-immutable.git
cd n8n-nodes-immutable
npm install
npm run build
mkdir -p ~/.n8n/custom
ln -s $(pwd) ~/.n8n/custom/n8n-nodes-immutable
n8n start


## Credentials Setup

| Field | Description | Required |
|-------|-------------|----------|
| API Key | Your Immutable platform API key | Yes |
| Environment | Sandbox or Production environment | Yes |
| Base URL | API endpoint URL (auto-configured by environment) | No |

## Resources & Operations

### 1. Collections

| Operation | Description |
|-----------|-------------|
| Create | Create a new NFT collection with metadata and configuration |
| Get | Retrieve collection details and statistics |
| List | List all collections with filtering options |
| Update | Modify collection metadata and settings |
| Get Metadata | Fetch collection metadata and attributes |

### 2. Assets

| Operation | Description |
|-----------|-------------|
| Create | Mint new digital assets within a collection |
| Get | Retrieve asset details and ownership information |
| List | List assets with filtering by collection, owner, or attributes |
| Transfer | Transfer asset ownership between wallets |
| Update | Update asset metadata and properties |
| Get History | Retrieve asset transaction history |

### 3. Orders

| Operation | Description |
|-----------|-------------|
| Create | Create buy or sell orders for marketplace listings |
| Get | Retrieve order details and status |
| List | List orders with filtering by status, user, or asset |
| Cancel | Cancel existing orders before execution |
| Update | Modify order parameters like price or expiration |

### 4. Trades

| Operation | Description |
|-----------|-------------|
| Execute | Execute trade between two parties |
| Get | Retrieve trade details and transaction information |
| List | List completed trades with filtering options |
| Get History | Fetch trading history for users or assets |

### 5. Transfers

| Operation | Description |
|-----------|-------------|
| Create | Initiate asset transfers between wallets |
| Get | Retrieve transfer status and details |
| List | List transfers with filtering by status or user |
| Get Details | Fetch detailed transfer information including gas fees |

### 6. Users

| Operation | Description |
|-----------|-------------|
| Register | Register new users on the platform |
| Get | Retrieve user profile and account information |
| List | List users with filtering options |
| Update | Update user profile and preferences |
| Get Assets | Fetch assets owned by a specific user |

### 7. Withdrawals

| Operation | Description |
|-----------|-------------|
| Create | Initiate cryptocurrency or asset withdrawals |
| Get | Retrieve withdrawal status and transaction details |
| List | List withdrawal history with filtering |
| Cancel | Cancel pending withdrawals |
| Get Fees | Calculate withdrawal fees and requirements |

## Usage Examples

javascript
// Create a new NFT collection
{
  "name": "Epic Game Items",
  "description": "Rare weapons and armor for Epic Quest",
  "contract_address": "0x1234567890abcdef",
  "owner_public_key": "0xabcdef1234567890",
  "metadata_api_url": "https://api.epicquest.com/metadata/",
  "collection_image_url": "https://cdn.epicquest.com/collection.png"
}


javascript
// Mint a new asset
{
  "collection_id": "clm123abc456",
  "token_id": "1001",
  "user": "0x9876543210fedcba",
  "metadata": {
    "name": "Legendary Sword of Fire",
    "description": "A powerful weapon forged in dragon flames",
    "image": "https://cdn.epicquest.com/sword_fire.png",
    "attributes": [
      {"trait_type": "Rarity", "value": "Legendary"},
      {"trait_type": "Attack", "value": 150},
      {"trait_type": "Element", "value": "Fire"}
    ]
  }
}


javascript
// Create a marketplace order
{
  "type": "sell",
  "asset_id": "ast_abc123def456",
  "amount_wei": "1000000000000000000",
  "currency": "ETH",
  "expiration_timestamp": "2024-12-31T23:59:59Z",
  "fees": [{
    "type": "royalty",
    "recipient": "0x1111222233334444",
    "percentage": 5.0
  }]
}


javascript
// Process an asset transfer
{
  "from": "0xaaa111bbb222ccc333",
  "to": "0xddd444eee555fff666",
  "asset_id": "ast_transfer123",
  "quantity": 1,
  "memo": "Guild reward distribution"
}


## Error Handling

| Error | Description | Solution |
|-------|-------------|----------|
| Invalid API Key | Authentication failed with provided credentials | Verify API key is correct and has proper permissions |
| Asset Not Found | Specified asset ID does not exist | Check asset ID and ensure it exists in the collection |
| Insufficient Balance | User lacks sufficient funds for transaction | Verify user wallet balance before executing operations |
| Invalid Collection | Collection ID is invalid or inaccessible | Confirm collection exists and user has access permissions |
| Rate Limit Exceeded | Too many API requests in short timeframe | Implement delays between requests or use batch operations |
| Network Error | Blockchain network connectivity issues | Retry operation or check Immutable network status |

## Development

bash
npm install
npm run build
npm test
npm run lint
npm run dev


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
- **Immutable Documentation**: [docs.immutable.com](https://docs.immutable.com)
- **Developer Community**: [Immutable Discord](https://discord.gg/immutable)