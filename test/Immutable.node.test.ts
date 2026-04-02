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
        apiKey: 'test-key', 
        baseUrl: 'https://api.immutable.com' 
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: { 
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn() 
      },
    };
  });

  it('should create a collection successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('createCollection')
      .mockReturnValueOnce('Test Collection')
      .mockReturnValueOnce('Test Description')
      .mockReturnValueOnce('https://example.com/icon.png')
      .mockReturnValueOnce('https://example.com/metadata')
      .mockReturnValueOnce('0x1234567890123456789012345678901234567890');

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      id: 'collection-id',
      name: 'Test Collection',
      contract_address: '0x1234567890123456789012345678901234567890'
    });

    const result = await executeCollectionsOperations.call(
      mockExecuteFunctions,
      [{ json: {} }]
    );

    expect(result).toHaveLength(1);
    expect(result[0].json.name).toBe('Test Collection');
  });

  it('should get a collection successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getCollection')
      .mockReturnValueOnce('0x1234567890123456789012345678901234567890');

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      contract_address: '0x1234567890123456789012345678901234567890',
      name: 'Test Collection'
    });

    const result = await executeCollectionsOperations.call(
      mockExecuteFunctions,
      [{ json: {} }]
    );

    expect(result).toHaveLength(1);
    expect(result[0].json.contract_address).toBe('0x1234567890123456789012345678901234567890');
  });

  it('should list collections successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('listCollections')
      .mockReturnValueOnce(20)
      .mockReturnValueOnce('')
      .mockReturnValueOnce('')
      .mockReturnValueOnce('created_at');

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      result: [
        { contract_address: '0x123', name: 'Collection 1' },
        { contract_address: '0x456', name: 'Collection 2' }
      ],
      cursor: null
    });

    const result = await executeCollectionsOperations.call(
      mockExecuteFunctions,
      [{ json: {} }]
    );

    expect(result).toHaveLength(1);
    expect(result[0].json.result).toHaveLength(2);
  });

  it('should update a collection successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('updateCollection')
      .mockReturnValueOnce('0x1234567890123456789012345678901234567890')
      .mockReturnValueOnce('Updated Collection Name')
      .mockReturnValueOnce('Updated Description')
      .mockReturnValueOnce('https://example.com/new-icon.png');

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      contract_address: '0x1234567890123456789012345678901234567890',
      name: 'Updated Collection Name',
      description: 'Updated Description'
    });

    const result = await executeCollectionsOperations.call(
      mockExecuteFunctions,
      [{ json: {} }]
    );

    expect(result).toHaveLength(1);
    expect(result[0].json.name).toBe('Updated Collection Name');
  });

  it('should handle errors gracefully when continueOnFail is true', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getCollection');
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

    const result = await executeCollectionsOperations.call(
      mockExecuteFunctions,
      [{ json: {} }]
    );

    expect(result).toHaveLength(1);
    expect(result[0].json.error).toBe('API Error');
  });

  it('should throw error when continueOnFail is false', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getCollection');
    mockExecuteFunctions.continueOnFail.mockReturnValue(false);
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

    await expect(
      executeCollectionsOperations.call(mockExecuteFunctions, [{ json: {} }])
    ).rejects.toThrow('API Error');
  });
});

describe('Assets Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({ 
        apiKey: 'test-key', 
        baseUrl: 'https://api.immutable.com/v1' 
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: { 
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn() 
      },
    };
  });

  describe('mintAsset operation', () => {
    it('should mint an asset successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('mintAsset')
        .mockReturnValueOnce('0x123')
        .mockReturnValueOnce('token123')
        .mockReturnValueOnce('blueprint456')
        .mockReturnValueOnce('[]');

      const mockResponse = { id: 'asset123', status: 'success' };
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeAssetsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://api.immutable.com/v1/assets',
        headers: {
          'x-api-key': 'test-key',
          'Content-Type': 'application/json',
        },
        body: {
          user: '0x123',
          token_id: 'token123',
          blueprint: 'blueprint456',
        },
        json: true,
      });
    });

    it('should handle mint asset error', async () => {
      mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('mintAsset');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

      await expect(executeAssetsOperations.call(mockExecuteFunctions, [{ json: {} }])).rejects.toThrow('API Error');
    });
  });

  describe('getAsset operation', () => {
    it('should get asset successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getAsset')
        .mockReturnValueOnce('0xtoken123')
        .mockReturnValueOnce('456')
        .mockReturnValueOnce(true);

      const mockResponse = { id: 'asset456', name: 'Test Asset' };
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeAssetsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.immutable.com/v1/assets/0xtoken123/456?include_fees=true',
        headers: {
          'x-api-key': 'test-key',
        },
        json: true,
      });
    });
  });

  describe('listAssets operation', () => {
    it('should list assets successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('listAssets')
        .mockReturnValueOnce(25)
        .mockReturnValueOnce('')
        .mockReturnValueOnce('0x123')
        .mockReturnValueOnce('imx')
        .mockReturnValueOnce('TestAsset')
        .mockReturnValueOnce('{}')
        .mockReturnValueOnce('name')
        .mockReturnValueOnce('asc')
        .mockReturnValueOnce('')
        .mockReturnValueOnce('');

      const mockResponse = { result: [], cursor: null };
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeAssetsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'GET',
          url: expect.stringContaining('/assets?'),
          headers: { 'x-api-key': 'test-key' },
        })
      );
    });
  });

  describe('updateAsset operation', () => {
    it('should update asset successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('updateAsset')
        .mockReturnValueOnce('0xtoken123')
        .mockReturnValueOnce('456')
        .mockReturnValueOnce('{"name": "Updated Asset"}');

      const mockResponse = { success: true };
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeAssetsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'PUT',
        url: 'https://api.immutable.com/v1/assets/0xtoken123/456',
        headers: {
          'x-api-key': 'test-key',
          'Content-Type': 'application/json',
        },
        body: {
          metadata: { name: 'Updated Asset' },
        },
        json: true,
      });
    });
  });
});

describe('Orders Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({ 
				apiKey: 'test-key', 
				baseUrl: 'https://api.immutable.com/v1' 
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: { 
				httpRequest: jest.fn(), 
				requestWithAuthentication: jest.fn() 
			},
		};
	});

	describe('createOrder', () => {
		it('should create order successfully', async () => {
			const mockResponse = { id: 'order123', status: 'active' };
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('createOrder')
				.mockReturnValueOnce('0x123')
				.mockReturnValueOnce('0xtoken1')
				.mockReturnValueOnce('1000')
				.mockReturnValueOnce('0xtoken2')
				.mockReturnValueOnce('500')
				.mockReturnValueOnce(1640995200);

			const result = await executeOrdersOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'POST',
				url: 'https://api.immutable.com/v1/orders',
				headers: {
					Authorization: 'Bearer test-key',
					'Content-Type': 'application/json',
				},
				body: {
					user: '0x123',
					token_buy: '0xtoken1',
					amount_buy: '1000',
					token_sell: '0xtoken2',
					amount_sell: '500',
					expiration_timestamp: 1640995200,
				},
				json: true,
			});
		});

		it('should handle createOrder error', async () => {
			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
			mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('createOrder');
			mockExecuteFunctions.continueOnFail.mockReturnValue(true);

			const result = await executeOrdersOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{ json: { error: 'API Error' }, pairedItem: { item: 0 } }]);
		});
	});

	describe('getOrder', () => {
		it('should get order successfully', async () => {
			const mockResponse = { id: 'order123', status: 'active' };
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getOrder')
				.mockReturnValueOnce('order123')
				.mockReturnValueOnce(true)
				.mockReturnValueOnce('1,2,3');

			const result = await executeOrdersOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
		});

		it('should handle getOrder error', async () => {
			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Order not found'));
			mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getOrder');
			mockExecuteFunctions.continueOnFail.mockReturnValue(true);

			const result = await executeOrdersOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{ json: { error: 'Order not found' }, pairedItem: { item: 0 } }]);
		});
	});

	describe('listOrders', () => {
		it('should list orders successfully', async () => {
			const mockResponse = { result: [{ id: 'order1' }, { id: 'order2' }], cursor: 'next-cursor' };
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('listOrders');

			const result = await executeOrdersOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
		});

		it('should handle listOrders error', async () => {
			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('List error'));
			mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('listOrders');
			mockExecuteFunctions.continueOnFail.mockReturnValue(true);

			const result = await executeOrdersOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{ json: { error: 'List error' }, pairedItem: { item: 0 } }]);
		});
	});

	describe('cancelOrder', () => {
		it('should cancel order successfully', async () => {
			const mockResponse = { id: 'order123', status: 'cancelled' };
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('cancelOrder')
				.mockReturnValueOnce('order123');

			const result = await executeOrdersOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'DELETE',
				url: 'https://api.immutable.com/v1/orders/order123',
				headers: {
					Authorization: 'Bearer test-key',
				},
				json: true,
			});
		});

		it('should handle cancelOrder error', async () => {
			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Cancel failed'));
			mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('cancelOrder');
			mockExecuteFunctions.continueOnFail.mockReturnValue(true);

			const result = await executeOrdersOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{ json: { error: 'Cancel failed' }, pairedItem: { item: 0 } }]);
		});
	});
});

describe('Trades Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({ 
        apiKey: 'test-key', 
        baseUrl: 'https://api.immutable.com/v1' 
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: { 
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn() 
      },
    };
  });

  it('should create a trade successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('createTrade')
      .mockReturnValueOnce('order123')
      .mockReturnValueOnce('0x1234567890123456789012345678901234567890')
      .mockReturnValueOnce({ fee_percentage: 2.5 });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      trade_id: 'trade123',
      order_id: 'order123',
      status: 'success',
    });

    const items = [{ json: {} }];
    const result = await executeTradesOperations.call(mockExecuteFunctions, items);

    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: 'https://api.immutable.com/v1/trades',
      headers: {
        'Authorization': 'Bearer test-key',
        'Content-Type': 'application/json',
      },
      body: {
        order_id: 'order123',
        user: '0x1234567890123456789012345678901234567890',
        fees: { fee_percentage: 2.5 },
      },
      json: true,
    });

    expect(result).toEqual([{
      json: {
        trade_id: 'trade123',
        order_id: 'order123',
        status: 'success',
      },
      pairedItem: { item: 0 },
    }]);
  });

  it('should get a trade successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getTrade')
      .mockReturnValueOnce('trade123');

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      trade_id: 'trade123',
      user: '0x1234567890123456789012345678901234567890',
      status: 'completed',
    });

    const items = [{ json: {} }];
    const result = await executeTradesOperations.call(mockExecuteFunctions, items);

    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://api.immutable.com/v1/trades/trade123',
      headers: {
        'Authorization': 'Bearer test-key',
      },
      json: true,
    });

    expect(result).toEqual([{
      json: {
        trade_id: 'trade123',
        user: '0x1234567890123456789012345678901234567890',
        status: 'completed',
      },
      pairedItem: { item: 0 },
    }]);
  });

  it('should list trades successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('listTrades')
      .mockReturnValue('');
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('listTrades')
      .mockReturnValueOnce(100)
      .mockReturnValueOnce('cursor123')
      .mockReturnValue('');

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      result: [
        { trade_id: 'trade1', status: 'completed' },
        { trade_id: 'trade2', status: 'pending' },
      ],
      cursor: 'next_cursor',
    });

    const items = [{ json: {} }];
    const result = await executeTradesOperations.call(mockExecuteFunctions, items);

    expect(result).toEqual([{
      json: {
        result: [
          { trade_id: 'trade1', status: 'completed' },
          { trade_id: 'trade2', status: 'pending' },
        ],
        cursor: 'next_cursor',
      },
      pairedItem: { item: 0 },
    }]);
  });

  it('should handle errors when continueOnFail is true', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getTrade');
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

    const items = [{ json: {} }];
    const result = await executeTradesOperations.call(mockExecuteFunctions, items);

    expect(result).toEqual([{
      json: { error: 'API Error' },
      pairedItem: { item: 0 },
    }]);
  });

  it('should throw error when continueOnFail is false', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getTrade');
    mockExecuteFunctions.continueOnFail.mockReturnValue(false);
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

    const items = [{ json: {} }];

    await expect(executeTradesOperations.call(mockExecuteFunctions, items))
      .rejects
      .toThrow('API Error');
  });

  it('should throw error for unknown operation', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('unknownOperation');

    const items = [{ json: {} }];

    await expect(executeTradesOperations.call(mockExecuteFunctions, items))
      .rejects
      .toThrow('Unknown operation: unknownOperation');
  });
});

describe('Transfers Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({ 
        apiKey: 'test-key', 
        baseUrl: 'https://api.immutable.com/v1' 
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: { 
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn() 
      },
    };
  });

  describe('createTransfer operation', () => {
    it('should create transfer successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('createTransfer')
        .mockReturnValueOnce('0x123')
        .mockReturnValueOnce('0x456')
        .mockReturnValueOnce('ERC721')
        .mockReturnValueOnce('1')
        .mockReturnValueOnce('0xtoken')
        .mockReturnValueOnce('1');

      const mockResponse = { transfer_id: 1, status: 'pending' };
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeTransfersOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://api.immutable.com/v1/transfers',
        headers: {
          'x-api-key': 'test-key',
          'Content-Type': 'application/json'
        },
        body: {
          sender: '0x123',
          receiver: '0x456',
          token: {
            type: 'ERC721',
            data: {
              token_id: '1',
              token_address: '0xtoken',
              quantity: '1'
            }
          }
        },
        json: true
      });
    });

    it('should handle errors in createTransfer', async () => {
      mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('createTransfer');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executeTransfersOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: { error: 'API Error' }, pairedItem: { item: 0 } }]);
    });
  });

  describe('getTransfer operation', () => {
    it('should get transfer successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getTransfer')
        .mockReturnValueOnce('123');

      const mockResponse = { id: 123, status: 'completed' };
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeTransfersOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.immutable.com/v1/transfers/123',
        headers: {
          'x-api-key': 'test-key'
        },
        json: true
      });
    });

    it('should handle errors in getTransfer', async () => {
      mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getTransfer');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Transfer not found'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executeTransfersOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: { error: 'Transfer not found' }, pairedItem: { item: 0 } }]);
    });
  });

  describe('listTransfers operation', () => {
    it('should list transfers successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('listTransfers')
        .mockReturnValue('');

      const mockResponse = { result: [], cursor: null };
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeTransfersOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.immutable.com/v1/transfers',
        headers: {
          'x-api-key': 'test-key'
        },
        qs: {},
        json: true
      });
    });

    it('should handle errors in listTransfers', async () => {
      mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('listTransfers');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executeTransfersOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: { error: 'API Error' }, pairedItem: { item: 0 } }]);
    });
  });
});

describe('Users Resource', () => {
  let mockExecuteFunctions: any;
  
  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({ 
        apiKey: 'test-key', 
        baseUrl: 'https://api.immutable.com/v1' 
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: { 
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn() 
      },
    };
  });
  
  test('should register user successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('registerUser')
      .mockReturnValueOnce('eth_sig_123')
      .mockReturnValueOnce('stark_sig_456');
    
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({ 
      accounts: ['0x123'], 
      status: 'registered' 
    });
    
    const result = await executeUsersOperations.call(mockExecuteFunctions, [{ json: {} }]);
    
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: 'https://api.immutable.com/v1/users',
      headers: {
        'Authorization': 'Bearer test-key',
        'Content-Type': 'application/json',
      },
      body: {
        eth_signature: 'eth_sig_123',
        stark_signature: 'stark_sig_456',
      },
      json: true,
    });
    
    expect(result).toEqual([{ 
      json: { accounts: ['0x123'], status: 'registered' }, 
      pairedItem: { item: 0 } 
    }]);
  });
  
  test('should get user details successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getUser')
      .mockReturnValueOnce('0x123');
    
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({ 
      accounts: ['0x123'],
      balances: [] 
    });
    
    const result = await executeUsersOperations.call(mockExecuteFunctions, [{ json: {} }]);
    
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://api.immutable.com/v1/users/0x123',
      headers: {
        'Authorization': 'Bearer test-key',
      },
      json: true,
    });
    
    expect(result).toEqual([{ 
      json: { accounts: ['0x123'], balances: [] }, 
      pairedItem: { item: 0 } 
    }]);
  });
  
  test('should get user balances successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getUserBalances')
      .mockReturnValueOnce('0x123')
      .mockReturnValueOnce(50)
      .mockReturnValueOnce('cursor123');
    
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({ 
      result: [],
      cursor: 'next_cursor' 
    });
    
    const result = await executeUsersOperations.call(mockExecuteFunctions, [{ json: {} }]);
    
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://api.immutable.com/v1/users/0x123/balances?page_size=50&cursor=cursor123',
      headers: {
        'Authorization': 'Bearer test-key',
      },
      json: true,
    });
    
    expect(result).toEqual([{ 
      json: { result: [], cursor: 'next_cursor' }, 
      pairedItem: { item: 0 } 
    }]);
  });
  
  test('should get user assets successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getUserAssets')
      .mockReturnValueOnce('0x123')
      .mockReturnValueOnce(25)
      .mockReturnValueOnce('')
      .mockReturnValueOnce('imx')
      .mockReturnValueOnce('TestNFT')
      .mockReturnValueOnce('')
      .mockReturnValueOnce('created_at')
      .mockReturnValueOnce('desc')
      .mockReturnValueOnce('0x456')
      .mockReturnValueOnce('2023-01-01T00:00:00Z');
    
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({ 
      result: [],
      cursor: 'assets_cursor' 
    });
    
    const result = await executeUsersOperations.call(mockExecuteFunctions, [{ json: {} }]);
    
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://api.immutable.com/v1/users/0x123/assets?page_size=25&status=imx&name=TestNFT&order_by=created_at&direction=desc&collection=0x456&updated_min_timestamp=2023-01-01T00%3A00%3A00Z',
      headers: {
        'Authorization': 'Bearer test-key',
      },
      json: true,
    });
    
    expect(result).toEqual([{ 
      json: { result: [], cursor: 'assets_cursor' }, 
      pairedItem: { item: 0 } 
    }]);
  });
  
  test('should handle errors when continue on fail is enabled', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getUser');
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
    
    const result = await executeUsersOperations.call(mockExecuteFunctions, [{ json: {} }]);
    
    expect(result).toEqual([{ 
      json: { error: 'API Error' }, 
      pairedItem: { item: 0 } 
    }]);
  });
  
  test('should throw error when continue on fail is disabled', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getUser');
    mockExecuteFunctions.continueOnFail.mockReturnValue(false);
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
    
    await expect(executeUsersOperations.call(mockExecuteFunctions, [{ json: {} }]))
      .rejects.toThrow('API Error');
  });
});

describe('Withdrawals Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				apiKey: 'test-key',
				baseUrl: 'https://api.immutable.com/v1',
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
			const mockResponse = { id: 'withdrawal-123', status: 'pending' };
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('createWithdrawal')
				.mockReturnValueOnce('0x123')
				.mockReturnValueOnce('ETH')
				.mockReturnValueOnce('')
				.mockReturnValueOnce('')
				.mockReturnValueOnce('1000000000000000000');

			const result = await executeWithdrawalsOperations.call(
				mockExecuteFunctions,
				[{ json: {} }],
			);

			expect(result).toEqual([
				{
					json: mockResponse,
					pairedItem: { item: 0 },
				},
			]);
		});

		it('should handle create withdrawal error', async () => {
			const error = new Error('API Error');
			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(error);
			mockExecuteFunctions.getNodeParameter.mockReturnValue('createWithdrawal');
			mockExecuteFunctions.continueOnFail.mockReturnValue(true);

			const result = await executeWithdrawalsOperations.call(
				mockExecuteFunctions,
				[{ json: {} }],
			);

			expect(result).toEqual([
				{
					json: { error: 'API Error' },
					pairedItem: { item: 0 },
				},
			]);
		});
	});

	describe('getWithdrawal', () => {
		it('should get withdrawal successfully', async () => {
			const mockResponse = { id: 'withdrawal-123', user: '0x123', status: 'completed' };
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getWithdrawal')
				.mockReturnValueOnce('withdrawal-123');

			const result = await executeWithdrawalsOperations.call(
				mockExecuteFunctions,
				[{ json: {} }],
			);

			expect(result).toEqual([
				{
					json: mockResponse,
					pairedItem: { item: 0 },
				},
			]);
		});
	});

	describe('listWithdrawals', () => {
		it('should list withdrawals successfully', async () => {
			const mockResponse = {
				result: [{ id: 'withdrawal-1' }, { id: 'withdrawal-2' }],
				cursor: 'next-cursor',
			};
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('listWithdrawals')
				.mockReturnValue('');

			const result = await executeWithdrawalsOperations.call(
				mockExecuteFunctions,
				[{ json: {} }],
			);

			expect(result).toEqual([
				{
					json: mockResponse,
					pairedItem: { item: 0 },
				},
			]);
		});
	});

	describe('completeWithdrawal', () => {
		it('should complete withdrawal successfully', async () => {
			const mockResponse = { id: 'withdrawal-123', status: 'completed' };
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('completeWithdrawal')
				.mockReturnValueOnce('withdrawal-123');

			const result = await executeWithdrawalsOperations.call(
				mockExecuteFunctions,
				[{ json: {} }],
			);

			expect(result).toEqual([
				{
					json: mockResponse,
					pairedItem: { item: 0 },
				},
			]);
		});
	});
});
});
