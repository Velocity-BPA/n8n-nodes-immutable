# n8n-nodes-immutable

> [Velocity BPA Licensing Notice]
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

---

A comprehensive n8n community node for **Immutable platform** providing complete integration for zkEVM and Immutable X (StarkEx) blockchains. Supports gaming NFTs, marketplace operations, zero-gas minting, L1/L2 bridging, Passport authentication, and Web3 gaming infrastructure.

![Immutable](https://img.shields.io/badge/Immutable-zkEVM%20%26%20IMX-blue)
![n8n](https://img.shields.io/badge/n8n-community%20node-orange)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)
![Version](https://img.shields.io/badge/version-1.0.0-brightgreen)

## Features

### Resources (18 total)
- **Wallet** - Balance queries, token balances, transaction history, address validation
- **NFT** - Get NFT info, list by collection, list by owner
- **Collection** - Get collection info, list collections, collection stats & floor price
- **Minting** - Mint NFT, batch mint, get mint status (zero-gas minting)
- **Order** - Get orders, list orders, listings, and bids
- **Trade** - Get trade info, list trades
- **Deposit** - Get deposit info, list deposits (L1→L2 bridge)
- **Withdrawal** - Get withdrawal info, list withdrawals (L2→L1 bridge)
- **Exchange** - List exchanges
- **Passport** - Get user info (Immutable Passport integration)
- **zkEVM** - Gas price, blocks, transactions, contract calls
- **Staking** - Staking info
- **Primary Sales** - Get/list primary sales (NFT drops)
- **Metadata** - Get metadata schema, refresh metadata
- **Project** - Get/list projects
- **Crafting** - Get/list crafting recipes (gaming)
- **Activity** - Activity feeds by user/collection
- **Utility** - Wei/ETH conversion, address validation, network status

### Trigger Node Events
Real-time webhook monitoring for:
- NFT events (created, transferred, burned, listed, sold, metadata updated)
- Order events (created, cancelled, filled, bid received)
- Trade events (executed)
- Collection events (created, updated)
- Bridge events (deposit completed, withdrawal completed)
- Gaming events (item crafted, primary sale purchase)
- All events option for comprehensive monitoring

## Installation

### Community Nodes (Recommended)

1. Open n8n
2. Go to **Settings** > **Community Nodes**
3. Click **Install a community node**
4. Enter `n8n-nodes-immutable`
5. Click **Install**

### Manual Installation

```bash
# Navigate to n8n custom nodes directory
cd ~/.n8n/nodes

# Clone the repository
git clone https://github.com/Velocity-BPA/n8n-nodes-immutable.git
cd n8n-nodes-immutable

# Install dependencies and build
npm install
npm run build

# Restart n8n
n8n start
```

### Development Installation

```bash
# 1. Extract the zip file
unzip n8n-nodes-immutable.zip
cd n8n-nodes-immutable

# 2. Install dependencies
npm install

# 3. Build the project
npm run build

# 4. Create symlink to n8n custom nodes directory
# For Linux/macOS:
mkdir -p ~/.n8n/custom
ln -s $(pwd) ~/.n8n/custom/n8n-nodes-immutable

# For Windows (run as Administrator):
# mklink /D %USERPROFILE%\.n8n\custom\n8n-nodes-immutable %CD%

# 5. Restart n8n
n8n start
```

## Credentials Setup

### Immutable Network Credentials

| Field | Description | Required |
|-------|-------------|----------|
| Network | zkEVM Mainnet, zkEVM Testnet, IMX Mainnet, or IMX Testnet | Yes |
| API Key | Your Immutable API key from the Hub | Yes |
| Private Key | For transaction signing (wallet operations) | No |
| Mnemonic | Alternative to private key | No |
| Stark Private Key | For Immutable X operations | No |

### Getting API Keys

1. Visit [Immutable Hub](https://hub.immutable.com/)
2. Create or select a project
3. Navigate to API Keys section
4. Copy your API key

## Resources & Operations

### Wallet
| Operation | Description |
|-----------|-------------|
| Get Balance | Get native token balance for an address |
| Get Token Balances | Get all token balances for an address |
| Get Transaction History | Get transaction history for an address |
| Validate Address | Check if an address is valid |

### NFT
| Operation | Description |
|-----------|-------------|
| Get NFT | Get NFT details by collection and token ID |
| Get NFTs by Collection | List all NFTs in a collection |
| Get NFTs by Owner | List all NFTs owned by an address |

### Collection
| Operation | Description |
|-----------|-------------|
| Get Collection | Get collection details |
| List Collections | List all collections |
| Get Collection Stats | Get collection statistics including floor price |

### Minting
| Operation | Description |
|-----------|-------------|
| Mint NFT | Mint a single NFT (zero-gas) |
| Batch Mint | Mint multiple NFTs at once |
| Get Mint Status | Check the status of a mint request |

### zkEVM
| Operation | Description |
|-----------|-------------|
| Get Gas Price | Get current gas price |
| Get Block Number | Get latest block number |
| Get Block | Get block details |
| Get Transaction | Get transaction details |
| Get Transaction Receipt | Get transaction receipt |
| Call Contract | Make a read-only contract call |

## Trigger Node

The Immutable Trigger node allows you to receive real-time events from the Immutable platform.

### Configuration

1. Add an **Immutable Trigger** node to your workflow
2. Select the event type to listen for
3. Optionally add filters for collection, user, or token ID
4. Configure your webhook URL in Immutable Hub

### Supported Events

- **NFT Events**: Created, Transferred, Burned, Listed, Sold, Metadata Updated
- **Order Events**: Created, Cancelled, Filled, Bid Received
- **Trade Events**: Executed
- **Collection Events**: Created, Updated
- **Bridge Events**: Deposit Completed, Withdrawal Completed
- **Gaming Events**: Item Crafted, Primary Sale Purchase

## Usage Examples

### Get NFT Information
```
Resource: NFT
Operation: Get NFT
Collection Address: 0x...
Token ID: 1234
```

### List Collection NFTs
```
Resource: NFT
Operation: Get NFTs by Collection
Collection Address: 0x...
Limit: 50
```

### Get Wallet Balance
```
Resource: Wallet
Operation: Get Balance
Address: 0x...
```

### Mint an NFT
```
Resource: Minting
Operation: Mint NFT
Collection Address: 0x...
Owner Address: 0x...
NFT Metadata: {"name": "My NFT", "description": "...", "image": "ipfs://..."}
```

### Get Gas Price
```
Resource: zkEVM
Operation: Get Gas Price
```

### Convert Wei to ETH
```
Resource: Utility
Operation: Convert Wei to ETH
Value: 1000000000000000000
```

## Immutable Concepts

### zkEVM vs Immutable X

- **zkEVM**: EVM-compatible Layer 2 using zero-knowledge proofs. Supports smart contracts.
- **Immutable X**: StarkEx-based Layer 2 optimized for NFTs. Uses STARK proofs.

### Zero-Gas Minting

Immutable's minting API allows gas-free NFT minting. The gas costs are covered by Immutable, making it ideal for gaming applications.

### Passport

Immutable Passport provides Web3 authentication with email/social login, abstracting away wallet complexity for end users.

## Networks

| Network | Description | Chain ID |
|---------|-------------|----------|
| zkEVM Mainnet | Production zkEVM network | 13371 |
| zkEVM Testnet | Development zkEVM network | 13473 |
| IMX Mainnet | Production Immutable X | 1 |
| IMX Testnet | Development Immutable X | 5 |

## Error Handling

The node includes comprehensive error handling:
- Network connectivity errors
- Invalid credentials
- API rate limiting
- Invalid parameters
- RPC errors for zkEVM operations

Use the "Continue on Fail" option in n8n to handle errors gracefully in your workflows.

## Security Best Practices

1. **Store credentials securely** - Use n8n's credential storage
2. **Use testnet first** - Test workflows on testnet before mainnet
3. **Protect private keys** - Never expose private keys in workflows
4. **Monitor API usage** - Keep track of API rate limits
5. **Validate inputs** - Use the address validation operation

## Development

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run linting
npm run lint

# Fix linting issues
npm run lint:fix

# Watch mode for development
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
Use of this node within any SaaS, PaaS, hosted platform, managed service,
or paid automation offering requires a commercial license.

For licensing inquiries:
**licensing@velobpa.com**

See [LICENSE](LICENSE), [COMMERCIAL_LICENSE.md](COMMERCIAL_LICENSE.md), and [LICENSING_FAQ.md](LICENSING_FAQ.md) for details.

## Contributing

Contributions are welcome! Please ensure:

1. Code follows the existing style
2. Tests pass (`npm test`)
3. Linting passes (`npm run lint`)
4. Update documentation as needed

## Support

- [GitHub Issues](https://github.com/Velocity-BPA/n8n-nodes-immutable/issues)
- [Immutable Documentation](https://docs.immutable.com/)
- [n8n Community](https://community.n8n.io/)

## Acknowledgments

- [Immutable](https://immutable.com/) for the blockchain platform
- [n8n](https://n8n.io/) for the workflow automation platform
- The open-source community
