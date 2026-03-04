# n8n-nodes-immutable

> **[Velocity BPA Licensing Notice]**
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

This n8n community node provides seamless integration with Immutable's NFT marketplace and gaming platform, offering access to 7 core resources including Collections, Assets, Orders, Trades, Users, Projects, and Withdrawals with comprehensive CRUD operations and real-time marketplace data.

![n8n Community Node](https://img.shields.io/badge/n8n-Community%20Node-blue)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![NFT](https://img.shields.io/badge/NFT-Marketplace-purple)
![Gaming](https://img.shields.io/badge/Gaming-Platform-green)
![Ethereum](https://img.shields.io/badge/Ethereum-L2-orange)

## Features

- **Complete NFT Management** - Create, mint, transfer, and manage NFT collections and individual assets
- **Marketplace Integration** - Access real-time order data, execute trades, and monitor marketplace activity
- **User Account Operations** - Manage user profiles, balances, and authentication workflows
- **Project Administration** - Handle project creation, configuration, and deployment processes
- **Financial Operations** - Process withdrawals, track balances, and manage payment flows
- **Advanced Filtering** - Query assets and collections with comprehensive filtering and sorting options
- **Batch Operations** - Perform bulk operations on multiple assets and collections efficiently
- **Real-time Data** - Access live marketplace data and transaction status updates

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
| API Key | Your Immutable API key from the developer dashboard | Yes |
| Environment | Select between Sandbox and Production environments | Yes |
| Rate Limit | Optional rate limiting configuration (requests per second) | No |

## Resources & Operations

### 1. Collections

| Operation | Description |
|-----------|-------------|
| Create | Create a new NFT collection with metadata and configuration |
| Get | Retrieve collection details by collection address |
| List | Get all collections with optional filtering and pagination |
| Update | Update collection metadata and settings |
| Get Stats | Retrieve collection statistics including floor price and volume |

### 2. Assets

| Operation | Description |
|-----------|-------------|
| Create | Mint new NFT assets within a collection |
| Get | Retrieve asset details by token ID and collection |
| List | Query assets with advanced filtering by collection, owner, traits |
| Transfer | Transfer asset ownership between users |
| Update | Update asset metadata and properties |
| Get History | Retrieve asset transaction and ownership history |

### 3. Orders

| Operation | Description |
|-----------|-------------|
| Create | Create buy or sell orders for NFT assets |
| Get | Retrieve order details by order ID |
| List | Query orders with filtering by status, user, asset |
| Cancel | Cancel existing orders |
| Fill | Execute order fulfillment |
| Get History | Retrieve order execution history |

### 4. Trades

| Operation | Description |
|-----------|-------------|
| Get | Retrieve trade details by trade ID |
| List | Query completed trades with filtering options |
| Get by Asset | Get all trades for a specific asset |
| Get by User | Retrieve user's trading history |
| Get Stats | Get trading statistics and volume data |

### 5. Users

| Operation | Description |
|-----------|-------------|
| Get | Retrieve user profile and account information |
| List | Query users with filtering capabilities |
| Update | Update user profile and preferences |
| Get Assets | Retrieve all assets owned by a user |
| Get Orders | Get user's active and historical orders |
| Get Balance | Check user's token and ETH balances |

### 6. Projects

| Operation | Description |
|-----------|-------------|
| Create | Initialize new Immutable project |
| Get | Retrieve project configuration and details |
| List | Get all projects associated with the account |
| Update | Modify project settings and configuration |
| Deploy | Deploy project to Immutable network |
| Get Stats | Retrieve project usage and performance metrics |

### 7. Withdrawals

| Operation | Description |
|-----------|-------------|
| Create | Initiate withdrawal of tokens or ETH |
| Get | Retrieve withdrawal status and details |
| List | Query withdrawal history with filtering |
| Get Fees | Calculate withdrawal fees for different tokens |
| Estimate Time | Get estimated completion time for withdrawals |

## Usage Examples

```javascript
// Create a new NFT collection
{
  "name": "Gaming Heroes Collection",
  "description": "Unique hero characters for blockchain gaming",
  "contract_address": "0x1234567890abcdef",
  "metadata_api_url": "https://api.example.com/metadata",
  "collection_image_url": "https://images.example.com/collection.png"
}
```

```javascript
// List assets with filtering
{
  "collection": "0x1234567890abcdef",
  "status": "imx",
  "user": "0xuser123456789",
  "order_by": "updated_at",
  "direction": "desc",
  "page_size": 50
}
```

```javascript
// Create a sell order
{
  "type": "sell",
  "asset_id": "12345",
  "amount_sell": "1000000000000000000",
  "token_sell": "ETH",
  "expiration_timestamp": 1703980800
}
```

```javascript
// Get user's asset portfolio
{
  "user_address": "0xuser123456789",
  "collection": "0x1234567890abcdef",
  "status": "imx",
  "order_by": "name",
  "include_fees": true
}
```

## Error Handling

| Error | Description | Solution |
|-------|-------------|----------|
| 401 Unauthorized | Invalid or expired API key | Verify API key in credentials and regenerate if necessary |
| 404 Not Found | Resource (asset, collection, order) doesn't exist | Check resource IDs and ensure they exist on the network |
| 429 Rate Limited | Too many requests sent too quickly | Implement delays between requests or reduce request frequency |
| 400 Bad Request | Invalid parameters or malformed request | Validate input parameters and check API documentation |
| 500 Internal Server Error | Immutable service temporarily unavailable | Retry request after a delay or check Immutable status page |
| Network Timeout | Request timed out waiting for response | Increase timeout settings or check network connectivity |

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
- **Immutable Documentation**: [Immutable Developer Hub](https://docs.immutable.com)
- **Immutable Community**: [Discord Server](https://discord.gg/immutable)