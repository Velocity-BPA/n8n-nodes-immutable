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

  test('should create collection successfully', async () => {
    const mockResponse = {
      collection_address: '0x123...',
      name: 'Test Collection',
      description: 'Test Description',
    };

    mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
      const params: any = {
        operation: 'createCollection',
        name: 'Test Collection',
        description: 'Test Description',
        collection_image_url: 'https://example.com/image.png',
        project_id: 'project123',
      };
      return params[paramName];
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeCollectionsOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result[0].json).toEqual(mockResponse);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: 'https://api.immutable.com/v1/collections',
      headers: {
        'x-immutable-api-key': 'test-api-key',
        'Content-Type': 'application/json',
      },
      body: {
        name: 'Test Collection',
        description: 'Test Description',
        collection_image_url: 'https://example.com/image.png',
        project_id: 'project123',
      },
      json: true,
    });
  });

  test('should get collection by address successfully', async () => {
    const mockResponse = {
      collection_address: '0x123...',
      name: 'Test Collection',
      description: 'Test Description',
    };

    mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
      const params: any = {
        operation: 'getCollection',
        collection_address: '0x123...',
      };
      return params[paramName];
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeCollectionsOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result[0].json).toEqual(mockResponse);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://api.immutable.com/v1/collections/0x123...',
      headers: {
        'x-immutable-api-key': 'test-api-key',
      },
      json: true,
    });
  });

  test('should list collections with pagination', async () => {
    const mockResponse = {
      result: [
        { collection_address: '0x123...', name: 'Collection 1' },
        { collection_address: '0x456...', name: 'Collection 2' },
      ],
      cursor: 'next_cursor',
    };

    mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
      const params: any = {
        operation: 'listCollections',
        page_size: 10,
        cursor: 'start_cursor',
        keyword: 'test',
      };
      return params[paramName];
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeCollectionsOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result[0].json).toEqual(mockResponse);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://api.immutable.com/v1/collections?page_size=10&cursor=start_cursor&keyword=test',
      headers: {
        'x-immutable-api-key': 'test-api-key',
      },
      json: true,
    });
  });

  test('should update collection successfully', async () => {
    const mockResponse = {
      collection_address: '0x123...',
      name: 'Updated Collection',
      description: 'Updated Description',
    };

    mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
      const params: any = {
        operation: 'updateCollection',
        collection_address: '0x123...',
        name: 'Updated Collection',
        description: 'Updated Description',
        collection_image_url: 'https://example.com/updated-image.png',
      };
      return params[paramName];
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeCollectionsOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result[0].json).toEqual(mockResponse);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'PUT',
      url: 'https://api.immutable.com/v1/collections/0x123...',
      headers: {
        'x-immutable-api-key': 'test-api-key',
        'Content-Type': 'application/json',
      },
      body: {
        name: 'Updated Collection',
        description: 'Updated Description',
        collection_image_url: 'https://example.com/updated-image.png',
      },
      json: true,
    });
  });

  test('should get collection NFTs successfully', async () => {
    const mockResponse = {
      result: [
        { token_id: '1', name: 'NFT 1' },
        { token_id: '2', name: 'NFT 2' },
      ],
      cursor: 'next_cursor',
    };

    mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
      const params: any = {
        operation: 'getCollectionNFTs',
        collection_address: '0x123...',
        page_size: 20,
        cursor: 'start_cursor',
      };
      return params[paramName];
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeCollectionsOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result[0].json).toEqual(mockResponse);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://api.immutable.com/v1/collections/0x123.../nfts?page_size=20&cursor=start_cursor',
      headers: {
        'x-immutable-api-key': 'test-api-key',
      },
      json: true,
    });
  });

  test('should handle API errors gracefully', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
      const params: any = {
        operation: 'getCollection',
        collection_address: '0x123...',
      };
      return params[paramName];
    });

    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);

    const result = await executeCollectionsOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result[0].json).toEqual({ error: 'API Error' });
  });
});

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

  describe('mintAsset', () => {
    it('should mint asset successfully', async () => {
      const mockResponse = {
        transaction_id: 'tx123',
        asset_id: 'asset123',
        status: 'pending',
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'mintAsset';
          case 'environment': return 'sandbox';
          case 'collection_address': return '0x123';
          case 'to': return '0x456';
          case 'token_id': return '1';
          case 'blueprint': return 'blueprint1';
          case 'metadata': return { name: 'Test NFT' };
          default: return '';
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeAssetsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://api.sandbox.immutable.com/v1/assets',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        body: {
          collection_address: '0x123',
          to: '0x456',
          token_id: '1',
          metadata: { name: 'Test NFT' },
          blueprint: 'blueprint1',
        },
        json: true,
      });
    });

    it('should handle mint asset error', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'mintAsset';
          case 'environment': return 'sandbox';
          default: return '';
        }
      });

      const error = new Error('API Error');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(error);

      await expect(executeAssetsOperations.call(mockExecuteFunctions, [{ json: {} }])).rejects.toThrow('API Error');
    });
  });

  describe('getAsset', () => {
    it('should get asset successfully', async () => {
      const mockResponse = {
        token_id: '1',
        token_address: '0x123',
        name: 'Test NFT',
        metadata: { name: 'Test NFT' },
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'getAsset';
          case 'environment': return 'mainnet';
          case 'token_address': return '0x123';
          case 'token_id': return '1';
          default: return '';
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeAssetsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.immutable.com/v1/assets/0x123/1',
        headers: {
          'Authorization': 'Bearer test-api-key',
        },
        json: true,
      });
    });
  });

  describe('listAssets', () => {
    it('should list assets successfully with filters', async () => {
      const mockResponse = {
        result: [
          { token_id: '1', name: 'NFT 1' },
          { token_id: '2', name: 'NFT 2' },
        ],
        cursor: 'next_cursor',
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'listAssets';
          case 'environment': return 'sandbox';
          case 'collection': return '0x123';
          case 'owner': return '0x456';
          case 'page_size': return 50;
          case 'cursor': return '';
          case 'status': return 'active';
          default: return '';
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeAssetsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.sandbox.immutable.com/v1/assets?collection=0x123&owner=0x456&page_size=50&status=active',
        headers: {
          'Authorization': 'Bearer test-api-key',
        },
        json: true,
      });
    });
  });

  describe('updateAsset', () => {
    it('should update asset successfully', async () => {
      const mockResponse = {
        token_id: '1',
        token_address: '0x123',
        metadata: { name: 'Updated NFT' },
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'updateAsset';
          case 'environment': return 'sandbox';
          case 'token_address': return '0x123';
          case 'token_id': return '1';
          case 'metadata': return { name: 'Updated NFT' };
          default: return '';
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeAssetsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'PUT',
        url: 'https://api.sandbox.immutable.com/v1/assets/0x123/1',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        body: {
          metadata: { name: 'Updated NFT' },
        },
        json: true,
      });
    });
  });

  describe('transferAsset', () => {
    it('should transfer asset successfully', async () => {
      const mockResponse = {
        transaction_id: 'tx456',
        status: 'pending',
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'transferAsset';
          case 'environment': return 'mainnet';
          case 'token_address': return '0x123';
          case 'token_id': return '1';
          case 'receiver': return '0x789';
          default: return '';
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeAssetsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://api.immutable.com/v1/assets/0x123/1/transfer',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        body: {
          receiver: '0x789',
        },
        json: true,
      });
    });
  });

  describe('error handling', () => {
    it('should continue on fail when enabled', async () => {
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        if (param === 'operation') return 'getAsset';
        if (param === 'environment') return 'sandbox';
        return '';
      });

      const error = new Error('Network error');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(error);

      const result = await executeAssetsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json.error).toBe('Network error');
    });

    it('should throw error for unknown operation', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        if (param === 'operation') return 'unknownOperation';
        return '';
      });

      await expect(executeAssetsOperations.call(mockExecuteFunctions, [{ json: {} }])).rejects.toThrow('Unknown operation: unknownOperation');
    });
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

  describe('createOrder', () => {
    it('should create a buy order successfully', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'createOrder';
          case 'environment': return 'sandbox';
          case 'type': return 'buy';
          case 'data': return '{"token_id": "123", "amount": "1000"}';
          case 'fees': return '[]';
          case 'timestamp': return 1640995200;
          default: return '';
        }
      });

      const mockResponse = {
        order_id: 'order_123',
        status: 'active',
        type: 'buy',
      };

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeOrdersOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://api.sandbox.immutable.com/v1/orders',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        body: {
          type: 'buy',
          data: { token_id: '123', amount: '1000' },
          fees: [],
          timestamp: 1640995200,
        },
        json: true,
      });
    });
  });

  describe('getOrder', () => {
    it('should get order details successfully', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'getOrder';
          case 'environment': return 'mainnet';
          case 'orderId': return 'order_123';
          default: return '';
        }
      });

      const mockResponse = {
        order_id: 'order_123',
        status: 'filled',
        type: 'buy',
        amount: '1000',
      };

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeOrdersOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.immutable.com/v1/orders/order_123',
        headers: {
          'Authorization': 'Bearer test-api-key',
        },
        json: true,
      });
    });
  });

  describe('listOrders', () => {
    it('should list orders with filters successfully', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'listOrders';
          case 'environment': return 'sandbox';
          case 'status': return 'active';
          case 'user': return '0x123...';
          case 'sellTokenAddress': return '';
          case 'buyTokenAddress': return '';
          case 'pageSize': return 50;
          case 'cursor': return '';
          default: return '';
        }
      });

      const mockResponse = {
        result: [
          { order_id: 'order_1', status: 'active' },
          { order_id: 'order_2', status: 'active' },
        ],
        cursor: 'next_cursor',
      };

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeOrdersOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.sandbox.immutable.com/v1/orders?status=active&user=0x123...&page_size=50',
        headers: {
          'Authorization': 'Bearer test-api-key',
        },
        json: true,
      });
    });
  });

  describe('updateOrder', () => {
    it('should update order status successfully', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'updateOrder';
          case 'environment': return 'sandbox';
          case 'orderId': return 'order_123';
          case 'status': return 'cancelled';
          default: return '';
        }
      });

      const mockResponse = {
        order_id: 'order_123',
        status: 'cancelled',
      };

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeOrdersOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'PUT',
        url: 'https://api.sandbox.immutable.com/v1/orders/order_123',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        body: {
          status: 'cancelled',
        },
        json: true,
      });
    });
  });

  describe('cancelOrder', () => {
    it('should cancel order successfully', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'cancelOrder';
          case 'environment': return 'sandbox';
          case 'orderId': return 'order_123';
          default: return '';
        }
      });

      const mockResponse = {
        order_id: 'order_123',
        status: 'cancelled',
      };

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeOrdersOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'DELETE',
        url: 'https://api.sandbox.immutable.com/v1/orders/order_123',
        headers: {
          'Authorization': 'Bearer test-api-key',
        },
        json: true,
      });
    });
  });

  describe('error handling', () => {
    it('should handle API errors properly', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'getOrder';
          case 'environment': return 'sandbox';
          case 'orderId': return 'invalid_order';
          default: return '';
        }
      });

      const apiError = {
        response: {
          body: { message: 'Order not found' },
        },
      };

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
          case 'environment': return 'sandbox';
          case 'orderId': return 'invalid_order';
          default: return '';
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

      const result = await executeOrdersOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json.error).toBe('API Error');
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

  describe('createTrade', () => {
    it('should create a trade successfully', async () => {
      const mockResponse = {
        trade_id: '123',
        status: 'completed',
        order_id: 'order-456',
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'createTrade';
          case 'orderId': return 'order-456';
          case 'fees': return 100;
          case 'timestamp': return '2023-01-01T00:00:00Z';
          default: return undefined;
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeTradesOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://api.immutable.com/v1/trades',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        body: {
          order_id: 'order-456',
          fees: 100,
          timestamp: '2023-01-01T00:00:00Z',
        },
        json: true,
      });

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });
  });

  describe('getTrade', () => {
    it('should get trade details successfully', async () => {
      const mockResponse = {
        trade_id: '123',
        status: 'completed',
        buyer: 'buyer-address',
        seller: 'seller-address',
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'getTrade';
          case 'tradeId': return '123';
          default: return undefined;
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeTradesOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.immutable.com/v1/trades/123',
        headers: {
          'Authorization': 'Bearer test-api-key',
        },
        json: true,
      });

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });
  });

  describe('listTrades', () => {
    it('should list trades with filters successfully', async () => {
      const mockResponse = {
        result: [
          { trade_id: '123', status: 'completed' },
          { trade_id: '456', status: 'pending' },
        ],
        cursor: 'next-cursor',
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'listTrades';
          case 'partyATokenAddress': return '0x123';
          case 'partyBTokenAddress': return '0x456';
          case 'pageSize': return 50;
          case 'cursor': return 'cursor-123';
          case 'minTimestamp': return '2023-01-01T00:00:00Z';
          case 'maxTimestamp': return '2023-12-31T23:59:59Z';
          default: return undefined;
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeTradesOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.immutable.com/v1/trades?party_a_token_address=0x123&party_b_token_address=0x456&page_size=50&cursor=cursor-123&min_timestamp=2023-01-01T00%3A00%3A00Z&max_timestamp=2023-12-31T23%3A59%3A59Z',
        headers: {
          'Authorization': 'Bearer test-api-key',
        },
        json: true,
      });

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });
  });

  describe('getTradesSummary', () => {
    it('should get trades summary successfully', async () => {
      const mockResponse = {
        volume: '1000000',
        trade_count: 150,
        average_price: '6666.67',
        period: '24h',
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'getTradesSummary';
          case 'collection': return '0x789';
          case 'period': return '24h';
          default: return undefined;
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeTradesOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.immutable.com/v1/trades/summary?collection=0x789&period=24h',
        headers: {
          'Authorization': 'Bearer test-api-key',
        },
        json: true,
      });

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });
  });

  describe('error handling', () => {
    it('should handle API errors', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'getTrade';
          case 'tradeId': return 'invalid-id';
          default: return undefined;
        }
      });

      const error = new Error('Trade not found');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(error);

      await expect(
        executeTradesOperations.call(mockExecuteFunctions, [{ json: {} }])
      ).rejects.toThrow('Trade not found');
    });

    it('should continue on fail when configured', async () => {
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'getTrade';
          case 'tradeId': return 'invalid-id';
          default: return undefined;
        }
      });

      const error = new Error('Trade not found');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(error);

      const result = await executeTradesOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: { error: 'Trade not found' }, pairedItem: { item: 0 } }]);
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

  describe('getUser', () => {
    it('should get user profile successfully', async () => {
      const mockResponse = {
        user_address: '0x123...',
        total_trades: 10,
        total_volume: '1000.50',
        created_at: '2024-01-01T00:00:00Z',
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string, itemIndex: number) => {
        if (paramName === 'operation') return 'getUser';
        if (paramName === 'userAddress') return '0x123...';
        return undefined;
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeUsersOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.immutable.com/v1/users/0x123...',
        headers: {
          'x-api-key': 'test-api-key',
          'Content-Type': 'application/json',
        },
        json: true,
      });
      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });
  });

  describe('getUserBalances', () => {
    it('should get user balances successfully', async () => {
      const mockResponse = {
        result: [
          { token_address: '0xabc...', balance: '100.0', symbol: 'IMX' },
          { token_address: '0xdef...', balance: '50.5', symbol: 'USDC' },
        ],
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string, itemIndex: number) => {
        if (paramName === 'operation') return 'getUserBalances';
        if (paramName === 'userAddress') return '0x123...';
        return undefined;
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeUsersOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.immutable.com/v1/users/0x123.../balances',
        headers: {
          'x-api-key': 'test-api-key',
          'Content-Type': 'application/json',
        },
        json: true,
      });
      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });
  });

  describe('getUserOrders', () => {
    it('should get user orders with filters successfully', async () => {
      const mockResponse = {
        result: [
          { order_id: 1, status: 'active', amount: '10.0' },
          { order_id: 2, status: 'active', amount: '20.0' },
        ],
        cursor: 'next-cursor',
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string, itemIndex: number) => {
        if (paramName === 'operation') return 'getUserOrders';
        if (paramName === 'userAddress') return '0x123...';
        if (paramName === 'status') return 'active';
        if (paramName === 'pageSize') return 20;
        if (paramName === 'cursor') return '';
        return undefined;
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeUsersOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.immutable.com/v1/users/0x123.../orders?status=active&page_size=20',
        headers: {
          'x-api-key': 'test-api-key',
          'Content-Type': 'application/json',
        },
        json: true,
      });
      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });
  });

  describe('getUserTrades', () => {
    it('should get user trades successfully', async () => {
      const mockResponse = {
        result: [
          { trade_id: 1, amount: '10.0', timestamp: '2024-01-01T00:00:00Z' },
          { trade_id: 2, amount: '15.5', timestamp: '2024-01-02T00:00:00Z' },
        ],
        cursor: 'next-cursor',
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string, itemIndex: number) => {
        if (paramName === 'operation') return 'getUserTrades';
        if (paramName === 'userAddress') return '0x123...';
        if (paramName === 'pageSize') return 20;
        if (paramName === 'cursor') return '';
        return undefined;
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeUsersOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.immutable.com/v1/users/0x123.../trades?page_size=20',
        headers: {
          'x-api-key': 'test-api-key',
          'Content-Type': 'application/json',
        },
        json: true,
      });
      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });
  });

  describe('getUserNFTs', () => {
    it('should get user NFTs with collection filter successfully', async () => {
      const mockResponse = {
        result: [
          { token_id: '1', collection_address: '0xcollection...', name: 'NFT #1' },
          { token_id: '2', collection_address: '0xcollection...', name: 'NFT #2' },
        ],
        cursor: 'next-cursor',
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string, itemIndex: number) => {
        if (paramName === 'operation') return 'getUserNFTs';
        if (paramName === 'userAddress') return '0x123...';
        if (paramName === 'collection') return '0xcollection...';
        if (paramName === 'pageSize') return 20;
        if (paramName === 'cursor') return '';
        return undefined;
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeUsersOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.immutable.com/v1/users/0x123.../nfts?collection=0xcollection...&page_size=20',
        headers: {
          'x-api-key': 'test-api-key',
          'Content-Type': 'application/json',
        },
        json: true,
      });
      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });
  });

  describe('error handling', () => {
    it('should handle API errors properly', async () => {
      const mockError = {
        httpCode: 404,
        message: 'User not found',
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string, itemIndex: number) => {
        if (paramName === 'operation') return 'getUser';
        if (paramName === 'userAddress') return '0xinvalid...';
        return undefined;
      });

      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(mockError);

      await expect(executeUsersOperations.call(mockExecuteFunctions, [{ json: {} }])).rejects.toThrow();
    });

    it('should continue on fail when configured', async () => {
      const mockError = new Error('API Error');
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string, itemIndex: number) => {
        if (paramName === 'operation') return 'getUser';
        if (paramName === 'userAddress') return '0xinvalid...';
        return undefined;
      });

      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(mockError);

      const result = await executeUsersOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: { error: 'API Error' }, pairedItem: { item: 0 } }]);
    });
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

  describe('createProject', () => {
    it('should create a new project successfully', async () => {
      const mockResponse = {
        id: 'project-123',
        name: 'Test Game',
        company_name: 'Test Company',
        contact_email: 'test@example.com',
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'createProject';
          case 'name': return 'Test Game';
          case 'company_name': return 'Test Company';
          case 'contact_email': return 'test@example.com';
          default: return '';
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeProjectsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://api.immutable.com/v1/projects',
        headers: {
          'x-api-key': 'test-api-key',
          'Content-Type': 'application/json',
        },
        body: {
          name: 'Test Game',
          company_name: 'Test Company',
          contact_email: 'test@example.com',
        },
        json: true,
      });
    });
  });

  describe('getProject', () => {
    it('should get project details successfully', async () => {
      const mockResponse = {
        id: 'project-123',
        name: 'Test Game',
        company_name: 'Test Company',
        contact_email: 'test@example.com',
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'getProject';
          case 'project_id': return 'project-123';
          default: return '';
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeProjectsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.immutable.com/v1/projects/project-123',
        headers: {
          'x-api-key': 'test-api-key',
        },
        json: true,
      });
    });
  });

  describe('listProjects', () => {
    it('should list projects successfully', async () => {
      const mockResponse = {
        result: [
          { id: 'project-1', name: 'Game 1' },
          { id: 'project-2', name: 'Game 2' },
        ],
        cursor: 'next-cursor',
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string, index: number, defaultValue?: any) => {
        switch (param) {
          case 'operation': return 'listProjects';
          case 'page_size': return defaultValue || 50;
          case 'cursor': return defaultValue || '';
          default: return defaultValue || '';
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeProjectsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.immutable.com/v1/projects',
        headers: {
          'x-api-key': 'test-api-key',
        },
        qs: {
          page_size: 100,
        },
        json: true,
      });
    });
  });

  describe('updateProject', () => {
    it('should update project successfully', async () => {
      const mockResponse = {
        id: 'project-123',
        name: 'Updated Game',
        company_name: 'Updated Company',
        contact_email: 'updated@example.com',
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string, index: number, defaultValue?: any) => {
        switch (param) {
          case 'operation': return 'updateProject';
          case 'project_id': return 'project-123';
          case 'name': return 'Updated Game';
          case 'company_name': return 'Updated Company';
          case 'contact_email': return 'updated@example.com';
          default: return defaultValue || '';
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeProjectsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'PUT',
        url: 'https://api.immutable.com/v1/projects/project-123',
        headers: {
          'x-api-key': 'test-api-key',
          'Content-Type': 'application/json',
        },
        body: {
          name: 'Updated Game',
          company_name: 'Updated Company',
          contact_email: 'updated@example.com',
        },
        json: true,
      });
    });
  });

  describe('getProjectCollections', () => {
    it('should get project collections successfully', async () => {
      const mockResponse = {
        result: [
          { collection_address: '0x123', name: 'Collection 1' },
          { collection_address: '0x456', name: 'Collection 2' },
        ],
        cursor: 'next-cursor',
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string, index: number, defaultValue?: any) => {
        switch (param) {
          case 'operation': return 'getProjectCollections';
          case 'project_id': return 'project-123';
          case 'page_size': return defaultValue || 100;
          case 'cursor': return defaultValue || '';
          default: return defaultValue || '';
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeProjectsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.immutable.com/v1/projects/project-123/collections',
        headers: {
          'x-api-key': 'test-api-key',
        },
        qs: {
          page_size: 100,
        },
        json: true,
      });
    });
  });

  describe('error handling', () => {
    it('should handle API errors properly', async () => {
      const mockError = new Error('API Error');
      mockError.httpCode = 400;

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'getProject';
          case 'project_id': return 'invalid-id';
          default: return '';
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(mockError);

      await expect(executeProjectsOperations.call(mockExecuteFunctions, [{ json: {} }])).rejects.toThrow('API Error');
    });

    it('should continue on fail when configured', async () => {
      const mockError = new Error('API Error');
      
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'getProject';
          case 'project_id': return 'invalid-id';
          default: return '';
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(mockError);

      const result = await executeProjectsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{
        json: { error: 'API Error' },
        pairedItem: { item: 0 }
      }]);
    });
  });
});

describe('Withdrawals Resource', () => {
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

  describe('createWithdrawal', () => {
    it('should create withdrawal successfully', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        const params: any = {
          operation: 'createWithdrawal',
          type: 'ETH',
          amount: '1000000000000000000',
          tokenAddress: '0x123',
          starkSignature: 'signature123',
        };
        return params[param];
      });

      const mockResponse = {
        withdrawal_id: 'withdrawal123',
        status: 'pending',
      };

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeWithdrawalsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://api.immutable.com/v1/withdrawals',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        body: {
          type: 'ETH',
          amount: '1000000000000000000',
          token_address: '0x123',
          stark_signature: 'signature123',
        },
        json: true,
      });
    });

    it('should handle createWithdrawal error', async () => {
      mockExecuteFunctions.getNodeParameter.mockReturnValue('createWithdrawal');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

      await expect(executeWithdrawalsOperations.call(mockExecuteFunctions, [{ json: {} }])).rejects.toThrow('API Error');
    });
  });

  describe('getWithdrawal', () => {
    it('should get withdrawal successfully', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        const params: any = {
          operation: 'getWithdrawal',
          withdrawalId: 'withdrawal123',
        };
        return params[param];
      });

      const mockResponse = {
        withdrawal_id: 'withdrawal123',
        status: 'completed',
        amount: '1000000000000000000',
      };

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeWithdrawalsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.immutable.com/v1/withdrawals/withdrawal123',
        headers: {
          'Authorization': 'Bearer test-api-key',
        },
        json: true,
      });
    });
  });

  describe('listWithdrawals', () => {
    it('should list withdrawals successfully', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        const params: any = {
          operation: 'listWithdrawals',
          user: '0xuser123',
          status: 'included',
          pageSize: 50,
          cursor: '',
          minTimestamp: '',
          maxTimestamp: '',
        };
        return params[param];
      });

      const mockResponse = {
        result: [
          {
            withdrawal_id: 'withdrawal123',
            status: 'included',
            amount: '1000000000000000000',
          },
        ],
        cursor: 'next_cursor',
      };

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeWithdrawalsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.immutable.com/v1/withdrawals?user=0xuser123&status=included&page_size=50',
        headers: {
          'Authorization': 'Bearer test-api-key',
        },
        json: true,
      });
    });
  });

  describe('getSignableWithdrawal', () => {
    it('should get signable withdrawal successfully', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        const params: any = {
          operation: 'getSignableWithdrawal',
          type: 'ERC20',
          amount: '1000000000000000000',
          tokenAddress: '0xtoken123',
        };
        return params[param];
      });

      const mockResponse = {
        signable_message: 'message_to_sign',
        payload_hash: 'hash123',
      };

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeWithdrawalsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.immutable.com/v1/withdrawals/signable?type=ERC20&amount=1000000000000000000&token_address=0xtoken123',
        headers: {
          'Authorization': 'Bearer test-api-key',
        },
        json: true,
      });
    });
  });
});
});
