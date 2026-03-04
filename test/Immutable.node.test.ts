/**
 * Copyright (c) 2026 Velocity BPA
 * Licensed under the Business Source License 1.1
 */

import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { Immutable } from '../nodes/Immutable/Immutable.node';

// Mock n8n-workflow
jest.mock('n8n-workflow', () => ({
  ...jest.requireActual('n8n-workflow'),
  NodeApiError: class NodeApiError extends Error {
    constructor(node: any, error: any) { super(error.message || 'API Error'); }
  },
  NodeOperationError: class NodeOperationError extends Error {
    constructor(node: any, message: string) { super(message); }
  },
}));

describe('Immutable Node', () => {
  let node: Immutable;

  beforeAll(() => {
    node = new Immutable();
  });

  describe('Node Definition', () => {
    it('should have correct basic properties', () => {
      expect(node.description.displayName).toBe('Immutable');
      expect(node.description.name).toBe('immutable');
      expect(node.description.version).toBe(1);
      expect(node.description.inputs).toContain('main');
      expect(node.description.outputs).toContain('main');
    });

    it('should define 7 resources', () => {
      const resourceProp = node.description.properties.find(
        (p: any) => p.name === 'resource'
      );
      expect(resourceProp).toBeDefined();
      expect(resourceProp!.type).toBe('options');
      expect(resourceProp!.options).toHaveLength(7);
    });

    it('should have operation dropdowns for each resource', () => {
      const operations = node.description.properties.filter(
        (p: any) => p.name === 'operation'
      );
      expect(operations.length).toBe(7);
    });

    it('should require credentials', () => {
      expect(node.description.credentials).toBeDefined();
      expect(node.description.credentials!.length).toBeGreaterThan(0);
      expect(node.description.credentials![0].required).toBe(true);
    });

    it('should have parameters with proper displayOptions', () => {
      const params = node.description.properties.filter(
        (p: any) => p.displayOptions?.show?.resource
      );
      for (const param of params) {
        expect(param.displayOptions.show.resource).toBeDefined();
        expect(Array.isArray(param.displayOptions.show.resource)).toBe(true);
      }
    });
  });

  // Resource-specific tests
describe('Assets Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-api-key',
        baseUrl: 'https://api.immutable.com',
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn(),
      },
    };
  });

  test('listAssets should successfully retrieve assets list', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
      switch (paramName) {
        case 'operation':
          return 'listAssets';
        case 'collection':
          return '0x123';
        case 'owner':
          return '0x456';
        case 'status':
          return 'imx';
        case 'metadata':
          return '';
        default:
          return '';
      }
    });

    const mockResponse = {
      result: [
        { token_id: '1', token_address: '0x123', owner: '0x456' },
        { token_id: '2', token_address: '0x123', owner: '0x456' },
      ],
    };

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeAssetsOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://api.immutable.com/v1/assets?collection=0x123&owner=0x456&status=imx',
      headers: {
        'x-api-key': 'test-api-key',
        'Content-Type': 'application/json',
      },
      json: true,
    });
  });

  test('getAsset should successfully retrieve specific asset', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
      switch (paramName) {
        case 'operation':
          return 'getAsset';
        case 'tokenAddress':
          return '0x123';
        case 'tokenId':
          return '1';
        default:
          return '';
      }
    });

    const mockResponse = {
      token_id: '1',
      token_address: '0x123',
      owner: '0x456',
      metadata: { name: 'Test NFT' },
    };

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeAssetsOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://api.immutable.com/v1/assets/0x123/1',
      headers: {
        'x-api-key': 'test-api-key',
        'Content-Type': 'application/json',
      },
      json: true,
    });
  });

  test('createAsset should successfully create new asset', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
      switch (paramName) {
        case 'operation':
          return 'createAsset';
        case 'tokenAddress':
          return '0x123';
        case 'tokenId':
          return '1';
        case 'metadataUri':
          return 'https://example.com/metadata/1';
        case 'royaltyPercentage':
          return 5;
        default:
          return '';
      }
    });

    const mockResponse = {
      token_id: '1',
      token_address: '0x123',
      status: 'created',
    };

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeAssetsOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: 'https://api.immutable.com/v1/assets',
      headers: {
        'x-api-key': 'test-api-key',
        'Content-Type': 'application/json',
      },
      body: {
        token_address: '0x123',
        token_id: '1',
        metadata_uri: 'https://example.com/metadata/1',
        royalty_percentage: 5,
      },
      json: true,
    });
  });

  test('transferAsset should successfully transfer asset', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
      switch (paramName) {
        case 'operation':
          return 'transferAsset';
        case 'tokenAddress':
          return '0x123';
        case 'tokenId':
          return '1';
        case 'receiver':
          return '0x789';
        default:
          return '';
      }
    });

    const mockResponse = {
      transfer_id: 'tx123',
      status: 'pending',
    };

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeAssetsOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: 'https://api.immutable.com/v1/transfers',
      headers: {
        'x-api-key': 'test-api-key',
        'Content-Type': 'application/json',
      },
      body: {
        token_address: '0x123',
        token_id: '1',
        receiver: '0x789',
      },
      json: true,
    });
  });

  test('should handle API errors correctly', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
      switch (paramName) {
        case 'operation':
          return 'getAsset';
        case 'tokenAddress':
          return '0x123';
        case 'tokenId':
          return '1';
        default:
          return '';
      }
    });

    const mockError = new Error('API Error: Asset not found');
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(mockError);

    await expect(
      executeAssetsOperations.call(mockExecuteFunctions, [{ json: {} }]),
    ).rejects.toThrow();
  });

  test('should continue on fail when enabled', async () => {
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);
    mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
      switch (paramName) {
        case 'operation':
          return 'getAsset';
        case 'tokenAddress':
          return '0x123';
        case 'tokenId':
          return '1';
        default:
          return '';
      }
    });

    const mockError = new Error('API Error');
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(mockError);

    const result = await executeAssetsOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual({ error: 'API Error' });
  });
});

describe('Collections Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-api-key',
        baseUrl: 'https://api.immutable.com',
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn(),
      },
    };
  });

  describe('listCollections', () => {
    it('should list collections successfully', async () => {
      const mockResponse = {
        result: [
          { address: '0x123', name: 'Test Collection', symbol: 'TEST' },
        ],
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation':
            return 'listCollections';
          case 'keyword':
            return 'test';
          case 'orderBy':
            return 'name';
          case 'pageSize':
            return 50;
          case 'chain':
            return 'imx';
          default:
            return undefined;
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeCollectionsOperations.call(
        mockExecuteFunctions,
        [{ json: {} }],
      );

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.immutable.com/v1/collections?order_by=name&page_size=50&keyword=test',
        headers: {
          'x-api-key': 'test-api-key',
          'Content-Type': 'application/json',
        },
        json: true,
      });
    });
  });

  describe('getCollection', () => {
    it('should get collection details successfully', async () => {
      const mockResponse = {
        address: '0x123',
        name: 'Test Collection',
        symbol: 'TEST',
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation':
            return 'getCollection';
          case 'address':
            return '0x123';
          case 'chain':
            return 'imx';
          default:
            return undefined;
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeCollectionsOperations.call(
        mockExecuteFunctions,
        [{ json: {} }],
      );

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
    });
  });

  describe('createCollection', () => {
    it('should create collection successfully', async () => {
      const mockResponse = {
        address: '0x456',
        name: 'New Collection',
        symbol: 'NEW',
        metadata_api_url: 'https://api.example.com/metadata',
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation':
            return 'createCollection';
          case 'name':
            return 'New Collection';
          case 'symbol':
            return 'NEW';
          case 'metadataApiUrl':
            return 'https://api.example.com/metadata';
          case 'royaltyRecipient':
            return '0x789';
          case 'chain':
            return 'imx';
          default:
            return undefined;
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeCollectionsOperations.call(
        mockExecuteFunctions,
        [{ json: {} }],
      );

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
    });
  });

  describe('updateCollection', () => {
    it('should update collection successfully', async () => {
      const mockResponse = {
        address: '0x123',
        metadata_api_url: 'https://api.example.com/new-metadata',
        royalty_percentage: 5,
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation':
            return 'updateCollection';
          case 'address':
            return '0x123';
          case 'metadataApiUrl':
            return 'https://api.example.com/new-metadata';
          case 'royaltyPercentage':
            return 5;
          case 'chain':
            return 'imx';
          default:
            return undefined;
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeCollectionsOperations.call(
        mockExecuteFunctions,
        [{ json: {} }],
      );

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
    });
  });

  describe('deleteCollection', () => {
    it('should delete collection successfully', async () => {
      const mockResponse = { success: true };

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation':
            return 'deleteCollection';
          case 'address':
            return '0x123';
          case 'chain':
            return 'imx';
          default:
            return undefined;
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeCollectionsOperations.call(
        mockExecuteFunctions,
        [{ json: {} }],
      );

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
    });
  });

  describe('error handling', () => {
    it('should handle API errors correctly', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation':
            return 'getCollection';
          case 'address':
            return '0x123';
          case 'chain':
            return 'imx';
          default:
            return undefined;
        }
      });

      const apiError = new Error('Collection not found');
      (apiError as any).httpCode = 404;
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(apiError);

      await expect(
        executeCollectionsOperations.call(mockExecuteFunctions, [{ json: {} }]),
      ).rejects.toThrow();
    });

    it('should continue on fail when configured', async () => {
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation':
            return 'getCollection';
          case 'address':
            return '0x123';
          case 'chain':
            return 'imx';
          default:
            return undefined;
        }
      });

      const apiError = new Error('Collection not found');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(apiError);

      const result = await executeCollectionsOperations.call(
        mockExecuteFunctions,
        [{ json: {} }],
      );

      expect(result).toHaveLength(1);
      expect(result[0].json.error).toBe('Collection not found');
    });
  });
});

describe('Minting Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-api-key',
        baseUrl: 'https://api.immutable.com',
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn(),
      },
    };
  });

  test('should mint NFT successfully', async () => {
    const mockResponse = {
      mint_id: 'mint_123',
      status: 'pending',
      transaction_hash: '0xabc123',
    };

    mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
      const params: any = {
        operation: 'mintNFT',
        collectionAddress: '0x123abc',
        toAddress: '0x456def',
        tokenIds: '1,2,3',
        metadata: { name: 'Test NFT' },
      };
      return params[paramName];
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeMintingOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: 'https://api.immutable.com/v1/mints',
      headers: {
        Authorization: 'Bearer test-api-key',
        'Content-Type': 'application/json',
      },
      body: {
        collection_address: '0x123abc',
        to_address: '0x456def',
        token_ids: ['1', '2', '3'],
        metadata: { name: 'Test NFT' },
      },
      json: true,
    });
  });

  test('should get mint status successfully', async () => {
    const mockResponse = {
      mint_id: 'mint_123',
      status: 'success',
      transaction_hash: '0xabc123',
      created_at: '2023-01-01T00:00:00Z',
    };

    mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
      const params: any = {
        operation: 'getMint',
        mintId: 'mint_123',
      };
      return params[paramName];
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeMintingOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
  });

  test('should batch mint NFTs successfully', async () => {
    const mockResponse = {
      batch_id: 'batch_456',
      status: 'pending',
      mint_count: 2,
    };

    mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
      const params: any = {
        operation: 'batchMint',
        collectionAddress: '0x123abc',
        recipients: '0x456def,0x789ghi',
        metadataList: [{ name: 'NFT 1' }, { name: 'NFT 2' }],
      };
      return params[paramName];
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeMintingOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
  });

  test('should list mints successfully', async () => {
    const mockResponse = {
      result: [
        {
          mint_id: 'mint_123',
          status: 'success',
          collection_address: '0x123abc',
        },
      ],
      cursor: 'next_page_token',
    };

    mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
      const params: any = {
        operation: 'listMints',
        collectionAddress: '0x123abc',
        user: '0x456def',
        status: 'success',
        page: 1,
      };
      return params[paramName];
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeMintingOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
  });

  test('should handle API errors', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
      const params: any = {
        operation: 'mintNFT',
        collectionAddress: '0x123abc',
        toAddress: '0x456def',
        tokenIds: '1',
        metadata: {},
      };
      return params[paramName];
    });

    const error = new Error('API Error');
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(error);

    await expect(
      executeMintingOperations.call(mockExecuteFunctions, [{ json: {} }])
    ).rejects.toThrow('API Error');
  });

  test('should handle continue on fail', async () => {
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);
    mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
      const params: any = {
        operation: 'mintNFT',
        collectionAddress: '0x123abc',
        toAddress: '0x456def',
        tokenIds: '1',
        metadata: {},
      };
      return params[paramName];
    });

    const error = new Error('API Error');
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(error);

    const result = await executeMintingOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual({ error: 'API Error' });
  });
});

describe('Orders Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-api-key',
        baseUrl: 'https://api.immutable.com',
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn(),
      },
    };
  });

  describe('listOrders', () => {
    it('should list orders successfully', async () => {
      const mockResponse = {
        result: [
          {
            order_id: 1,
            user: '0x123',
            status: 'active',
            buy_token_type: 'ERC721',
            sell_token_address: '0x456',
          },
        ],
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'listOrders';
          case 'status': return 'active';
          case 'user': return '0x123';
          default: return '';
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeOrdersOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.immutable.com/v1/orders',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        qs: {
          status: 'active',
          user: '0x123',
        },
        json: true,
      });
    });
  });

  describe('getOrder', () => {
    it('should get order successfully', async () => {
      const mockResponse = {
        order_id: 1,
        user: '0x123',
        status: 'active',
        buy_token_type: 'ERC721',
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'getOrder';
          case 'orderId': return '1';
          default: return '';
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeOrdersOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.immutable.com/v1/orders/1',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        json: true,
      });
    });
  });

  describe('createOrder', () => {
    it('should create order successfully', async () => {
      const mockResponse = {
        order_id: 123,
        status: 'active',
        buy_token_type: 'ETH',
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'createOrder';
          case 'buyTokenType': return 'ETH';
          case 'buyTokenAddress': return '0x123';
          case 'sellTokenAddress': return '0x456';
          case 'amount': return '1000000000000000000';
          default: return '';
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeOrdersOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://api.immutable.com/v1/orders',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        body: {
          buy_token_type: 'ETH',
          buy_token_address: '0x123',
          sell_token_address: '0x456',
          amount: '1000000000000000000',
        },
        json: true,
      });
    });
  });

  describe('error handling', () => {
    it('should handle API errors', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'getOrder';
          case 'orderId': return 'invalid-id';
          default: return '';
        }
      });

      const apiError = new Error('Order not found');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(apiError);

      await expect(
        executeOrdersOperations.call(mockExecuteFunctions, [{ json: {} }])
      ).rejects.toThrow();
    });

    it('should continue on fail when configured', async () => {
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'getOrder';
          case 'orderId': return 'invalid-id';
          default: return '';
        }
      });

      const apiError = new Error('Order not found');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(apiError);

      const result = await executeOrdersOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([
        { json: { error: 'Order not found' }, pairedItem: { item: 0 } }
      ]);
    });
  });
});

describe('Trades Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-api-key',
        baseUrl: 'https://api.immutable.com',
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn(),
      },
    };
  });

  describe('listTrades', () => {
    it('should successfully list trades', async () => {
      const mockResponse = {
        result: [
          {
            trade_id: 1,
            party_a_token_address: '0x123',
            party_b_token_address: '0x456',
            timestamp: '2023-01-01T00:00:00Z',
          },
        ],
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'listTrades';
          case 'partyATokenAddress': return '0x123';
          case 'partyBTokenAddress': return '0x456';
          case 'minTimestamp': return '1640995200';
          default: return '';
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeTradesOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.immutable.com/v1/trades',
        headers: {
          'x-api-key': 'test-api-key',
          'Content-Type': 'application/json',
        },
        qs: {
          party_a_token_address: '0x123',
          party_b_token_address: '0x456',
          min_timestamp: '1640995200',
        },
        json: true,
      });
    });
  });

  describe('getTrade', () => {
    it('should successfully get trade details', async () => {
      const mockResponse = {
        trade_id: 1,
        status: 'filled',
        timestamp: '2023-01-01T00:00:00Z',
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'getTrade';
          case 'tradeId': return '1';
          default: return '';
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeTradesOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.immutable.com/v1/trades/1',
        headers: {
          'x-api-key': 'test-api-key',
          'Content-Type': 'application/json',
        },
        json: true,
      });
    });
  });

  describe('executeTrade', () => {
    it('should successfully execute a trade', async () => {
      const mockResponse = {
        trade_id: 1,
        status: 'executed',
        timestamp: '2023-01-01T00:00:00Z',
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'executeTrade';
          case 'orderId': return 'order-123';
          case 'fees': return {
            fee: [
              { address: '0xfee', percentage: 2.5 },
            ],
          };
          default: return '';
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeTradesOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://api.immutable.com/v1/trades',
        headers: {
          'x-api-key': 'test-api-key',
          'Content-Type': 'application/json',
        },
        body: {
          order_id: 'order-123',
          fees: [
            { address: '0xfee', percentage: 2.5 },
          ],
        },
        json: true,
      });
    });
  });

  describe('getTradesSummary', () => {
    it('should successfully get trades summary', async () => {
      const mockResponse = {
        volume_24h: '1000',
        trades_24h: 50,
        floor_price: '0.1',
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'getTradesSummary';
          case 'collectionAddress': return '0xcollection';
          case 'period': return '24h';
          default: return '';
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeTradesOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.immutable.com/v1/trades/summary',
        headers: {
          'x-api-key': 'test-api-key',
          'Content-Type': 'application/json',
        },
        qs: {
          collection_address: '0xcollection',
          period: '24h',
        },
        json: true,
      });
    });
  });

  describe('error handling', () => {
    it('should handle API errors', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'getTrade';
          case 'tradeId': return 'invalid-id';
          default: return '';
        }
      });

      const error = new Error('Trade not found');
      (error as any).httpCode = 404;
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(error);

      await expect(executeTradesOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      )).rejects.toThrow('Trade not found');
    });

    it('should continue on fail when configured', async () => {
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'getTrade';
          case 'tradeId': return 'invalid-id';
          default: return '';
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

      const result = await executeTradesOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toHaveLength(1);
      expect(result[0].json.error).toBe('API Error');
    });
  });
});

describe('Users Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-api-key',
        baseUrl: 'https://api.immutable.com',
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn(),
      },
    };
  });

  test('getUser should fetch user profile successfully', async () => {
    const mockResponse = {
      address: '0x1234567890abcdef',
      nickname: 'testuser',
      email: 'test@example.com',
      stats: {
        total_trades: 10,
        total_volume: '1000'
      }
    };

    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      if (param === 'operation') return 'getUser';
      if (param === 'address') return '0x1234567890abcdef';
      return undefined;
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeUsersOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://api.immutable.com/v1/users/0x1234567890abcdef',
      headers: {
        'x-api-key': 'test-api-key',
        'Content-Type': 'application/json',
      },
      json: true,
    });
  });

  test('getUserBalances should fetch user balances successfully', async () => {
    const mockResponse = {
      balances: [
        {
          token_address: '0xtoken1',
          balance: '100',
          symbol: 'TEST1'
        },
        {
          token_address: '0xtoken2',
          balance: '200',
          symbol: 'TEST2'
        }
      ]
    };

    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      if (param === 'operation') return 'getUserBalances';
      if (param === 'address') return '0x1234567890abcdef';
      return undefined;
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeUsersOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://api.immutable.com/v1/users/0x1234567890abcdef/balances',
      headers: {
        'x-api-key': 'test-api-key',
        'Content-Type': 'application/json',
      },
      json: true,
    });
  });

  test('updateUser should update user profile successfully', async () => {
    const mockResponse = {
      address: '0x1234567890abcdef',
      nickname: 'newuser',
      email: 'newemail@example.com'
    };

    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      if (param === 'operation') return 'updateUser';
      if (param === 'address') return '0x1234567890abcdef';
      if (param === 'nickname') return 'newuser';
      if (param === 'email') return 'newemail@example.com';
      return undefined;
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeUsersOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'PUT',
      url: 'https://api.immutable.com/v1/users/0x1234567890abcdef',
      headers: {
        'x-api-key': 'test-api-key',
        'Content-Type': 'application/json',
      },
      body: {
        nickname: 'newuser',
        email: 'newemail@example.com'
      },
      json: true,
    });
  });

  test('getUserOrders should fetch user orders successfully', async () => {
    const mockResponse = {
      orders: [
        {
          order_id: 'order1',
          status: 'active',
          amount: '100'
        }
      ]
    };

    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      if (param === 'operation') return 'getUserOrders';
      if (param === 'address') return '0x1234567890abcdef';
      if (param === 'status') return 'active';
      return undefined;
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeUsersOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://api.immutable.com/v1/users/0x1234567890abcdef/orders?status=active',
      headers: {
        'x-api-key': 'test-api-key',
        'Content-Type': 'application/json',
      },
      json: true,
    });
  });

  test('getUserTrades should fetch user trades successfully', async () => {
    const mockResponse = {
      trades: [
        {
          trade_id: 'trade1',
          amount: '50',
          price: '10'
        }
      ]
    };

    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      if (param === 'operation') return 'getUserTrades';
      if (param === 'address') return '0x1234567890abcdef';
      if (param === 'pageSize') return 25;
      return undefined;
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeUsersOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://api.immutable.com/v1/users/0x1234567890abcdef/trades?page_size=25',
      headers: {
        'x-api-key': 'test-api-key',
        'Content-Type': 'application/json',
      },
      json: true,
    });
  });

  test('should handle API errors correctly', async () => {
    const mockError = {
      httpCode: '404',
      message: 'User not found'
    };

    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      if (param === 'operation') return 'getUser';
      if (param === 'address') return '0xinvalidaddress';
      return undefined;
    });

    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(mockError);

    await expect(executeUsersOperations.call(mockExecuteFunctions, [{ json: {} }])).rejects.toThrow();
  });

  test('should continue on fail when configured', async () => {
    const mockError = new Error('API Error');

    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      if (param === 'operation') return 'getUser';
      if (param === 'address') return '0xinvalidaddress';
      return undefined;
    });

    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(mockError);
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);

    const result = await executeUsersOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{ json: { error: 'API Error' }, pairedItem: { item: 0 } }]);
  });
});

describe('Projects Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-api-key',
        baseUrl: 'https://api.immutable.com',
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn(),
      },
    };
  });

  describe('listProjects', () => {
    it('should list all projects successfully', async () => {
      const mockResponse = {
        projects: [
          { id: '1', name: 'Test Project 1', status: 'active' },
          { id: '2', name: 'Test Project 2', status: 'inactive' }
        ]
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'listProjects';
          case 'status': return '';
          case 'category': return '';
          default: return '';
        }
      });
      
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeProjectsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([
        { json: mockResponse, pairedItem: { item: 0 } }
      ]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.immutable.com/v1/projects',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        json: true,
      });
    });

    it('should handle API errors', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'listProjects';
          default: return '';
        }
      });
      
      const error = new Error('API Error');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(error);

      await expect(executeProjectsOperations.call(mockExecuteFunctions, [{ json: {} }])).rejects.toThrow('API Error');
    });
  });

  describe('getProject', () => {
    it('should get project details successfully', async () => {
      const mockResponse = { id: '123', name: 'Test Project', description: 'Test Description' };

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'getProject';
          case 'projectId': return '123';
          default: return '';
        }
      });
      
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeProjectsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([
        { json: mockResponse, pairedItem: { item: 0 } }
      ]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.immutable.com/v1/projects/123',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        json: true,
      });
    });
  });

  describe('createProject', () => {
    it('should create project successfully', async () => {
      const mockResponse = { id: '123', name: 'New Project', status: 'pending' };

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'createProject';
          case 'name': return 'New Project';
          case 'description': return 'Test Description';
          case 'websiteUrl': return 'https://example.com';
          case 'contactEmail': return 'test@example.com';
          default: return '';
        }
      });
      
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeProjectsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([
        { json: mockResponse, pairedItem: { item: 0 } }
      ]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://api.immutable.com/v1/projects',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        body: {
          name: 'New Project',
          description: 'Test Description',
          website_url: 'https://example.com',
          contact_email: 'test@example.com',
        },
        json: true,
      });
    });
  });

  describe('updateProject', () => {
    it('should update project successfully', async () => {
      const mockResponse = { id: '123', name: 'Updated Project', description: 'Updated Description' };

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'updateProject';
          case 'projectId': return '123';
          case 'description': return 'Updated Description';
          case 'logoUrl': return 'https://example.com/logo.png';
          case 'websiteUrl': return 'https://example.com';
          default: return '';
        }
      });
      
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeProjectsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([
        { json: mockResponse, pairedItem: { item: 0 } }
      ]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'PUT',
        url: 'https://api.immutable.com/v1/projects/123',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        body: {
          description: 'Updated Description',
          logo_url: 'https://example.com/logo.png',
          website_url: 'https://example.com',
        },
        json: true,
      });
    });
  });

  describe('deleteProject', () => {
    it('should delete project successfully', async () => {
      const mockResponse = { success: true };

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'deleteProject';
          case 'projectId': return '123';
          default: return '';
        }
      });
      
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeProjectsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([
        { json: mockResponse, pairedItem: { item: 0 } }
      ]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'DELETE',
        url: 'https://api.immutable.com/v1/projects/123',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        json: true,
      });
    });
  });
});
});
