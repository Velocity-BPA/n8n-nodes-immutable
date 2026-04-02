/**
 * Copyright (c) 2026 Velocity BPA
 * 
 * Licensed under the Business Source License 1.1 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     https://github.com/VelocityBPA/n8n-nodes-immutable/blob/main/LICENSE
 * 
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeOperationError,
  NodeApiError,
} from 'n8n-workflow';

export class Immutable implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Immutable',
    name: 'immutable',
    icon: 'file:immutable.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Interact with the Immutable API',
    defaults: {
      name: 'Immutable',
    },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
      {
        name: 'immutableApi',
        required: true,
      },
    ],
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'Collections',
            value: 'collections',
          },
          {
            name: 'Assets',
            value: 'assets',
          },
          {
            name: 'Orders',
            value: 'orders',
          },
          {
            name: 'Trades',
            value: 'trades',
          },
          {
            name: 'Transfers',
            value: 'transfers',
          },
          {
            name: 'Users',
            value: 'users',
          },
          {
            name: 'Projects',
            value: 'projects',
          },
          {
            name: 'Withdrawals',
            value: 'withdrawals',
          }
        ],
        default: 'collections',
      },
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['collections'],
    },
  },
  options: [
    {
      name: 'Create Collection',
      value: 'createCollection',
      description: 'Create a new NFT collection',
      action: 'Create a collection',
    },
    {
      name: 'Get Collection',
      value: 'getCollection',
      description: 'Get collection details by address',
      action: 'Get a collection',
    },
    {
      name: 'List Collections',
      value: 'listCollections',
      description: 'List all collections with pagination',
      action: 'List collections',
    },
    {
      name: 'Update Collection',
      value: 'updateCollection',
      description: 'Update collection metadata',
      action: 'Update a collection',
    },
    {
      name: 'Get Collection NFTs',
      value: 'getCollectionNFTs',
      description: 'Get all NFTs in a collection',
      action: 'Get collection NFTs',
    },
  ],
  default: 'createCollection',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['assets'],
    },
  },
  options: [
    {
      name: 'Mint Asset',
      value: 'mintAsset',
      description: 'Mint new NFT assets with zero gas',
      action: 'Mint asset',
    },
    {
      name: 'Get Asset',
      value: 'getAsset',
      description: 'Get specific asset details',
      action: 'Get asset',
    },
    {
      name: 'List Assets',
      value: 'listAssets',
      description: 'List assets with filtering options',
      action: 'List assets',
    },
    {
      name: 'Update Asset',
      value: 'updateAsset',
      description: 'Update asset metadata',
      action: 'Update asset',
    },
    {
      name: 'Transfer Asset',
      value: 'transferAsset',
      description: 'Transfer asset to another address',
      action: 'Transfer asset',
    },
  ],
  default: 'mintAsset',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['orders'],
    },
  },
  options: [
    {
      name: 'Create Order',
      value: 'createOrder',
      description: 'Create buy or sell order',
      action: 'Create order',
    },
    {
      name: 'Get Order',
      value: 'getOrder',
      description: 'Get order details by ID',
      action: 'Get order',
    },
    {
      name: 'List Orders',
      value: 'listOrders',
      description: 'List orders with filtering',
      action: 'List orders',
    },
    {
      name: 'Update Order',
      value: 'updateOrder',
      description: 'Update order status or details',
      action: 'Update order',
    },
    {
      name: 'Cancel Order',
      value: 'cancelOrder',
      description: 'Cancel an existing order',
      action: 'Cancel order',
    },
  ],
  default: 'createOrder',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['trades'],
    },
  },
  options: [
    {
      name: 'Create Trade',
      value: 'createTrade',
      description: 'Execute a trade between buyer and seller',
      action: 'Create trade',
    },
    {
      name: 'Get Trade',
      value: 'getTrade',
      description: 'Get trade details by ID',
      action: 'Get trade',
    },
    {
      name: 'List Trades',
      value: 'listTrades',
      description: 'List trades with filtering options',
      action: 'List trades',
    },
    {
      name: 'Get Trades Summary',
      value: 'getTradesSummary',
      description: 'Get trading volume and statistics',
      action: 'Get trades summary',
    },
  ],
  default: 'createTrade',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['transfers'] } },
  options: [
    { name: 'Create Transfer', value: 'createTransfer', description: 'Transfer assets between users', action: 'Create a transfer' },
    { name: 'Get Transfer', value: 'getTransfer', description: 'Get transfer details by ID', action: 'Get a transfer' },
    { name: 'List Transfers', value: 'listTransfers', description: 'List transfers with filtering', action: 'List transfers' }
  ],
  default: 'createTransfer',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['users'],
    },
  },
  options: [
    {
      name: 'Get User Profile',
      value: 'getUser',
      description: 'Get user profile and stats',
      action: 'Get user profile',
    },
    {
      name: 'Get User Balances',
      value: 'getUserBalances',
      description: 'Get user token balances',
      action: 'Get user balances',
    },
    {
      name: 'Get User Orders',
      value: 'getUserOrders',
      description: 'Get orders created by user',
      action: 'Get user orders',
    },
    {
      name: 'Get User Trades',
      value: 'getUserTrades',
      description: "Get user's trade history",
      action: 'Get user trades',
    },
    {
      name: 'Get User NFTs',
      value: 'getUserNFTs',
      description: 'Get NFTs owned by user',
      action: 'Get user NFTs',
    },
    { name: 'Register User', value: 'registerUser', description: 'Register a new user on Immutable X', action: 'Register a user' },
    { name: 'Get User Assets', value: 'getUserAssets', description: 'Get assets owned by user', action: 'Get user assets' }
  ],
  default: 'getUser',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['projects'],
    },
  },
  options: [
    {
      name: 'Create Project',
      value: 'createProject',
      description: 'Create a new gaming project',
      action: 'Create project',
    },
    {
      name: 'Get Project',
      value: 'getProject',
      description: 'Get project details',
      action: 'Get project',
    },
    {
      name: 'List Projects',
      value: 'listProjects',
      description: 'List user\'s projects',
      action: 'List projects',
    },
    {
      name: 'Update Project',
      value: 'updateProject',
      description: 'Update project settings',
      action: 'Update project',
    },
    {
      name: 'Get Project Collections',
      value: 'getProjectCollections',
      description: 'Get collections in project',
      action: 'Get project collections',
    },
  ],
  default: 'createProject',
},
{
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['withdrawals'],
		},
	},
	options: [
		{
			name: 'Create Withdrawal',
			value: 'createWithdrawal',
			description: 'Initiate withdrawal to Ethereum',
			action: 'Create withdrawal',
		},
		{
			name: 'Get Withdrawal',
			value: 'getWithdrawal',
			description: 'Get withdrawal status',
			action: 'Get withdrawal',
		},
		{
			name: 'List Withdrawals',
			value: 'listWithdrawals',
			description: 'List user withdrawals',
			action: 'List withdrawals',
		},
		{
			name: 'Get Signable Withdrawal',
			value: 'getSignableWithdrawal',
			description: 'Get withdrawal data for signing',
			action: 'Get signable withdrawal',
		},
		{
			name: 'Complete Withdrawal',
			value: 'completeWithdrawal',
			description: 'Complete withdrawal on Ethereum mainnet',
			action: 'Complete withdrawal',
		},
	],
	default: 'createWithdrawal',
},
{
  displayName: 'Collection Name',
  name: 'name',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['collections'],
      operation: ['createCollection'],
    },
  },
  default: '',
  description: 'The name of the collection',
},
{
  displayName: 'Description',
  name: 'description',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['collections'],
      operation: ['createCollection'],
    },
  },
  default: '',
  description: 'The description of the collection',
},
{
  displayName: 'Collection Image URL',
  name: 'collection_image_url',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['collections'],
      operation: ['createCollection'],
    },
  },
  default: '',
  description: 'The image URL for the collection',
},
{
  displayName: 'Project ID',
  name: 'project_id',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['collections'],
      operation: ['createCollection'],
    },
  },
  default: '',
  description: 'The project ID for the collection',
},
{
  displayName: 'Metadata API URL',
  name: 'metadata_api_url',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['collections'], operation: ['createCollection'] } },
  default: '',
  description: 'Metadata API URL for the collection (must be HTTPS)',
},
{
  displayName: 'Contract Address',
  name: 'contract_address',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['collections'], operation: ['createCollection'] } },
  default: '',
  description: 'Smart contract address for the collection',
},
{
  displayName: 'Collection Address',
  name: 'collection_address',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['collections'],
      operation: ['getCollection', 'updateCollection', 'getCollectionNFTs'],
    },
  },
  default: '',
  description: 'The address of the collection',
},
{
  displayName: 'Page Size',
  name: 'page_size',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['collections'],
      operation: ['listCollections', 'getCollectionNFTs'],
    },
  },
  default: 50,
  description: 'Number of items to return per page',
},
{
  displayName: 'Cursor',
  name: 'cursor',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['collections'],
      operation: ['listCollections', 'getCollectionNFTs'],
    },
  },
  default: '',
  description: 'Pagination cursor for next page',
},
{
  displayName: 'Keyword',
  name: 'keyword',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['collections'],
      operation: ['listCollections'],
    },
  },
  default: '',
  description: 'Keyword to search for in collection names',
},
{
  displayName: 'Order By',
  name: 'order_by',
  type: 'options',
  options: [
    { name: 'Name', value: 'name' },
    { name: 'Created At', value: 'created_at' },
    { name: 'Updated At', value: 'updated_at' },
  ],
  displayOptions: { show: { resource: ['collections'], operation: ['listCollections'] } },
  default: 'created_at',
  description: 'Field to order results by',
},
{
  displayName: 'Environment',
  name: 'environment',
  type: 'options',
  required: true,
  displayOptions: {
    show: {
      resource: ['assets'],
    },
  },
  options: [
    {
      name: 'Sandbox',
      value: 'sandbox',
    },
    {
      name: 'Mainnet',
      value: 'mainnet',
    },
  ],
  default: 'sandbox',
  description: 'Select the environment to use',
},
{
  displayName: 'Collection Address',
  name: 'collection_address',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['assets'],
      operation: ['mintAsset'],
    },
  },
  default: '',
  description: 'The address of the collection to mint the asset in',
},
{
  displayName: 'To Address',
  name: 'to',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['assets'],
      operation: ['mintAsset'],
    },
  },
  default: '',
  description: 'The address to mint the asset to',
},
{
  displayName: 'Token ID',
  name: 'token_id',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['assets'],
      operation: ['mintAsset', 'getAsset', 'updateAsset', 'transferAsset'],
    },
  },
  default: '',
  description: 'The token ID of the asset',
},
{
  displayName: 'Blueprint',
  name: 'blueprint',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['assets'],
      operation: ['mintAsset'],
    },
  },
  default: '',
  description: 'The blueprint for the asset',
},
{
  displayName: 'Metadata',
  name: 'metadata',
  type: 'json',
  displayOptions: {
    show: {
      resource: ['assets'],
      operation: ['mintAsset', 'updateAsset'],
    },
  },
  default: '{}',
  description: 'The metadata for the asset',
},
{
  displayName: 'Token Address',
  name: 'token_address',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['assets'],
      operation: ['getAsset', 'updateAsset', 'transferAsset'],
    },
  },
  default: '',
  description: 'The token contract address',
},
{
  displayName: 'Collection',
  name: 'collection',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['assets'],
      operation: ['listAssets'],
    },
  },
  default: '',
  description: 'Filter by collection address',
},
{
  displayName: 'Owner',
  name: 'owner',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['assets'],
      operation: ['listAssets'],
    },
  },
  default: '',
  description: 'Filter by owner address',
},
{
  displayName: 'Page Size',
  name: 'page_size',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['assets'],
      operation: ['listAssets'],
    },
  },
  default: 100,
  description: 'Number of items per page',
},
{
  displayName: 'Status',
  name: 'status',
  type: 'options',
  displayOptions: {
    show: {
      resource: ['assets'],
      operation: ['listAssets'],
    },
  },
  options: [
    {
      name: 'Active',
      value: 'active',
    },
    {
      name: 'Inactive',
      value: 'inactive',
    },
  ],
  default: 'active',
  description: 'Filter by status',
},
{
  displayName: 'Receiver Address',
  name: 'receiver',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['assets'],
      operation: ['transferAsset'],
    },
  },
  default: '',
  description: 'The address to transfer the asset to',
},
{
  displayName: 'Environment',
  name: 'environment',
  type: 'options',
  options: [
    {
      name: 'Sandbox',
      value: 'sandbox',
    },
    {
      name: 'Mainnet',
      value: 'mainnet',
    },
  ],
  default: 'sandbox',
  description: 'The environment to use',
  displayOptions: {
    show: {
      resource: ['orders'],
    },
  },
},
{
  displayName: 'Order Type',
  name: 'type',
  type: 'options',
  required: true,
  options: [
    {
      name: 'Buy',
      value: 'buy',
    },
    {
      name: 'Sell',
      value: 'sell',
    },
  ],
  displayOptions: {
    show: {
      resource: ['orders'],
      operation: ['createOrder'],
    },
  },
  default: 'buy',
  description: 'The type of order to create',
},
{
  displayName: 'Order Data',
  name: 'data',
  type: 'json',
  required: true,
  displayOptions: {
    show: {
      resource: ['orders'],
      operation: ['createOrder'],
    },
  },
  default: '{}',
  description: 'The order data object containing token details, amounts, and addresses',
},
{
  displayName: 'Fees',
  name: 'fees',
  type: 'json',
  displayOptions: {
    show: {
      resource: ['orders'],
      operation: ['createOrder'],
    },
  },
  default: '[]',
  description: 'Array of fee objects for the order',
},
{
  displayName: 'Timestamp',
  name: 'timestamp',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['orders'],
      operation: ['createOrder'],
    },
  },
  default: 0,
  description: 'Order timestamp (Unix timestamp)',
},
{
  displayName: 'Order ID',
  name: 'orderId',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['orders'],
      operation: ['getOrder', 'updateOrder', 'cancelOrder'],
    },
  },
  default: '',
  description: 'The ID of the order',
},
{
  displayName: 'Status',
  name: 'status',
  type: 'options',
  options: [
    {
      name: 'Active',
      value: 'active',
    },
    {
      name: 'Filled',
      value: 'filled',
    },
    {
      name: 'Cancelled',
      value: 'cancelled',
    },
    {
      name: 'Expired',
      value: 'expired',
    },
    {
      name: 'Inactive',
      value: 'inactive',
    },
  ],
  displayOptions: {
    show: {
      resource: ['orders'],
      operation: ['listOrders', 'updateOrder'],
    },
  },
  default: '',
  description: 'Filter by order status or new status for update',
},
{
  displayName: 'User Address',
  name: 'user',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['orders'],
      operation: ['listOrders'],
    },
  },
  default: '',
  description: 'Filter orders by user address',
},
{
  displayName: 'Sell Token Address',
  name: 'sellTokenAddress',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['orders'],
      operation: ['listOrders'],
    },
  },
  default: '',
  description: 'Filter orders by sell token contract address',
},
{
  displayName: 'Buy Token Address',
  name: 'buyTokenAddress',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['orders'],
      operation: ['listOrders'],
    },
  },
  default: '',
  description: 'Filter orders by buy token contract address',
},
{
  displayName: 'Page Size',
  name: 'pageSize',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['orders'],
      operation: ['listOrders'],
    },
  },
  default: 50,
  description: 'Number of orders to return per page (max 200)',
},
{
  displayName: 'Order ID',
  name: 'orderId',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['trades'],
      operation: ['createTrade'],
    },
  },
  default: '',
  description: 'The order ID to execute trade for',
},
{
  displayName: 'Fees',
  name: 'fees',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['trades'],
      operation: ['createTrade'],
    },
  },
  default: 0,
  description: 'The fees associated with the trade',
},
{
  displayName: 'Timestamp',
  name: 'timestamp',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['trades'],
      operation: ['createTrade'],
    },
  },
  default: '',
  description: 'The timestamp of the trade',
},
{
  displayName: 'Trade ID',
  name: 'tradeId',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['trades'],
      operation: ['getTrade'],
    },
  },
  default: '',
  description: 'The ID of the trade to retrieve',
},
{
  displayName: 'Party A Token Address',
  name: 'partyATokenAddress',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['trades'],
      operation: ['listTrades'],
    },
  },
  default: '',
  description: 'Filter by party A token address',
},
{
  displayName: 'Party B Token Address',
  name: 'partyBTokenAddress',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['trades'],
      operation: ['listTrades'],
    },
  },
  default: '',
  description: 'Filter by party B token address',
},
{
  displayName: 'Min Timestamp',
  name: 'minTimestamp',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['trades'],
      operation: ['listTrades'],
    },
  },
  default: '',
  description: 'Minimum timestamp for filtering trades',
},
{
  displayName: 'Max Timestamp',
  name: 'maxTimestamp',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['trades'],
      operation: ['listTrades'],
    },
  },
  default: '',
  description: 'Maximum timestamp for filtering trades',
},
{
  displayName: 'Collection',
  name: 'collection',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['trades'],
      operation: ['getTradesSummary'],
    },
  },
  default: '',
  description: 'Collection address to get trading statistics for',
},
{
  displayName: 'Period',
  name: 'period',
  type: 'options',
  displayOptions: {
    show: {
      resource: ['trades'],
      operation: ['getTradesSummary'],
    },
  },
  options: [
    {
      name: '1 Hour',
      value: '1h',
    },
    {
      name: '24 Hours',
      value: '24h',
    },
    {
      name: '7 Days',
      value: '7d',
    },
    {
      name: '30 Days',
      value: '30d',
    },
  ],
  default: '24h',
  description: 'Time period for trading statistics',
},
{
  displayName: 'Transfer ID',
  name: 'transferId',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['transfers'], operation: ['getTransfer'] } },
  default: '',
  description: 'The ID of the transfer to retrieve',
},
{
  displayName: 'Sender',
  name: 'sender',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['transfers'], operation: ['createTransfer'] } },
  default: '',
  description: 'The wallet address of the sender',
},
{
  displayName: 'Receiver',
  name: 'receiver',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['transfers'], operation: ['createTransfer'] } },
  default: '',
  description: 'The wallet address of the receiver',
},
{
  displayName: 'Token Type',
  name: 'tokenType',
  type: 'options',
  required: true,
  displayOptions: { show: { resource: ['transfers'], operation: ['createTransfer'] } },
  options: [
    { name: 'ERC721', value: 'ERC721' },
    { name: 'ERC20', value: 'ERC20' },
    { name: 'ETH', value: 'ETH' }
  ],
  default: 'ERC721',
  description: 'The type of token to transfer',
},
{
  displayName: 'Token ID',
  name: 'tokenId',
  type: 'string',
  displayOptions: { show: { resource: ['transfers'], operation: ['createTransfer'] } },
  default: '',
  description: 'The ID of the token (required for ERC721)',
},
{
  displayName: 'Token Address',
  name: 'tokenAddress',
  type: 'string',
  displayOptions: { show: { resource: ['transfers'], operation: ['createTransfer'] } },
  default: '',
  description: 'The contract address of the token',
},
{
  displayName: 'Quantity',
  name: 'quantity',
  type: 'string',
  displayOptions: { show: { resource: ['transfers'], operation: ['createTransfer'] } },
  default: '1',
  description: 'The quantity to transfer',
},
{
  displayName: 'Page Size',
  name: 'pageSize',
  type: 'number',
  displayOptions: { show: { resource: ['transfers'], operation: ['listTransfers'] } },
  default: 20,
  description: 'Number of transfers to return per page',
},
{
  displayName: 'Order By',
  name: 'orderBy',
  type: 'options',
  displayOptions: { show: { resource: ['transfers'], operation: ['listTransfers'] } },
  options: [
    { name: 'Created At', value: 'created_at' },
    { name: 'Updated At', value: 'updated_at' }
  ],
  default: 'created_at',
  description: 'Field to order results by',
},
{
  displayName: 'Direction',
  name: 'direction',
  type: 'options',
  displayOptions: { show: { resource: ['transfers'], operation: ['listTransfers'] } },
  options: [
    { name: 'ASC', value: 'asc' },
    { name: 'DESC', value: 'desc' }
  ],
  default: 'desc',
  description: 'Sort direction',
},
{
  displayName: 'User',
  name: 'user',
  type: 'string',
  displayOptions: { show: { resource: ['transfers'], operation: ['listTransfers'] } },
  default: '',
  description: 'Filter by user wallet address',
},
{
  displayName: 'Receiver',
  name: 'receiverFilter',
  type: 'string',
  displayOptions: { show: { resource: ['transfers'], operation: ['listTransfers'] } },
  default: '',
  description: 'Filter by receiver wallet address',
},
{
  displayName: 'Min Timestamp',
  name: 'minTimestamp',
  type: 'string',
  displayOptions: { show: { resource: ['transfers'], operation: ['listTransfers'] } },
  default: '',
  description: 'Minimum timestamp for filtering',
},
{
  displayName: 'Max Timestamp',
  name: 'maxTimestamp',
  type: 'string',
  displayOptions: { show: { resource: ['transfers'], operation: ['listTransfers'] } },
  default: '',
  description: 'Maximum timestamp for filtering',
},
{
  displayName: 'User Address',
  name: 'userAddress',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['users'],
      operation: ['getUser'],
    },
  },
  default: '',
  description: 'The user address to get profile information for',
},
{
  displayName: 'User Address',
  name: 'userAddress',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['users'],
      operation: ['getUserBalances'],
    },
  },
  default: '',
  description: 'The user address to get token balances for',
},
{
  displayName: 'User Address',
  name: 'userAddress',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['users'],
      operation: ['getUserOrders'],
    },
  },
  default: '',
  description: 'The user address to get orders for',
},
{
  displayName: 'User Address',
  name: 'userAddress',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['users'],
      operation: ['getUserTrades'],
    },
  },
  default: '',
  description: 'The user address to get trade history for',
},
{
  displayName: 'User Address',
  name: 'userAddress',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['users'],
      operation: ['getUserNFTs'],
    },
  },
  default: '',
  description: 'The user address to get NFTs for',
},
{
  displayName: 'ETH Signature',
  name: 'ethSignature',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['users'], operation: ['registerUser'] } },
  default: '',
  description: 'Ethereum signature for user registration',
},
{
  displayName: 'Stark Signature',
  name: 'starkSignature',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['users'], operation: ['registerUser'] } },
  default: '',
  description: 'Stark signature for user registration',
},
{
  displayName: 'User',
  name: 'user',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['users'], operation: ['getUserAssets'] } },
  default: '',
  description: 'User wallet address or ID',
},
{
  displayName: 'Project Name',
  name: 'name',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['projects'],
      operation: ['createProject'],
    },
  },
  default: '',
  description: 'The name of the gaming project',
},
{
  displayName: 'Company Name',
  name: 'company_name',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['projects'],
      operation: ['createProject'],
    },
  },
  default: '',
  description: 'The name of the company creating the project',
},
{
  displayName: 'Contact Email',
  name: 'contact_email',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['projects'],
      operation: ['createProject'],
    },
  },
  default: '',
  description: 'The contact email for the project',
},
{
  displayName: 'Project ID',
  name: 'project_id',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['projects'],
      operation: ['getProject'],
    },
  },
  default: '',
  description: 'The unique identifier of the project',
},
{
  displayName: 'Project ID',
  name: 'project_id',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['projects'],
      operation: ['updateProject'],
    },
  },
  default: '',
  description: 'The unique identifier of the project to update',
},
{
  displayName: 'Project ID',
  name: 'project_id',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['projects'],
      operation: ['getProjectCollections'],
    },
  },
  default: '',
  description: 'The unique identifier of the project',
},
{
  displayName: 'Withdrawal ID',
  name: 'withdrawalId',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['withdrawals'],
      operation: ['getWithdrawal', 'completeWithdrawal'],
    },
  },
  default: '',
  description: 'The withdrawal ID',
},
{
  displayName: 'Type',
  name: 'type',
  type: 'options',
  required: true,
  displayOptions: {
    show: {
      resource: ['withdrawals'],
      operation: ['createWithdrawal', 'getSignableWithdrawal'],
    },
  },
  options: [
    {
      name: 'ETH',
      value: 'ETH',
    },
    {
      name: 'ERC20',
      value: 'ERC20',
    },
    {
      name: 'ERC721',
      value: 'ERC721',
    },
  ],
  default: 'ETH',
  description: 'The type of asset to withdraw',
},
{
  displayName: 'Amount',
  name: 'amount',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['withdrawals'],
      operation: ['createWithdrawal', 'getSignableWithdrawal'],
    },
  },
  default: '',
  description: 'The amount to withdraw (in wei for ETH/ERC20)',
},
{
  displayName: 'Token Address',
  name: 'tokenAddress',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['withdrawals'],
      operation: ['createWithdrawal', 'getSignableWithdrawal'],
    },
  },
  default: '',
  description: 'The token contract address (required for ERC20/ERC721)',
},
{
  displayName: 'Stark Signature',
  name: 'starkSignature',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['withdrawals'],
      operation: ['createWithdrawal'],
    },
  },
  default: '',
  description: 'The Stark signature for the withdrawal',
},
{
  displayName: 'User',
  name: 'user',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['withdrawals'],
      operation: ['listWithdrawals'],
    },
  },
  default: '',
  description: 'Filter by user address',
},
{
  displayName: 'Min Timestamp',
  name: 'minTimestamp',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['withdrawals'],
      operation: ['listWithdrawals'],
    },
  },
  default: '',
  description: 'Minimum timestamp filter (ISO 8601)',
},
{
  displayName: 'Max Timestamp',
  name: 'maxTimestamp',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['withdrawals'],
      operation: ['listWithdrawals'],
    },
  },
  default: '',
  description: 'Maximum timestamp filter (ISO 8601)',
},
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const resource = this.getNodeParameter('resource', 0) as string;

    switch (resource) {
      case 'collections':
        return [await executeCollectionsOperations.call(this, items)];
      case 'assets':
        return [await executeAssetsOperations.call(this, items)];
      case 'orders':
        return [await executeOrdersOperations.call(this, items)];
      case 'trades':
        return [await executeTradesOperations.call(this, items)];
      case 'transfers':
        return [await executeTransfersOperations.call(this, items)];
      case 'users':
        return [await executeUsersOperations.call(this, items)];
      case 'projects':
        return [await executeProjectsOperations.call(this, items)];
      case 'withdrawals':
        return [await executeWithdrawalsOperations.call(this, items)];
      default:
        throw new NodeOperationError(this.getNode(), `The resource "${resource}" is not supported`);
    }
  }
}

// ============================================================
// Resource Handler Functions
// ============================================================

async function executeCollectionsOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('immutableApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'createCollection': {
          const name = this.getNodeParameter('name', i) as string;
          const description = this.getNodeParameter('description', i) as string;
          const collectionImageUrl = this.getNodeParameter('collection_image_url', i) as string;
          const projectId = this.getNodeParameter('project_id', i) as string;

          const body: any = {
            name,
            description,
            collection_image_url: collectionImageUrl,
            project_id: projectId,
          };

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/v1/collections`,
            headers: {
              'x-immutable-api-key': credentials.apiKey,
              'Content-Type': 'application/json',
            },
            body,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getCollection': {
          const collectionAddress = this.getNodeParameter('collection_address', i) as string;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/v1/collections/${collectionAddress}`,
            headers: {
              'x-immutable-api-key': credentials.apiKey,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'listCollections': {
          const pageSize = this.getNodeParameter('page_size', i, 50) as number;
          const cursor = this.getNodeParameter('cursor', i, '') as string;
          const keyword = this.getNodeParameter('keyword', i, '') as string;

          const queryParams: string[] = [];
          if (pageSize) queryParams.push(`page_size=${pageSize}`);
          if (cursor) queryParams.push(`cursor=${encodeURIComponent(cursor)}`);
          if (keyword) queryParams.push(`keyword=${encodeURIComponent(keyword)}`);

          const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/v1/collections${queryString}`,
            headers: {
              'x-immutable-api-key': credentials.apiKey,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'updateCollection': {
          const collectionAddress = this.getNodeParameter('collection_address', i) as string;
          const name = this.getNodeParameter('name', i, '') as string;
          const description = this.getNodeParameter('description', i, '') as string;
          const collectionImageUrl = this.getNodeParameter('collection_image_url', i, '') as string;

          const body: any = {};
          if (name) body.name = name;
          if (description) body.description = description;
          if (collectionImageUrl) body.collection_image_url = collectionImageUrl;

          const options: any = {
            method: 'PUT',
            url: `${credentials.baseUrl}/v1/collections/${collectionAddress}`,
            headers: {
              'x-immutable-api-key': credentials.apiKey,
              'Content-Type': 'application/json',
            },
            body,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getCollectionNFTs': {
          const collectionAddress = this.getNodeParameter('collection_address', i) as string;
          const pageSize = this.getNodeParameter('page_size', i, 50) as number;
          const cursor = this.getNodeParameter('cursor', i, '') as string;

          const queryParams: string[] = [];
          if (pageSize) queryParams.push(`page_size=${pageSize}`);
          if (cursor) queryParams.push(`cursor=${encodeURIComponent(cursor)}`);

          const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/v1/collections/${collectionAddress}/nfts${queryString}`,
            headers: {
              'x-immutable-api-key': credentials.apiKey,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({ json: result, pairedItem: { item: i } });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({
          json: { error: error.message },
          pairedItem: { item: i },
        });
      } else {
        if (error.response?.body) {
          throw new NodeApiError(this.getNode(), error.response.body, { message: error.message });
        }
        throw new NodeOperationError(this.getNode(), error.message);
      }
    }
  }

  return returnData;
}

async function executeAssetsOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('immutableApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;
      const environment = this.getNodeParameter('environment', i) as string;
      const baseUrl = environment === 'mainnet' ? 'https://api.immutable.com' : 'https://api.sandbox.immutable.com';

      switch (operation) {
        case 'mintAsset': {
          const collection_address = this.getNodeParameter('collection_address', i) as string;
          const to = this.getNodeParameter('to', i) as string;
          const token_id = this.getNodeParameter('token_id', i) as string;
          const blueprint = this.getNodeParameter('blueprint', i) as string;
          const metadata = this.getNodeParameter('metadata', i) as any;

          const body: any = {
            collection_address,
            to,
            token_id,
            metadata,
          };

          if (blueprint) {
            body.blueprint = blueprint;
          }

          const options: any = {
            method: 'POST',
            url: `${baseUrl}/v1/assets`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            body,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getAsset': {
          const token_address = this.getNodeParameter('token_address', i) as string;
          const token_id = this.getNodeParameter('token_id', i) as string;

          const options: any = {
            method: 'GET',
            url: `${baseUrl}/v1/assets/${token_address}/${token_id}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'listAssets': {
          const collection = this.getNodeParameter('collection', i) as string;
          const owner = this.getNodeParameter('owner', i) as string;
          const page_size = this.getNodeParameter('page_size', i) as number;
          const cursor = this.getNodeParameter('cursor', i) as string;
          const status = this.getNodeParameter('status', i) as string;

          const queryParams: any = {};
          if (collection) queryParams.collection = collection;
          if (owner) queryParams.owner = owner;
          if (page_size) queryParams.page_size = page_size;
          if (cursor) queryParams.cursor = cursor;
          if (status) queryParams.status = status;

          const queryString = Object.keys(queryParams).length > 0 
            ? '?' + new URLSearchParams(queryParams).toString() 
            : '';

          const options: any = {
            method: 'GET',
            url: `${baseUrl}/v1/assets${queryString}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'updateAsset': {
          const token_address = this.getNodeParameter('token_address', i) as string;
          const token_id = this.getNodeParameter('token_id', i) as string;
          const metadata = this.getNodeParameter('metadata', i) as any;

          const options: any = {
            method: 'PUT',
            url: `${baseUrl}/v1/assets/${token_address}/${token_id}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            body: {
              metadata,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'transferAsset': {
          const token_address = this.getNodeParameter('token_address', i) as string;
          const token_id = this.getNodeParameter('token_id', i) as string;
          const receiver = this.getNodeParameter('receiver', i) as string;

          const options: any = {
            method: 'POST',
            url: `${baseUrl}/v1/assets/${token_address}/${token_id}/transfer`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            body: {
              receiver,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({ json: result, pairedItem: { item: i } });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({ 
          json: { error: error.message }, 
          pairedItem: { item: i } 
        });
      } else {
        if (error.httpCode) {
          throw new NodeApiError(this.getNode(), error);
        } else {
          throw new NodeOperationError(this.getNode(), error.message);
        }
      }
    }
  }

  return returnData;
}

async function executeOrdersOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('immutableApi') as any;
  
  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;
      const environment = this.getNodeParameter('environment', i) as string;
      const baseUrl = environment === 'mainnet' 
        ? 'https://api.immutable.com' 
        : 'https://api.sandbox.immutable.com';

      switch (operation) {
        case 'createOrder': {
          const type = this.getNodeParameter('type', i) as string;
          const data = this.getNodeParameter('data', i) as any;
          const fees = this.getNodeParameter('fees', i) as any;
          const timestamp = this.getNodeParameter('timestamp', i) as number;

          const requestBody: any = {
            type,
            data: typeof data === 'string' ? JSON.parse(data) : data,
          };

          if (fees) {
            requestBody.fees = typeof fees === 'string' ? JSON.parse(fees) : fees;
          }

          if (timestamp) {
            requestBody.timestamp = timestamp;
          }

          const options: any = {
            method: 'POST',
            url: `${baseUrl}/v1/orders`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            body: requestBody,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getOrder': {
          const orderId = this.getNodeParameter('orderId', i) as string;

          const options: any = {
            method: 'GET',
            url: `${baseUrl}/v1/orders/${orderId}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'listOrders': {
          const status = this.getNodeParameter('status', i) as string;
          const user = this.getNodeParameter('user', i) as string;
          const sellTokenAddress = this.getNodeParameter('sellTokenAddress', i) as string;
          const buyTokenAddress = this.getNodeParameter('buyTokenAddress', i) as string;
          const pageSize = this.getNodeParameter('pageSize', i) as number;
          const cursor = this.getNodeParameter('cursor', i) as string;

          const queryParams: any = {};
          
          if (status) queryParams.status = status;
          if (user) queryParams.user = user;
          if (sellTokenAddress) queryParams.sell_token_address = sellTokenAddress;
          if (buyTokenAddress) queryParams.buy_token_address = buyTokenAddress;
          if (pageSize) queryParams.page_size = pageSize;
          if (cursor) queryParams.cursor = cursor;

          const queryString = new URLSearchParams(queryParams).toString();
          const url = `${baseUrl}/v1/orders${queryString ? '?' + queryString : ''}`;

          const options: any = {
            method: 'GET',
            url,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'updateOrder': {
          const orderId = this.getNodeParameter('orderId', i) as string;
          const status = this.getNodeParameter('status', i) as string;

          const options: any = {
            method: 'PUT',
            url: `${baseUrl}/v1/orders/${orderId}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            body: {
              status,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'cancelOrder': {
          const orderId = this.getNodeParameter('orderId', i) as string;

          const options: any = {
            method: 'DELETE',
            url: `${baseUrl}/v1/orders/${orderId}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`, {
            itemIndex: i,
          });
      }

      returnData.push({
        json: result,
        pairedItem: { item: i },
      });

    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({
          json: { error: error.message },
          pairedItem: { item: i },
        });
      } else {
        if (error.response && error.response.body) {
          throw new NodeApiError(this.getNode(), error.response.body, {
            itemIndex: i,
          });
        }
        throw new NodeOperationError(this.getNode(), error.message, {
          itemIndex: i,
        });
      }
    }
  }

  return returnData;
}

async function executeTradesOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('immutableApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'createTrade': {
          const orderId = this.getNodeParameter('orderId', i) as string;
          const fees = this.getNodeParameter('fees', i) as number;
          const timestamp = this.getNodeParameter('timestamp', i) as string;

          const body: any = {
            order_id: orderId,
          };

          if (fees) body.fees = fees;
          if (timestamp) body.timestamp = timestamp;

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/v1/trades`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            body,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getTrade': {
          const tradeId = this.getNodeParameter('tradeId', i) as string;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/v1/trades/${tradeId}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'listTrades': {
          const partyATokenAddress = this.getNodeParameter('partyATokenAddress', i) as string;
          const partyBTokenAddress = this.getNodeParameter('partyBTokenAddress', i) as string;
          const pageSize = this.getNodeParameter('pageSize', i) as number;
          const cursor = this.getNodeParameter('cursor', i) as string;
          const minTimestamp = this.getNodeParameter('minTimestamp', i) as string;
          const maxTimestamp = this.getNodeParameter('maxTimestamp', i) as string;

          const queryParams: any = {};
          if (partyATokenAddress) queryParams.party_a_token_address = partyATokenAddress;
          if (partyBTokenAddress) queryParams.party_b_token_address = partyBTokenAddress;
          if (pageSize) query