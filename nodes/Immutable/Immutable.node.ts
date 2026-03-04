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
      // Resource selector
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'Assets',
            value: 'assets',
          },
          {
            name: 'Collections',
            value: 'collections',
          },
          {
            name: 'Minting',
            value: 'minting',
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
            name: 'Users',
            value: 'users',
          },
          {
            name: 'Projects',
            value: 'projects',
          }
        ],
        default: 'assets',
      },
      // Operation dropdowns per resource
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
      name: 'List Assets',
      value: 'listAssets',
      description: 'Get a list of assets',
      action: 'List assets',
    },
    {
      name: 'Get Asset',
      value: 'getAsset',
      description: 'Get details of a specific asset',
      action: 'Get asset',
    },
    {
      name: 'Create Asset',
      value: 'createAsset',
      description: 'Create a new asset/NFT',
      action: 'Create asset',
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
      description: 'Transfer asset to another user',
      action: 'Transfer asset',
    },
  ],
  default: 'listAssets',
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
      name: 'List Collections',
      value: 'listCollections',
      description: 'Get all collections',
      action: 'List collections',
    },
    {
      name: 'Get Collection',
      value: 'getCollection',
      description: 'Get collection details by address',
      action: 'Get collection',
    },
    {
      name: 'Create Collection',
      value: 'createCollection',
      description: 'Deploy a new NFT collection',
      action: 'Create collection',
    },
    {
      name: 'Update Collection',
      value: 'updateCollection',
      description: 'Update collection settings',
      action: 'Update collection',
    },
    {
      name: 'Delete Collection',
      value: 'deleteCollection',
      description: 'Remove collection',
      action: 'Delete collection',
    },
  ],
  default: 'listCollections',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['minting'],
    },
  },
  options: [
    {
      name: 'Mint NFT',
      value: 'mintNFT',
      description: 'Mint NFTs with zero gas fees',
      action: 'Mint NFT',
    },
    {
      name: 'Get Mint',
      value: 'getMint',
      description: 'Get minting operation status',
      action: 'Get mint operation status',
    },
    {
      name: 'Batch Mint',
      value: 'batchMint',
      description: 'Mint multiple NFTs in a single operation',
      action: 'Batch mint NFTs',
    },
    {
      name: 'List Mints',
      value: 'listMints',
      description: 'Get minting history',
      action: 'List minting history',
    },
  ],
  default: 'mintNFT',
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
      name: 'List Orders',
      value: 'listOrders',
      description: 'Get marketplace orders with optional filtering',
      action: 'List orders',
    },
    {
      name: 'Get Order',
      value: 'getOrder',
      description: 'Get specific order details by ID',
      action: 'Get order details',
    },
    {
      name: 'Create Order',
      value: 'createOrder',
      description: 'Create a new buy or sell order',
      action: 'Create order',
    },
    {
      name: 'Update Order',
      value: 'updateOrder',
      description: 'Update an existing order',
      action: 'Update order',
    },
    {
      name: 'Cancel Order',
      value: 'cancelOrder',
      description: 'Cancel an existing order',
      action: 'Cancel order',
    },
  ],
  default: 'listOrders',
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
      name: 'List Trades',
      value: 'listTrades',
      description: 'Get trade history',
      action: 'List trades',
    },
    {
      name: 'Get Trade',
      value: 'getTrade',
      description: 'Get specific trade details',
      action: 'Get trade',
    },
    {
      name: 'Execute Trade',
      value: 'executeTrade',
      description: 'Execute a trade against an existing order',
      action: 'Execute trade',
    },
    {
      name: 'Get Trades Summary',
      value: 'getTradesSummary',
      description: 'Get trading statistics',
      action: 'Get trades summary',
    },
  ],
  default: 'listTrades',
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
      name: 'Get User',
      value: 'getUser',
      description: 'Get user profile and statistics',
      action: 'Get user profile and statistics',
    },
    {
      name: 'Get User Balances',
      value: 'getUserBalances',
      description: 'Get user token balances',
      action: 'Get user token balances',
    },
    {
      name: 'Update User',
      value: 'updateUser',
      description: 'Update user profile',
      action: 'Update user profile',
    },
    {
      name: 'Get User Orders',
      value: 'getUserOrders',
      description: 'Get user\'s orders',
      action: 'Get user\'s orders',
    },
    {
      name: 'Get User Trades',
      value: 'getUserTrades',
      description: 'Get user\'s trade history',
      action: 'Get user\'s trade history',
    },
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
      name: 'List Projects',
      value: 'listProjects',
      description: 'Get all projects',
      action: 'List projects',
    },
    {
      name: 'Get Project',
      value: 'getProject',
      description: 'Get project details',
      action: 'Get project details',
    },
    {
      name: 'Create Project',
      value: 'createProject',
      description: 'Register a new gaming project',
      action: 'Create project',
    },
    {
      name: 'Update Project',
      value: 'updateProject',
      description: 'Update project information',
      action: 'Update project',
    },
    {
      name: 'Delete Project',
      value: 'deleteProject',
      description: 'Remove project',
      action: 'Delete project',
    },
  ],
  default: 'listProjects',
},
      // Parameter definitions
{
  displayName: 'Collection',
  name: 'collection',
  type: 'string',
  required: false,
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
  required: false,
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
  displayName: 'Status',
  name: 'status',
  type: 'options',
  required: false,
  displayOptions: {
    show: {
      resource: ['assets'],
      operation: ['listAssets'],
    },
  },
  options: [
    {
      name: 'All',
      value: '',
    },
    {
      name: 'Imx',
      value: 'imx',
    },
    {
      name: 'Eth',
      value: 'eth',
    },
  ],
  default: '',
  description: 'Filter by asset status',
},
{
  displayName: 'Metadata',
  name: 'metadata',
  type: 'json',
  required: false,
  displayOptions: {
    show: {
      resource: ['assets'],
      operation: ['listAssets'],
    },
  },
  default: '',
  description: 'Filter by metadata properties',
},
{
  displayName: 'Token Address',
  name: 'tokenAddress',
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
  displayName: 'Token ID',
  name: 'tokenId',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['assets'],
      operation: ['getAsset', 'updateAsset', 'transferAsset'],
    },
  },
  default: '',
  description: 'The token ID',
},
{
  displayName: 'Token Address',
  name: 'tokenAddress',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['assets'],
      operation: ['createAsset'],
    },
  },
  default: '',
  description: 'The token contract address for the new asset',
},
{
  displayName: 'Token ID',
  name: 'tokenId',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['assets'],
      operation: ['createAsset'],
    },
  },
  default: '',
  description: 'The token ID for the new asset',
},
{
  displayName: 'Metadata URI',
  name: 'metadataUri',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['assets'],
      operation: ['createAsset', 'updateAsset'],
    },
  },
  default: '',
  description: 'The URI pointing to the asset metadata',
},
{
  displayName: 'Royalty Percentage',
  name: 'royaltyPercentage',
  type: 'number',
  required: false,
  displayOptions: {
    show: {
      resource: ['assets'],
      operation: ['createAsset'],
    },
  },
  default: 0,
  description: 'The royalty percentage for the asset (0-100)',
},
{
  displayName: 'Receiver',
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
  displayName: 'Keyword',
  name: 'keyword',
  type: 'string',
  required: false,
  displayOptions: {
    show: {
      resource: ['collections'],
      operation: ['listCollections'],
    },
  },
  default: '',
  description: 'Filter collections by keyword',
},
{
  displayName: 'Order By',
  name: 'orderBy',
  type: 'options',
  required: false,
  displayOptions: {
    show: {
      resource: ['collections'],
      operation: ['listCollections'],
    },
  },
  options: [
    {
      name: 'Name',
      value: 'name',
    },
    {
      name: 'Created At',
      value: 'created_at',
    },
    {
      name: 'Updated At',
      value: 'updated_at',
    },
  ],
  default: 'name',
  description: 'Order collections by field',
},
{
  displayName: 'Page Size',
  name: 'pageSize',
  type: 'number',
  required: false,
  displayOptions: {
    show: {
      resource: ['collections'],
      operation: ['listCollections'],
    },
  },
  default: 50,
  typeOptions: {
    minValue: 1,
    maxValue: 200,
  },
  description: 'Number of collections per page',
},
{
  displayName: 'Address',
  name: 'address',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['collections'],
      operation: ['getCollection', 'updateCollection', 'deleteCollection'],
    },
  },
  default: '',
  description: 'The collection contract address',
},
{
  displayName: 'Name',
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
  description: 'The collection name',
},
{
  displayName: 'Symbol',
  name: 'symbol',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['collections'],
      operation: ['createCollection'],
    },
  },
  default: '',
  description: 'The collection symbol (ticker)',
},
{
  displayName: 'Metadata API URL',
  name: 'metadataApiUrl',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['collections'],
      operation: ['createCollection', 'updateCollection'],
    },
  },
  default: '',
  description: 'URL for metadata API endpoint',
},
{
  displayName: 'Royalty Recipient',
  name: 'royaltyRecipient',
  type: 'string',
  required: false,
  displayOptions: {
    show: {
      resource: ['collections'],
      operation: ['createCollection'],
    },
  },
  default: '',
  description: 'Address to receive royalty payments',
},
{
  displayName: 'Royalty Percentage',
  name: 'royaltyPercentage',
  type: 'number',
  required: false,
  displayOptions: {
    show: {
      resource: ['collections'],
      operation: ['updateCollection'],
    },
  },
  default: 0,
  typeOptions: {
    minValue: 0,
    maxValue: 100,
  },
  description: 'Royalty percentage (0-100)',
},
{
  displayName: 'Chain',
  name: 'chain',
  type: 'options',
  required: false,
  displayOptions: {
    show: {
      resource: ['collections'],
      operation: ['listCollections', 'getCollection', 'createCollection', 'updateCollection', 'deleteCollection'],
    },
  },
  options: [
    {
      name: 'Immutable X',
      value: 'imx',
    },
    {
      name: 'Immutable zkEVM',
      value: 'zkevm',
    },
  ],
  default: 'imx',
  description: 'Blockchain to operate on',
},
{
  displayName: 'Collection Address',
  name: 'collectionAddress',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['minting'],
      operation: ['mintNFT'],
    },
  },
  default: '',
  description: 'The contract address of the NFT collection',
},
{
  displayName: 'To Address',
  name: 'toAddress',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['minting'],
      operation: ['mintNFT'],
    },
  },
  default: '',
  description: 'The recipient wallet address',
},
{
  displayName: 'Token IDs',
  name: 'tokenIds',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['minting'],
      operation: ['mintNFT'],
    },
  },
  default: '',
  description: 'Comma-separated list of token IDs to mint',
},
{
  displayName: 'Metadata',
  name: 'metadata',
  type: 'json',
  required: false,
  displayOptions: {
    show: {
      resource: ['minting'],
      operation: ['mintNFT'],
    },
  },
  default: '{}',
  description: 'NFT metadata as JSON object',
},
{
  displayName: 'Mint ID',
  name: 'mintId',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['minting'],
      operation: ['getMint'],
    },
  },
  default: '',
  description: 'The ID of the minting operation',
},
{
  displayName: 'Collection Address',
  name: 'collectionAddress',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['minting'],
      operation: ['batchMint'],
    },
  },
  default: '',
  description: 'The contract address of the NFT collection',
},
{
  displayName: 'Recipients',
  name: 'recipients',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['minting'],
      operation: ['batchMint'],
    },
  },
  default: '',
  description: 'Comma-separated list of recipient wallet addresses',
},
{
  displayName: 'Metadata List',
  name: 'metadataList',
  type: 'json',
  required: false,
  displayOptions: {
    show: {
      resource: ['minting'],
      operation: ['batchMint'],
    },
  },
  default: '[]',
  description: 'Array of metadata objects for each NFT',
},
{
  displayName: 'Collection Address',
  name: 'collectionAddress',
  type: 'string',
  required: false,
  displayOptions: {
    show: {
      resource: ['minting'],
      operation: ['listMints'],
    },
  },
  default: '',
  description: 'Filter by collection address',
},
{
  displayName: 'User',
  name: 'user',
  type: 'string',
  required: false,
  displayOptions: {
    show: {
      resource: ['minting'],
      operation: ['listMints'],
    },
  },
  default: '',
  description: 'Filter by user wallet address',
},
{
  displayName: 'Status',
  name: 'status',
  type: 'options',
  required: false,
  displayOptions: {
    show: {
      resource: ['minting'],
      operation: ['listMints'],
    },
  },
  options: [
    {
      name: 'All',
      value: '',
    },
    {
      name: 'Pending',
      value: 'pending',
    },
    {
      name: 'Success',
      value: 'success',
    },
    {
      name: 'Failed',
      value: 'failed',
    },
  ],
  default: '',
  description: 'Filter by minting status',
},
{
  displayName: 'Page',
  name: 'page',
  type: 'number',
  required: false,
  displayOptions: {
    show: {
      resource: ['minting'],
      operation: ['listMints'],
    },
  },
  default: 1,
  description: 'Page number for pagination',
},
{
  displayName: 'Status',
  name: 'status',
  type: 'options',
  displayOptions: {
    show: {
      resource: ['orders'],
      operation: ['listOrders'],
    },
  },
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
  ],
  default: '',
  description: 'Filter orders by status',
},
{
  displayName: 'User',
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
  displayName: 'Sell Token Address',
  name: 'sellTokenAddress',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['orders'],
      operation: ['listOrders', 'createOrder'],
    },
  },
  default: '',
  description: 'Filter orders by sell token contract address or specify sell token for new order',
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
  description: 'The unique identifier of the order',
},
{
  displayName: 'Buy Token Type',
  name: 'buyTokenType',
  type: 'options',
  required: true,
  displayOptions: {
    show: {
      resource: ['orders'],
      operation: ['createOrder'],
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
    {
      name: 'ERC1155',
      value: 'ERC1155',
    },
  ],
  default: 'ETH',
  description: 'The type of token being purchased',
},
{
  displayName: 'Buy Token Address',
  name: 'buyTokenAddress',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['orders'],
      operation: ['createOrder'],
    },
  },
  default: '',
  description: 'The contract address of the token being purchased',
},
{
  displayName: 'Amount',
  name: 'amount',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['orders'],
      operation: ['createOrder', 'updateOrder'],
    },
  },
  default: '',
  description: 'The amount or price for the order',
},
{
  displayName: 'Expiration Timestamp',
  name: 'expirationTimestamp',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['orders'],
      operation: ['updateOrder'],
    },
  },
  default: 0,
  description: 'Unix timestamp when the order expires',
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
  description: 'Token address for party A in the trade',
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
  description: 'Token address for party B in the trade',
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
  description: 'Minimum timestamp to filter trades (Unix timestamp)',
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
  displayName: 'Order ID',
  name: 'orderId',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['trades'],
      operation: ['executeTrade'],
    },
  },
  default: '',
  description: 'The ID of the order to trade against',
},
{
  displayName: 'Fees',
  name: 'fees',
  type: 'fixedCollection',
  typeOptions: {
    multipleValues: true,
  },
  displayOptions: {
    show: {
      resource: ['trades'],
      operation: ['executeTrade'],
    },
  },
  default: {},
  placeholder: 'Add Fee',
  options: [
    {
      name: 'fee',
      displayName: 'Fee',
      values: [
        {
          displayName: 'Address',
          name: 'address',
          type: 'string',
          default: '',
          description: 'Fee recipient address',
        },
        {
          displayName: 'Percentage',
          name: 'percentage',
          type: 'number',
          default: 0,
          description: 'Fee percentage',
        },
      ],
    },
  ],
  description: 'Trading fees to apply',
},
{
  displayName: 'Collection Address',
  name: 'collectionAddress',
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
      name: '24h',
      value: '24h',
    },
    {
      name: '7d',
      value: '7d',
    },
    {
      name: '30d',
      value: '30d',
    },
    {
      name: 'All',
      value: 'all',
    },
  ],
  default: '24h',
  description: 'Time period for trading statistics',
},
{
  displayName: 'Address',
  name: 'address',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['users'],
      operation: ['getUser'],
    },
  },
  default: '',
  description: 'The user address to retrieve profile and statistics for',
},
{
  displayName: 'Address',
  name: 'address',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['users'],
      operation: ['getUserBalances'],
    },
  },
  default: '',
  description: 'The user address to retrieve balances for',
},
{
  displayName: 'Address',
  name: 'address',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['users'],
      operation: ['updateUser'],
    },
  },
  default: '',
  description: 'The user address to update',
},
{
  displayName: 'Nickname',
  name: 'nickname',
  type: 'string',
  required: false,
  displayOptions: {
    show: {
      resource: ['users'],
      operation: ['updateUser'],
    },
  },
  default: '',
  description: 'The new nickname for the user',
},
{
  displayName: 'Email',
  name: 'email',
  type: 'string',
  required: false,
  displayOptions: {
    show: {
      resource: ['users'],
      operation: ['updateUser'],
    },
  },
  default: '',
  description: 'The new email for the user',
},
{
  displayName: 'Address',
  name: 'address',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['users'],
      operation: ['getUserOrders'],
    },
  },
  default: '',
  description: 'The user address to retrieve orders for',
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
  ],
  required: false,
  displayOptions: {
    show: {
      resource: ['users'],
      operation: ['getUserOrders'],
    },
  },
  default: 'active',
  description: 'Filter orders by status',
},
{
  displayName: 'Address',
  name: 'address',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['users'],
      operation: ['getUserTrades'],
    },
  },
  default: '',
  description: 'The user address to retrieve trades for',
},
{
  displayName: 'Page Size',
  name: 'pageSize',
  type: 'number',
  required: false,
  displayOptions: {
    show: {
      resource: ['users'],
      operation: ['getUserTrades'],
    },
  },
  default: 50,
  description: 'Number of trades to return per page',
  typeOptions: {
    minValue: 1,
    maxValue: 200,
  },
},
{
  displayName: 'Status',
  name: 'status',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['projects'],
      operation: ['listProjects'],
    },
  },
  default: '',
  description: 'Filter projects by status',
},
{
  displayName: 'Category',
  name: 'category',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['projects'],
      operation: ['listProjects'],
    },
  },
  default: '',
  description: 'Filter projects by category',
},
{
  displayName: 'Project ID',
  name: 'projectId',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['projects'],
      operation: ['getProject'],
    },
  },
  default: '',
  description: 'The project ID to retrieve',
},
{
  displayName: 'Name',
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
  description: 'The project name',
},
{
  displayName: 'Description',
  name: 'description',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['projects'],
      operation: ['createProject', 'updateProject'],
    },
  },
  default: '',
  description: 'The project description',
},
{
  displayName: 'Website URL',
  name: 'websiteUrl',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['projects'],
      operation: ['createProject', 'updateProject'],
    },
  },
  default: '',
  description: 'The project website URL',
},
{
  displayName: 'Contact Email',
  name: 'contactEmail',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['projects'],
      operation: ['createProject'],
    },
  },
  default: '',
  description: 'Contact email for the project',
},
{
  displayName: 'Project ID',
  name: 'projectId',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['projects'],
      operation: ['updateProject'],
    },
  },
  default: '',
  description: 'The project ID to update',
},
{
  displayName: 'Logo URL',
  name: 'logoUrl',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['projects'],
      operation: ['updateProject'],
    },
  },
  default: '',
  description: 'The project logo URL',
},
{
  displayName: 'Project ID',
  name: 'projectId',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['projects'],
      operation: ['deleteProject'],
    },
  },
  default: '',
  description: 'The project ID to delete',
},
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const resource = this.getNodeParameter('resource', 0) as string;

    switch (resource) {
      case 'assets':
        return [await executeAssetsOperations.call(this, items)];
      case 'collections':
        return [await executeCollectionsOperations.call(this, items)];
      case 'minting':
        return [await executeMintingOperations.call(this, items)];
      case 'orders':
        return [await executeOrdersOperations.call(this, items)];
      case 'trades':
        return [await executeTradesOperations.call(this, items)];
      case 'users':
        return [await executeUsersOperations.call(this, items)];
      case 'projects':
        return [await executeProjectsOperations.call(this, items)];
      default:
        throw new NodeOperationError(this.getNode(), `The resource "${resource}" is not supported`);
    }
  }
}

// ============================================================
// Resource Handler Functions
// ============================================================

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

      switch (operation) {
        case 'listAssets': {
          const collection = this.getNodeParameter('collection', i) as string;
          const owner = this.getNodeParameter('owner', i) as string;
          const status = this.getNodeParameter('status', i) as string;
          const metadata = this.getNodeParameter('metadata', i) as string;

          const params = new URLSearchParams();
          if (collection) params.append('collection', collection);
          if (owner) params.append('owner', owner);
          if (status) params.append('status', status);
          if (metadata) params.append('metadata', metadata);

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/v1/assets${params.toString() ? '?' + params.toString() : ''}`,
            headers: {
              'x-api-key': credentials.apiKey,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getAsset': {
          const tokenAddress = this.getNodeParameter('tokenAddress', i) as string;
          const tokenId = this.getNodeParameter('tokenId', i) as string;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/v1/assets/${tokenAddress}/${tokenId}`,
            headers: {
              'x-api-key': credentials.apiKey,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'createAsset': {
          const tokenAddress = this.getNodeParameter('tokenAddress', i) as string;
          const tokenId = this.getNodeParameter('tokenId', i) as string;
          const metadataUri = this.getNodeParameter('metadataUri', i) as string;
          const royaltyPercentage = this.getNodeParameter('royaltyPercentage', i) as number;

          const body: any = {
            token_address: tokenAddress,
            token_id: tokenId,
            metadata_uri: metadataUri,
          };

          if (royaltyPercentage > 0) {
            body.royalty_percentage = royaltyPercentage;
          }

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/v1/assets`,
            headers: {
              'x-api-key': credentials.apiKey,
              'Content-Type': 'application/json',
            },
            body,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'updateAsset': {
          const tokenAddress = this.getNodeParameter('tokenAddress', i) as string;
          const tokenId = this.getNodeParameter('tokenId', i) as string;
          const metadataUri = this.getNodeParameter('metadataUri', i) as string;

          const options: any = {
            method: 'PUT',
            url: `${credentials.baseUrl}/v1/assets/${tokenAddress}/${tokenId}`,
            headers: {
              'x-api-key': credentials.apiKey,
              'Content-Type': 'application/json',
            },
            body: {
              metadata_uri: metadataUri,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'transferAsset': {
          const tokenAddress = this.getNodeParameter('tokenAddress', i) as string;
          const tokenId = this.getNodeParameter('tokenId', i) as string;
          const receiver = this.getNodeParameter('receiver', i) as string;

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/v1/transfers`,
            headers: {
              'x-api-key': credentials.apiKey,
              'Content-Type': 'application/json',
            },
            body: {
              token_address: tokenAddress,
              token_id: tokenId,
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
        returnData.push({ json: { error: error.message }, pairedItem: { item: i } });
      } else {
        throw new NodeApiError(this.getNode(), error);
      }
    }
  }

  return returnData;
}

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
        case 'listCollections': {
          const keyword = this.getNodeParameter('keyword', i, '') as string;
          const orderBy = this.getNodeParameter('orderBy', i, 'name') as string;
          const pageSize = this.getNodeParameter('pageSize', i, 50) as number;
          const chain = this.getNodeParameter('chain', i, 'imx') as string;

          const queryParams: any = {
            order_by: orderBy,
            page_size: pageSize,
          };

          if (keyword) {
            queryParams.keyword = keyword;
          }

          const queryString = new URLSearchParams(queryParams).toString();
          const endpoint = chain === 'zkevm' ? '/v2/collections' : '/v1/collections';

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}${endpoint}?${queryString}`,
            headers: {
              'x-api-key': credentials.apiKey,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getCollection': {
          const address = this.getNodeParameter('address', i) as string;
          const chain = this.getNodeParameter('chain', i, 'imx') as string;
          const endpoint = chain === 'zkevm' ? '/v2/collections' : '/v1/collections';

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}${endpoint}/${address}`,
            headers: {
              'x-api-key': credentials.apiKey,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'createCollection': {
          const name = this.getNodeParameter('name', i) as string;
          const symbol = this.getNodeParameter('symbol', i) as string;
          const metadataApiUrl = this.getNodeParameter('metadataApiUrl', i) as string;
          const royaltyRecipient = this.getNodeParameter('royaltyRecipient', i, '') as string;
          const chain = this.getNodeParameter('chain', i, 'imx') as string;

          const body: any = {
            name,
            symbol,
            metadata_api_url: metadataApiUrl,
          };

          if (royaltyRecipient) {
            body.royalty_recipient = royaltyRecipient;
          }

          const endpoint = chain === 'zkevm' ? '/v2/collections' : '/v1/collections';

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}${endpoint}`,
            headers: {
              'x-api-key': credentials.apiKey,
              'Content-Type': 'application/json',
            },
            body,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'updateCollection': {
          const address = this.getNodeParameter('address', i) as string;
          const metadataApiUrl = this.getNodeParameter('metadataApiUrl', i) as string;
          const royaltyPercentage = this.getNodeParameter('royaltyPercentage', i, 0) as number;
          const chain = this.getNodeParameter('chain', i, 'imx') as string;

          const body: any = {
            metadata_api_url: metadataApiUrl,
          };

          if (royaltyPercentage > 0) {
            body.royalty_percentage = royaltyPercentage;
          }

          const endpoint = chain === 'zkevm' ? '/v2/collections' : '/v1/collections';

          const options: any = {
            method: 'PUT',
            url: `${credentials.baseUrl}${endpoint}/${address}`,
            headers: {
              'x-api-key': credentials.apiKey,
              'Content-Type': 'application/json',
            },
            body,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'deleteCollection': {
          const address = this.getNodeParameter('address', i) as string;
          const chain = this.getNodeParameter('chain', i, 'imx') as string;
          const endpoint = chain === 'zkevm' ? '/v2/collections' : '/v1/collections';

          const options: any = {
            method: 'DELETE',
            url: `${credentials.baseUrl}${endpoint}/${address}`,
            headers: {
              'x-api-key': credentials.apiKey,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(
            this.getNode(),
            `Unknown operation: ${operation}`,
            { itemIndex: i },
          );
      }

      returnData.push({ json: result, pairedItem: { item: i } });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({
          json: { error: error.message },
          pairedItem: { item: i },
        });
      } else {
        if (error.httpCode) {
          throw new NodeApiError(this.getNode(), error, { itemIndex: i });
        }
        throw new NodeOperationError(this.getNode(), error.message, {
          itemIndex: i,
        });
      }
    }
  }

  return returnData;
}

async function executeMintingOperations(
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
        case 'mintNFT': {
          const collectionAddress = this.getNodeParameter('collectionAddress', i) as string;
          const toAddress = this.getNodeParameter('toAddress', i) as string;
          const tokenIds = this.getNodeParameter('tokenIds', i) as string;
          const metadata = this.getNodeParameter('metadata', i) as any;

          const body: any = {
            collection_address: collectionAddress,
            to_address: toAddress,
            token_ids: tokenIds.split(',').map((id: string) => id.trim()),
            metadata: metadata,
          };

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/v1/mints`,
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

        case 'getMint': {
          const mintId = this.getNodeParameter('mintId', i) as string;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/v1/mints/${mintId}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'batchMint': {
          const collectionAddress = this.getNodeParameter('collectionAddress', i) as string;
          const recipients = this.getNodeParameter('recipients', i) as string;
          const metadataList = this.getNodeParameter('metadataList', i) as any[];

          const recipientList = recipients.split(',').map((addr: string) => addr.trim());

          const body: any = {
            collection_address: collectionAddress,
            recipients: recipientList,
            metadata_list: metadataList,
          };

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/v1/mints/batch`,
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

        case 'listMints': {
          const collectionAddress = this.getNodeParameter('collectionAddress', i) as string;
          const user = this.getNodeParameter('user', i) as string;
          const status = this.getNodeParameter('status', i) as string;
          const page = this.getNodeParameter('page', i) as number;

          const queryParams: string[] = [];
          if (collectionAddress) queryParams.push(`collection_address=${encodeURIComponent(collectionAddress)}`);
          if (user) queryParams.push(`user=${encodeURIComponent(user)}`);
          if (status) queryParams.push(`status=${encodeURIComponent(status)}`);
          if (page) queryParams.push(`page=${page}`);

          const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/v1/mints${queryString}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
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
        if (error.response && error.response.body) {
          throw new NodeApiError(this.getNode(), error.response.body);
        }
        throw new NodeOperationError(this.getNode(), error.message);
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
      
      switch (operation) {
        case 'listOrders': {
          const queryParams: any = {};
          
          const status = this.getNodeParameter('status', i) as string;
          if (status) queryParams.status = status;
          
          const user = this.getNodeParameter('user', i) as string;
          if (user) queryParams.user = user;
          
          const buyTokenAddress = this.getNodeParameter('buyTokenAddress', i) as string;
          if (buyTokenAddress) queryParams.buy_token_address = buyTokenAddress;
          
          const sellTokenAddress = this.getNodeParameter('sellTokenAddress', i) as string;
          if (sellTokenAddress) queryParams.sell_token_address = sellTokenAddress;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/v1/orders`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            qs: queryParams,
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getOrder': {
          const orderId = this.getNodeParameter('orderId', i) as string;
          
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/v1/orders/${orderId}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'createOrder': {
          const buyTokenType = this.getNodeParameter('buyTokenType', i) as string;
          const buyTokenAddress = this.getNodeParameter('buyTokenAddress', i) as string;
          const sellTokenAddress = this.getNodeParameter('sellTokenAddress', i) as string;
          const amount = this.getNodeParameter('amount', i) as string;

          const body: any = {
            buy_token_type: buyTokenType,
            buy_token_address: buyTokenAddress,
            sell_token_address: sellTokenAddress,
            amount: amount,
          };

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/v1/orders`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            body: body,
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'updateOrder': {
          const orderId = this.getNodeParameter('orderId', i) as string;
          const amount = this.getNodeParameter('amount', i) as string;
          const expirationTimestamp = this.getNodeParameter('expirationTimestamp', i) as number;

          const body: any = {
            amount: amount,
          };

          if (expirationTimestamp > 0) {
            body.expiration_timestamp = expirationTimestamp;
          }

          const options: any = {
            method: 'PUT',
            url: `${credentials.baseUrl}/v1/orders/${orderId}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            body: body,
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'cancelOrder': {
          const orderId = this.getNodeParameter('orderId', i) as string;
          
          const options: any = {
            method: 'DELETE',
            url: `${credentials.baseUrl}/v1/orders/${orderId}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
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
        throw new NodeApiError(this.getNode(), error);
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
        case 'listTrades': {
          const partyATokenAddress = this.getNodeParameter('partyATokenAddress', i) as string;
          const partyBTokenAddress = this.getNodeParameter('partyBTokenAddress', i) as string;
          const minTimestamp = this.getNodeParameter('minTimestamp', i) as string;

          const params: any = {};
          if (partyATokenAddress) params.party_a_token_address = partyATokenAddress;
          if (partyBTokenAddress) params.party_b_token_address = partyBTokenAddress;
          if (minTimestamp) params.min_timestamp = minTimestamp;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/v1/trades`,
            headers: {
              'x-api-key': credentials.apiKey,
              'Content-Type': 'application/json',
            },
            qs: params,
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
              'x-api-key': credentials.apiKey,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'executeTrade': {
          const orderId = this.getNodeParameter('orderId', i) as string;
          const fees = this.getNodeParameter('fees', i) as any;

          const body: any = {
            order_id: orderId,
          };

          if (fees && fees.fee && fees.fee.length > 0) {
            body.fees = fees.fee.map((fee: any) => ({
              address: fee.address,
              percentage: fee.percentage,
            }));
          }

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/v1/trades`,
            headers: {
              'x-api-key': credentials.apiKey,
              'Content-Type': 'application/json',
            },
            body,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getTradesSummary': {
          const collectionAddress = this.getNodeParameter('collectionAddress', i) as string;
          const period = this.getNodeParameter('period', i) as string;

          const params: any = {};
          if (collectionAddress) params.collection_address = collectionAddress;
          if (period) params.period = period;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/v1/trades/summary`,
            headers: {
              'x-api-key': credentials.apiKey,
              'Content-Type': 'application/json',
            },
            qs: params,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(
            this.getNode(),
            `Unknown operation: ${operation}`,
            { itemIndex: i }
          );
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
        if (error.httpCode) {
          throw new NodeApiError(this.getNode(), error, { itemIndex: i });
        } else {
          throw new NodeOperationError(this.getNode(), error.message, { itemIndex: i });
        }
      }
    }
  }

  return returnData;
}

async function executeUsersOperations(
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
        case 'getUser': {
          const address = this.getNodeParameter('address', i) as string;
          
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/v1/users/${address}`,
            headers: {
              'x-api-key': credentials.apiKey,
              'Content-Type': 'application/json',
            },
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getUserBalances': {
          const address = this.getNodeParameter('address', i) as string;
          
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/v1/users/${address}/balances`,
            headers: {
              'x-api-key': credentials.apiKey,
              'Content-Type': 'application/json',
            },
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'updateUser': {
          const address = this.getNodeParameter('address', i) as string;
          const nickname = this.getNodeParameter('nickname', i) as string;
          const email = this.getNodeParameter('email', i) as string;
          
          const body: any = {};
          if (nickname) body.nickname = nickname;
          if (email) body.email = email;
          
          const options: any = {
            method: 'PUT',
            url: `${credentials.baseUrl}/v1/users/${address}`,
            headers: {
              'x-api-key': credentials.apiKey,
              'Content-Type': 'application/json',
            },
            body,
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getUserOrders': {
          const address = this.getNodeParameter('address', i) as string;
          const status = this.getNodeParameter('status', i) as string;
          
          const queryParams = new URLSearchParams();
          if (status) {
            queryParams.append('status', status);
          }
          
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/v1/users/${address}/orders${queryParams.toString() ? '?' + queryParams.toString() : ''}`,
            headers: {
              'x-api-key': credentials.apiKey,
              'Content-Type': 'application/json',
            },
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getUserTrades': {
          const address = this.getNodeParameter('address', i) as string;
          const pageSize = this.getNodeParameter('pageSize', i) as number;
          
          const queryParams = new URLSearchParams();
          if (pageSize) {
            queryParams.append('page_size', pageSize.toString());
          }
          
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/v1/users/${address}/trades${queryParams.toString() ? '?' + queryParams.toString() : ''}`,
            headers: {
              'x-api-key': credentials.apiKey,
              'Content-Type': 'application/json',
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
        returnData.push({ json: { error: error.message }, pairedItem: { item: i } });
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

async function executeProjectsOperations(
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
        case 'listProjects': {
          const status = this.getNodeParameter('status', i) as string;
          const category = this.getNodeParameter('category', i) as string;
          
          let queryParams = '';
          const params = [];
          if (status) params.push(`status=${encodeURIComponent(status)}`);
          if (category) params.push(`category=${encodeURIComponent(category)}`);
          if (params.length > 0) queryParams = '?' + params.join('&');
          
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/v1/projects${queryParams}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'getProject': {
          const projectId = this.getNodeParameter('projectId', i) as string;
          
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/v1/projects/${projectId}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'createProject': {
          const name = this.getNodeParameter('name', i) as string;
          const description = this.getNodeParameter('description', i) as string;
          const websiteUrl = this.getNodeParameter('websiteUrl', i) as string;
          const contactEmail = this.getNodeParameter('contactEmail', i) as string;
          
          const body: any = {
            name,
            contact_email: contactEmail,
          };
          
          if (description) body.description = description;
          if (websiteUrl) body.website_url = websiteUrl;
          
          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/v1/projects`,
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
        
        case 'updateProject': {
          const projectId = this.getNodeParameter('projectId', i) as string;
          const description = this.getNodeParameter('description', i) as string;
          const logoUrl = this.getNodeParameter('logoUrl', i) as string;
          const websiteUrl = this.getNodeParameter('websiteUrl', i) as string;
          
          const body: any = {};
          if (description) body.description = description;
          if (logoUrl) body.logo_url = logoUrl;
          if (websiteUrl) body.website_url = websiteUrl;
          
          const options: any = {
            method: 'PUT',
            url: `${credentials.baseUrl}/v1/projects/${projectId}`,
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
        
        case 'deleteProject': {
          const projectId = this.getNodeParameter('projectId', i) as string;
          
          const options: any = {
            method: 'DELETE',
            url: `${credentials.baseUrl}/v1/projects/${projectId}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
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
        returnData.push({ json: { error: error.message }, pairedItem: { item: i } });
      } else {
        if (error.httpCode) {
          throw new NodeApiError(this.getNode(), error);
        }
        throw new NodeOperationError(this.getNode(), error.message);
      }
    }
  }
  
  return returnData;
}
