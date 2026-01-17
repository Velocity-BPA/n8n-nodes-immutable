/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
	IExecuteFunctions,
	INodeType,
	INodeTypeDescription,
	IDataObject,
	INodePropertyOptions,
	INodeExecutionData,
	IHttpRequestMethods,
} from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

// Network configurations
const NETWORKS: Record<string, { rpcUrl: string; apiUrl: string; chainId: number; chainName: string }> = {
	zkevmMainnet: {
		rpcUrl: 'https://rpc.immutable.com',
		apiUrl: 'https://api.immutable.com',
		chainId: 13371,
		chainName: 'imtbl-zkevm-mainnet',
	},
	zkevmTestnet: {
		rpcUrl: 'https://rpc.testnet.immutable.com',
		apiUrl: 'https://api.sandbox.immutable.com',
		chainId: 13473,
		chainName: 'imtbl-zkevm-testnet',
	},
	imxMainnet: {
		rpcUrl: '',
		apiUrl: 'https://api.x.immutable.com',
		chainId: 1,
		chainName: 'imx-mainnet',
	},
	imxTestnet: {
		rpcUrl: '',
		apiUrl: 'https://api.sandbox.x.immutable.com',
		chainId: 5,
		chainName: 'imx-testnet',
	},
};

export class Immutable implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Immutable',
		name: 'immutable',
		icon: 'file:immutable.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with Immutable blockchain platform - zkEVM, NFTs, marketplace, gaming',
		defaults: {
			name: 'Immutable',
		},
		inputs: ['main'] as const,
		outputs: ['main'] as const,
		credentials: [
			{
				name: 'immutableNetwork',
				required: true,
			},
			{
				name: 'immutableApi',
				required: false,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: 'Activity', value: 'activity' },
					{ name: 'Collection', value: 'collection' },
					{ name: 'Crafting', value: 'crafting' },
					{ name: 'Deposit', value: 'deposit' },
					{ name: 'Exchange', value: 'exchange' },
					{ name: 'Metadata', value: 'metadata' },
					{ name: 'Minting', value: 'minting' },
					{ name: 'NFT', value: 'nft' },
					{ name: 'Order', value: 'order' },
					{ name: 'Passport', value: 'passport' },
					{ name: 'Primary Sales', value: 'primarySales' },
					{ name: 'Project', value: 'project' },
					{ name: 'Staking', value: 'staking' },
					{ name: 'Trade', value: 'trade' },
					{ name: 'Utility', value: 'utility' },
					{ name: 'Wallet', value: 'wallet' },
					{ name: 'Withdrawal', value: 'withdrawal' },
					{ name: 'zkEVM', value: 'zkevm' },
				] as INodePropertyOptions[],
				default: 'wallet',
			},
			// Wallet Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['wallet'] } },
				options: [
					{ name: 'Get Balance', value: 'getBalance' },
					{ name: 'Get Token Balances', value: 'getTokenBalances' },
					{ name: 'Get Transaction History', value: 'getTransactionHistory' },
					{ name: 'Validate Address', value: 'validateAddress' },
				] as INodePropertyOptions[],
				default: 'getBalance',
			},
			// NFT Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['nft'] } },
				options: [
					{ name: 'Get NFT', value: 'getNft' },
					{ name: 'Get NFTs by Collection', value: 'getNftsByCollection' },
					{ name: 'Get NFTs by Owner', value: 'getNftsByOwner' },
				] as INodePropertyOptions[],
				default: 'getNft',
			},
			// Collection Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['collection'] } },
				options: [
					{ name: 'Get Collection', value: 'getCollection' },
					{ name: 'List Collections', value: 'listCollections' },
					{ name: 'Get Collection Stats', value: 'getCollectionStats' },
				] as INodePropertyOptions[],
				default: 'getCollection',
			},
			// Minting Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['minting'] } },
				options: [
					{ name: 'Mint NFT', value: 'mintNft' },
					{ name: 'Batch Mint', value: 'batchMint' },
					{ name: 'Get Mint Status', value: 'getMintStatus' },
				] as INodePropertyOptions[],
				default: 'mintNft',
			},
			// Order Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['order'] } },
				options: [
					{ name: 'Get Order', value: 'getOrder' },
					{ name: 'List Orders', value: 'listOrders' },
					{ name: 'List Listings', value: 'listListings' },
					{ name: 'List Bids', value: 'listBids' },
				] as INodePropertyOptions[],
				default: 'getOrder',
			},
			// Trade Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['trade'] } },
				options: [
					{ name: 'Get Trade', value: 'getTrade' },
					{ name: 'List Trades', value: 'listTrades' },
				] as INodePropertyOptions[],
				default: 'getTrade',
			},
			// Deposit Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['deposit'] } },
				options: [
					{ name: 'Get Deposit', value: 'getDeposit' },
					{ name: 'List Deposits', value: 'listDeposits' },
				] as INodePropertyOptions[],
				default: 'getDeposit',
			},
			// Withdrawal Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['withdrawal'] } },
				options: [
					{ name: 'Get Withdrawal', value: 'getWithdrawal' },
					{ name: 'List Withdrawals', value: 'listWithdrawals' },
				] as INodePropertyOptions[],
				default: 'getWithdrawal',
			},
			// Exchange Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['exchange'] } },
				options: [
					{ name: 'List Exchanges', value: 'listExchanges' },
				] as INodePropertyOptions[],
				default: 'listExchanges',
			},
			// Passport Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['passport'] } },
				options: [
					{ name: 'Get User', value: 'getUser' },
				] as INodePropertyOptions[],
				default: 'getUser',
			},
			// zkEVM Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['zkevm'] } },
				options: [
					{ name: 'Get Gas Price', value: 'getGasPrice' },
					{ name: 'Get Block Number', value: 'getBlockNumber' },
					{ name: 'Get Block', value: 'getBlock' },
					{ name: 'Get Transaction', value: 'getTransaction' },
					{ name: 'Get Transaction Receipt', value: 'getTransactionReceipt' },
					{ name: 'Call Contract', value: 'callContract' },
				] as INodePropertyOptions[],
				default: 'getGasPrice',
			},
			// Staking Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['staking'] } },
				options: [
					{ name: 'Get Staking Info', value: 'getStakingInfo' },
				] as INodePropertyOptions[],
				default: 'getStakingInfo',
			},
			// Primary Sales Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['primarySales'] } },
				options: [
					{ name: 'Get Sale', value: 'getSale' },
					{ name: 'List Sales', value: 'listSales' },
				] as INodePropertyOptions[],
				default: 'getSale',
			},
			// Metadata Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['metadata'] } },
				options: [
					{ name: 'Get Metadata Schema', value: 'getMetadataSchema' },
					{ name: 'Refresh Metadata', value: 'refreshMetadata' },
				] as INodePropertyOptions[],
				default: 'getMetadataSchema',
			},
			// Project Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['project'] } },
				options: [
					{ name: 'Get Project', value: 'getProject' },
					{ name: 'List Projects', value: 'listProjects' },
				] as INodePropertyOptions[],
				default: 'getProject',
			},
			// Crafting Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['crafting'] } },
				options: [
					{ name: 'Get Recipe', value: 'getRecipe' },
					{ name: 'List Recipes', value: 'listRecipes' },
				] as INodePropertyOptions[],
				default: 'getRecipe',
			},
			// Activity Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['activity'] } },
				options: [
					{ name: 'Get Activity Feed', value: 'getActivityFeed' },
					{ name: 'Get User Activity', value: 'getUserActivity' },
					{ name: 'Get Collection Activity', value: 'getCollectionActivity' },
				] as INodePropertyOptions[],
				default: 'getActivityFeed',
			},
			// Utility Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['utility'] } },
				options: [
					{ name: 'Convert Wei to ETH', value: 'weiToEth' },
					{ name: 'Convert ETH to Wei', value: 'ethToWei' },
					{ name: 'Validate Address', value: 'validateAddress' },
					{ name: 'Get Network Status', value: 'getNetworkStatus' },
				] as INodePropertyOptions[],
				default: 'weiToEth',
			},
			// Common Parameters
			{
				displayName: 'Address',
				name: 'address',
				type: 'string',
				default: '',
				description: 'Wallet or contract address',
				displayOptions: {
					show: {
						resource: ['wallet', 'nft', 'activity', 'utility', 'passport'],
						operation: ['getBalance', 'getTokenBalances', 'getTransactionHistory', 'getNftsByOwner', 'validateAddress', 'getUserActivity', 'getUser'],
					},
				},
			},
			{
				displayName: 'Collection Address',
				name: 'collectionAddress',
				type: 'string',
				default: '',
				description: 'NFT collection contract address',
				displayOptions: {
					show: {
						resource: ['nft', 'collection', 'minting', 'metadata', 'activity'],
						operation: ['getNft', 'getNftsByCollection', 'getCollection', 'getCollectionStats', 'mintNft', 'batchMint', 'getMintStatus', 'getMetadataSchema', 'refreshMetadata', 'getCollectionActivity'],
					},
				},
			},
			{
				displayName: 'Token ID',
				name: 'tokenId',
				type: 'string',
				default: '',
				description: 'NFT token ID',
				displayOptions: {
					show: {
						resource: ['nft', 'metadata'],
						operation: ['getNft', 'refreshMetadata'],
					},
				},
			},
			{
				displayName: 'Order ID',
				name: 'orderId',
				type: 'string',
				default: '',
				description: 'Order ID',
				displayOptions: {
					show: {
						resource: ['order'],
						operation: ['getOrder'],
					},
				},
			},
			{
				displayName: 'Trade ID',
				name: 'tradeId',
				type: 'string',
				default: '',
				description: 'Trade ID',
				displayOptions: {
					show: {
						resource: ['trade'],
						operation: ['getTrade'],
					},
				},
			},
			{
				displayName: 'Deposit ID',
				name: 'depositId',
				type: 'string',
				default: '',
				description: 'Deposit ID',
				displayOptions: {
					show: {
						resource: ['deposit'],
						operation: ['getDeposit'],
					},
				},
			},
			{
				displayName: 'Withdrawal ID',
				name: 'withdrawalId',
				type: 'string',
				default: '',
				description: 'Withdrawal ID',
				displayOptions: {
					show: {
						resource: ['withdrawal'],
						operation: ['getWithdrawal'],
					},
				},
			},
			{
				displayName: 'Sale ID',
				name: 'saleId',
				type: 'string',
				default: '',
				description: 'Primary sale ID',
				displayOptions: {
					show: {
						resource: ['primarySales'],
						operation: ['getSale'],
					},
				},
			},
			{
				displayName: 'Project ID',
				name: 'projectId',
				type: 'string',
				default: '',
				description: 'Project ID',
				displayOptions: {
					show: {
						resource: ['project'],
						operation: ['getProject'],
					},
				},
			},
			{
				displayName: 'Recipe ID',
				name: 'recipeId',
				type: 'string',
				default: '',
				description: 'Crafting recipe ID',
				displayOptions: {
					show: {
						resource: ['crafting'],
						operation: ['getRecipe'],
					},
				},
			},
			{
				displayName: 'Block Number',
				name: 'blockNumber',
				type: 'string',
				default: 'latest',
				description: 'Block number or "latest"',
				displayOptions: {
					show: {
						resource: ['zkevm'],
						operation: ['getBlock'],
					},
				},
			},
			{
				displayName: 'Transaction Hash',
				name: 'transactionHash',
				type: 'string',
				default: '',
				description: 'Transaction hash',
				displayOptions: {
					show: {
						resource: ['zkevm'],
						operation: ['getTransaction', 'getTransactionReceipt'],
					},
				},
			},
			{
				displayName: 'Contract Address',
				name: 'contractAddress',
				type: 'string',
				default: '',
				description: 'Contract address for call',
				displayOptions: {
					show: {
						resource: ['zkevm'],
						operation: ['callContract'],
					},
				},
			},
			{
				displayName: 'Call Data',
				name: 'callData',
				type: 'string',
				default: '',
				description: 'Encoded call data (hex)',
				displayOptions: {
					show: {
						resource: ['zkevm'],
						operation: ['callContract'],
					},
				},
			},
			{
				displayName: 'Value',
				name: 'value',
				type: 'string',
				default: '',
				description: 'Value to convert',
				displayOptions: {
					show: {
						resource: ['utility'],
						operation: ['weiToEth', 'ethToWei'],
					},
				},
			},
			{
				displayName: 'Mint Request ID',
				name: 'mintRequestId',
				type: 'string',
				default: '',
				description: 'Mint request ID',
				displayOptions: {
					show: {
						resource: ['minting'],
						operation: ['getMintStatus'],
					},
				},
			},
			{
				displayName: 'NFT Metadata',
				name: 'nftMetadata',
				type: 'json',
				default: '{"name": "", "description": "", "image": ""}',
				description: 'NFT metadata JSON',
				displayOptions: {
					show: {
						resource: ['minting'],
						operation: ['mintNft'],
					},
				},
			},
			{
				displayName: 'Owner Address',
				name: 'ownerAddress',
				type: 'string',
				default: '',
				description: 'Owner address for minted NFT',
				displayOptions: {
					show: {
						resource: ['minting'],
						operation: ['mintNft', 'batchMint'],
					},
				},
			},
			{
				displayName: 'NFTs to Mint',
				name: 'nftsToMint',
				type: 'json',
				default: '[]',
				description: 'Array of NFTs to mint',
				displayOptions: {
					show: {
						resource: ['minting'],
						operation: ['batchMint'],
					},
				},
			},
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				default: 50,
				description: 'Maximum number of results',
				displayOptions: {
					show: {
						operation: ['listCollections', 'listOrders', 'listListings', 'listBids', 'listTrades', 'listDeposits', 'listWithdrawals', 'listSales', 'listProjects', 'listRecipes', 'getActivityFeed', 'getUserActivity', 'getCollectionActivity', 'getNftsByCollection', 'getNftsByOwner', 'listExchanges'],
					},
				},
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		// Get credentials
		const credentials = await this.getCredentials('immutableNetwork');
		const network = (credentials.network as string) || 'zkevmTestnet';
		const networkConfig = NETWORKS[network] || NETWORKS.zkevmTestnet;
		const apiKey = credentials.apiKey as string;

		// Helper function for API requests
		const makeApiRequest = async (
			method: IHttpRequestMethods,
			endpoint: string,
			body?: IDataObject,
			qs?: IDataObject,
		): Promise<IDataObject> => {
			const response = await this.helpers.httpRequest({
				method,
				url: `${networkConfig.apiUrl}${endpoint}`,
				headers: {
					'Content-Type': 'application/json',
					...(apiKey && { 'x-api-key': apiKey }),
				},
				body,
				qs,
				json: true,
			});
			return response as IDataObject;
		};

		// Helper function for JSON-RPC requests
		const makeRpcRequest = async (method: string, params: unknown[] = []): Promise<unknown> => {
			if (!networkConfig.rpcUrl) {
				throw new NodeOperationError(this.getNode(), 'RPC not available for this network (Immutable X uses REST API)');
			}

			const response = await this.helpers.httpRequest({
				method: 'POST',
				url: networkConfig.rpcUrl,
				headers: { 'Content-Type': 'application/json' },
				body: {
					jsonrpc: '2.0',
					id: 1,
					method,
					params,
				},
				json: true,
			});

			if ((response as IDataObject).error) {
				throw new NodeOperationError(this.getNode(), `RPC Error: ${((response as IDataObject).error as IDataObject).message}`);
			}

			return (response as IDataObject).result;
		};

		for (let i = 0; i < items.length; i++) {
			try {
				let result: IDataObject = {};

				// Wallet Resource
				if (resource === 'wallet') {
					if (operation === 'getBalance') {
						const address = this.getNodeParameter('address', i) as string;
						if (networkConfig.rpcUrl) {
							// zkEVM - use JSON-RPC
							const balance = await makeRpcRequest('eth_getBalance', [address, 'latest']);
							const balanceWei = BigInt(balance as string);
							result = {
								address,
								balanceWei: balanceWei.toString(),
								balanceEth: (Number(balanceWei) / 1e18).toFixed(18),
							};
						} else {
							// IMX - use REST API
							const response = await makeApiRequest('GET', `/v2/balances/${address}`);
							result = response;
						}
					} else if (operation === 'getTokenBalances') {
						const address = this.getNodeParameter('address', i) as string;
						result = await makeApiRequest('GET', `/v1/chains/${networkConfig.chainName}/accounts/${address}/balances`);
					} else if (operation === 'getTransactionHistory') {
						const address = this.getNodeParameter('address', i) as string;
						result = await makeApiRequest('GET', `/v1/chains/${networkConfig.chainName}/activities`, undefined, { account_address: address, page_size: 50 });
					} else if (operation === 'validateAddress') {
						const address = this.getNodeParameter('address', i) as string;
						const isValid = /^0x[a-fA-F0-9]{40}$/.test(address);
						result = { address, isValid };
					}
				}

				// NFT Resource
				else if (resource === 'nft') {
					if (operation === 'getNft') {
						const collectionAddress = this.getNodeParameter('collectionAddress', i) as string;
						const tokenId = this.getNodeParameter('tokenId', i) as string;
						result = await makeApiRequest('GET', `/v1/chains/${networkConfig.chainName}/collections/${collectionAddress}/nfts/${tokenId}`);
					} else if (operation === 'getNftsByCollection') {
						const collectionAddress = this.getNodeParameter('collectionAddress', i) as string;
						const limit = this.getNodeParameter('limit', i) as number;
						result = await makeApiRequest('GET', `/v1/chains/${networkConfig.chainName}/collections/${collectionAddress}/nfts`, undefined, { page_size: limit });
					} else if (operation === 'getNftsByOwner') {
						const address = this.getNodeParameter('address', i) as string;
						const limit = this.getNodeParameter('limit', i) as number;
						result = await makeApiRequest('GET', `/v1/chains/${networkConfig.chainName}/accounts/${address}/nfts`, undefined, { page_size: limit });
					}
				}

				// Collection Resource
				else if (resource === 'collection') {
					if (operation === 'getCollection') {
						const collectionAddress = this.getNodeParameter('collectionAddress', i) as string;
						result = await makeApiRequest('GET', `/v1/chains/${networkConfig.chainName}/collections/${collectionAddress}`);
					} else if (operation === 'listCollections') {
						const limit = this.getNodeParameter('limit', i) as number;
						result = await makeApiRequest('GET', `/v1/chains/${networkConfig.chainName}/collections`, undefined, { page_size: limit });
					} else if (operation === 'getCollectionStats') {
						const collectionAddress = this.getNodeParameter('collectionAddress', i) as string;
						// Get listings to calculate floor price
						const listings = await makeApiRequest('GET', `/v1/chains/${networkConfig.chainName}/orders/listings`, undefined, {
							sell_item_contract_address: collectionAddress,
							status: 'ACTIVE',
							page_size: 100,
						}) as { result?: Array<{ buy?: Array<{ amount?: string }> }> };

						const prices = (listings.result || [])
							.map(o => BigInt(o.buy?.[0]?.amount || '0'))
							.filter(p => p > BigInt(0));
						const floorPrice = prices.length > 0 ? prices.reduce((a, b) => a < b ? a : b) : BigInt(0);

						result = {
							collectionAddress,
							totalListings: prices.length,
							floorPriceWei: floorPrice.toString(),
							floorPriceEth: (Number(floorPrice) / 1e18).toFixed(18),
						};
					}
				}

				// Minting Resource
				else if (resource === 'minting') {
					if (operation === 'mintNft') {
						const collectionAddress = this.getNodeParameter('collectionAddress', i) as string;
						const metadata = this.getNodeParameter('nftMetadata', i) as string;
						const ownerAddress = this.getNodeParameter('ownerAddress', i) as string;
						result = await makeApiRequest('POST', `/v1/chains/${networkConfig.chainName}/collections/${collectionAddress}/nfts/mint-requests`, {
							assets: [{ metadata: JSON.parse(metadata), owner_address: ownerAddress }],
						});
					} else if (operation === 'batchMint') {
						const collectionAddress = this.getNodeParameter('collectionAddress', i) as string;
						const nfts = this.getNodeParameter('nftsToMint', i) as string;
						result = await makeApiRequest('POST', `/v1/chains/${networkConfig.chainName}/collections/${collectionAddress}/nfts/mint-requests`, {
							assets: JSON.parse(nfts),
						});
					} else if (operation === 'getMintStatus') {
						const collectionAddress = this.getNodeParameter('collectionAddress', i) as string;
						const mintRequestId = this.getNodeParameter('mintRequestId', i) as string;
						result = await makeApiRequest('GET', `/v1/chains/${networkConfig.chainName}/collections/${collectionAddress}/nfts/mint-requests/${mintRequestId}`);
					}
				}

				// Order Resource
				else if (resource === 'order') {
					if (operation === 'getOrder') {
						const orderId = this.getNodeParameter('orderId', i) as string;
						result = await makeApiRequest('GET', `/v1/chains/${networkConfig.chainName}/orders/${orderId}`);
					} else if (operation === 'listOrders') {
						const limit = this.getNodeParameter('limit', i) as number;
						result = await makeApiRequest('GET', `/v1/chains/${networkConfig.chainName}/orders`, undefined, { page_size: limit });
					} else if (operation === 'listListings') {
						const limit = this.getNodeParameter('limit', i) as number;
						result = await makeApiRequest('GET', `/v1/chains/${networkConfig.chainName}/orders/listings`, undefined, { page_size: limit });
					} else if (operation === 'listBids') {
						const limit = this.getNodeParameter('limit', i) as number;
						result = await makeApiRequest('GET', `/v1/chains/${networkConfig.chainName}/orders/bids`, undefined, { page_size: limit });
					}
				}

				// Trade Resource
				else if (resource === 'trade') {
					if (operation === 'getTrade') {
						const tradeId = this.getNodeParameter('tradeId', i) as string;
						result = await makeApiRequest('GET', `/v1/chains/${networkConfig.chainName}/trades/${tradeId}`);
					} else if (operation === 'listTrades') {
						const limit = this.getNodeParameter('limit', i) as number;
						result = await makeApiRequest('GET', `/v1/chains/${networkConfig.chainName}/trades`, undefined, { page_size: limit });
					}
				}

				// Deposit Resource
				else if (resource === 'deposit') {
					if (operation === 'getDeposit') {
						const depositId = this.getNodeParameter('depositId', i) as string;
						result = await makeApiRequest('GET', `/v1/deposits/${depositId}`);
					} else if (operation === 'listDeposits') {
						const limit = this.getNodeParameter('limit', i) as number;
						result = await makeApiRequest('GET', `/v1/deposits`, undefined, { page_size: limit });
					}
				}

				// Withdrawal Resource
				else if (resource === 'withdrawal') {
					if (operation === 'getWithdrawal') {
						const withdrawalId = this.getNodeParameter('withdrawalId', i) as string;
						result = await makeApiRequest('GET', `/v1/withdrawals/${withdrawalId}`);
					} else if (operation === 'listWithdrawals') {
						const limit = this.getNodeParameter('limit', i) as number;
						result = await makeApiRequest('GET', `/v1/withdrawals`, undefined, { page_size: limit });
					}
				}

				// Exchange Resource
				else if (resource === 'exchange') {
					if (operation === 'listExchanges') {
						const limit = this.getNodeParameter('limit', i) as number;
						result = await makeApiRequest('GET', `/v1/exchanges`, undefined, { page_size: limit });
					}
				}

				// Passport Resource
				else if (resource === 'passport') {
					if (operation === 'getUser') {
						const address = this.getNodeParameter('address', i) as string;
						result = await makeApiRequest('GET', `/v1/users/${address}`);
					}
				}

				// zkEVM Resource
				else if (resource === 'zkevm') {
					if (operation === 'getGasPrice') {
						const gasPrice = await makeRpcRequest('eth_gasPrice');
						const gasPriceWei = BigInt(gasPrice as string);
						result = {
							gasPriceWei: gasPriceWei.toString(),
							gasPriceGwei: (Number(gasPriceWei) / 1e9).toFixed(9),
						};
					} else if (operation === 'getBlockNumber') {
						const blockNumber = await makeRpcRequest('eth_blockNumber');
						result = { blockNumber: parseInt(blockNumber as string, 16) };
					} else if (operation === 'getBlock') {
						const blockNumber = this.getNodeParameter('blockNumber', i) as string;
						const blockParam = blockNumber === 'latest' ? 'latest' : `0x${parseInt(blockNumber).toString(16)}`;
						const block = await makeRpcRequest('eth_getBlockByNumber', [blockParam, false]);
						result = (block || {}) as IDataObject;
					} else if (operation === 'getTransaction') {
						const transactionHash = this.getNodeParameter('transactionHash', i) as string;
						const tx = await makeRpcRequest('eth_getTransactionByHash', [transactionHash]);
						result = (tx || {}) as IDataObject;
					} else if (operation === 'getTransactionReceipt') {
						const transactionHash = this.getNodeParameter('transactionHash', i) as string;
						const receipt = await makeRpcRequest('eth_getTransactionReceipt', [transactionHash]);
						result = (receipt || {}) as IDataObject;
					} else if (operation === 'callContract') {
						const contractAddress = this.getNodeParameter('contractAddress', i) as string;
						const callData = this.getNodeParameter('callData', i) as string;
						const callResult = await makeRpcRequest('eth_call', [{ to: contractAddress, data: callData }, 'latest']);
						result = { result: callResult as string };
					}
				}

				// Staking Resource
				else if (resource === 'staking') {
					if (operation === 'getStakingInfo') {
						result = { message: 'Staking info endpoint - configure via Immutable Hub' };
					}
				}

				// Primary Sales Resource
				else if (resource === 'primarySales') {
					if (operation === 'getSale') {
						const saleId = this.getNodeParameter('saleId', i) as string;
						result = await makeApiRequest('GET', `/v1/chains/${networkConfig.chainName}/primary-sales/${saleId}`);
					} else if (operation === 'listSales') {
						const limit = this.getNodeParameter('limit', i) as number;
						result = await makeApiRequest('GET', `/v1/chains/${networkConfig.chainName}/primary-sales`, undefined, { page_size: limit });
					}
				}

				// Metadata Resource
				else if (resource === 'metadata') {
					if (operation === 'getMetadataSchema') {
						const collectionAddress = this.getNodeParameter('collectionAddress', i) as string;
						result = await makeApiRequest('GET', `/v1/chains/${networkConfig.chainName}/collections/${collectionAddress}/metadata-schema`);
					} else if (operation === 'refreshMetadata') {
						const collectionAddress = this.getNodeParameter('collectionAddress', i) as string;
						const tokenId = this.getNodeParameter('tokenId', i) as string;
						result = await makeApiRequest('POST', `/v1/chains/${networkConfig.chainName}/collections/${collectionAddress}/nfts/${tokenId}/metadata/refresh`);
					}
				}

				// Project Resource
				else if (resource === 'project') {
					if (operation === 'getProject') {
						const projectId = this.getNodeParameter('projectId', i) as string;
						result = await makeApiRequest('GET', `/v1/projects/${projectId}`);
					} else if (operation === 'listProjects') {
						const limit = this.getNodeParameter('limit', i) as number;
						result = await makeApiRequest('GET', `/v1/projects`, undefined, { page_size: limit });
					}
				}

				// Crafting Resource
				else if (resource === 'crafting') {
					if (operation === 'getRecipe') {
						const recipeId = this.getNodeParameter('recipeId', i) as string;
						result = await makeApiRequest('GET', `/v1/crafting/recipes/${recipeId}`);
					} else if (operation === 'listRecipes') {
						const limit = this.getNodeParameter('limit', i) as number;
						result = await makeApiRequest('GET', `/v1/crafting/recipes`, undefined, { page_size: limit });
					}
				}

				// Activity Resource
				else if (resource === 'activity') {
					if (operation === 'getActivityFeed') {
						const limit = this.getNodeParameter('limit', i) as number;
						result = await makeApiRequest('GET', `/v1/chains/${networkConfig.chainName}/activities`, undefined, { page_size: limit });
					} else if (operation === 'getUserActivity') {
						const address = this.getNodeParameter('address', i) as string;
						const limit = this.getNodeParameter('limit', i) as number;
						result = await makeApiRequest('GET', `/v1/chains/${networkConfig.chainName}/activities`, undefined, { account_address: address, page_size: limit });
					} else if (operation === 'getCollectionActivity') {
						const collectionAddress = this.getNodeParameter('collectionAddress', i) as string;
						const limit = this.getNodeParameter('limit', i) as number;
						result = await makeApiRequest('GET', `/v1/chains/${networkConfig.chainName}/collections/${collectionAddress}/activities`, undefined, { page_size: limit });
					}
				}

				// Utility Resource
				else if (resource === 'utility') {
					if (operation === 'weiToEth') {
						const value = this.getNodeParameter('value', i) as string;
						const wei = BigInt(value);
						result = { wei: value, eth: (Number(wei) / 1e18).toFixed(18) };
					} else if (operation === 'ethToWei') {
						const value = this.getNodeParameter('value', i) as string;
						const wei = BigInt(Math.floor(parseFloat(value) * 1e18));
						result = { eth: value, wei: wei.toString() };
					} else if (operation === 'validateAddress') {
						const address = this.getNodeParameter('address', i) as string;
						const isValid = /^0x[a-fA-F0-9]{40}$/.test(address);
						result = { address, isValid };
					} else if (operation === 'getNetworkStatus') {
						if (networkConfig.rpcUrl) {
							const blockNumber = await makeRpcRequest('eth_blockNumber');
							const gasPrice = await makeRpcRequest('eth_gasPrice');
							result = {
								network: networkConfig.chainName,
								chainId: networkConfig.chainId,
								blockNumber: parseInt(blockNumber as string, 16),
								gasPriceWei: BigInt(gasPrice as string).toString(),
							};
						} else {
							result = {
								network: networkConfig.chainName,
								chainId: networkConfig.chainId,
								apiUrl: networkConfig.apiUrl,
							};
						}
					}
				}

				returnData.push({ json: result });
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({ json: { error: (error as Error).message } });
				} else {
					throw new NodeOperationError(this.getNode(), error as Error, { itemIndex: i });
				}
			}
		}

		return [returnData];
	}
}
