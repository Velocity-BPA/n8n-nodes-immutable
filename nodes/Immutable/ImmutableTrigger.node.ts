/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
	IHookFunctions,
	IWebhookFunctions,
	INodeType,
	INodeTypeDescription,
	IWebhookResponseData,
	INodePropertyOptions,
} from 'n8n-workflow';

export class ImmutableTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Immutable Trigger',
		name: 'immutableTrigger',
		icon: 'file:immutable.svg',
		group: ['trigger'],
		version: 1,
		subtitle: '={{$parameter["event"]}}',
		description: 'Triggers on Immutable platform events - NFT, marketplace, and gaming events',
		defaults: {
			name: 'Immutable Trigger',
		},
		inputs: [],
		outputs: ['main'] as const,
		credentials: [
			{
				name: 'immutableNetwork',
				required: true,
			},
		],
		webhooks: [
			{
				name: 'default',
				httpMethod: 'POST',
				responseMode: 'onReceived',
				path: 'webhook',
			},
		],
		properties: [
			{
				displayName: 'Trigger On',
				name: 'event',
				type: 'options',
				noDataExpression: true,
				options: [
					// NFT Events
					{ name: 'NFT Created', value: 'nft_created' },
					{ name: 'NFT Transferred', value: 'nft_transferred' },
					{ name: 'NFT Burned', value: 'nft_burned' },
					{ name: 'NFT Listed', value: 'nft_listed' },
					{ name: 'NFT Sold', value: 'nft_sold' },
					{ name: 'Metadata Updated', value: 'metadata_updated' },
					// Order Events
					{ name: 'Order Created', value: 'order_created' },
					{ name: 'Order Cancelled', value: 'order_cancelled' },
					{ name: 'Order Filled', value: 'order_filled' },
					{ name: 'Bid Received', value: 'bid_received' },
					// Trade Events
					{ name: 'Trade Executed', value: 'trade_executed' },
					// Collection Events
					{ name: 'Collection Created', value: 'collection_created' },
					{ name: 'Collection Updated', value: 'collection_updated' },
					// Bridge Events
					{ name: 'Deposit Completed', value: 'deposit_completed' },
					{ name: 'Withdrawal Completed', value: 'withdrawal_completed' },
					// Gaming Events
					{ name: 'Item Crafted', value: 'item_crafted' },
					{ name: 'Primary Sale Purchase', value: 'primary_sale_purchase' },
					// All Events
					{ name: 'All Events', value: 'all' },
				] as INodePropertyOptions[],
				default: 'nft_created',
				description: 'The event to trigger on',
			},
			{
				displayName: 'Filters',
				name: 'filters',
				type: 'collection',
				placeholder: 'Add Filter',
				default: {},
				options: [
					{
						displayName: 'Collection Address',
						name: 'collectionAddress',
						type: 'string',
						default: '',
						description: 'Filter by collection address',
					},
					{
						displayName: 'User Address',
						name: 'userAddress',
						type: 'string',
						default: '',
						description: 'Filter by user address',
					},
					{
						displayName: 'Token ID',
						name: 'tokenId',
						type: 'string',
						default: '',
						description: 'Filter by specific token ID',
					},
				],
			},
		],
	};

	webhookMethods = {
		default: {
			async checkExists(this: IHookFunctions): Promise<boolean> {
				const webhookData = this.getWorkflowStaticData('node');
				return webhookData.webhookId !== undefined;
			},

			async create(this: IHookFunctions): Promise<boolean> {
				const webhookUrl = this.getNodeWebhookUrl('default');
				const webhookData = this.getWorkflowStaticData('node');

				// Store webhook URL for reference
				webhookData.webhookUrl = webhookUrl;
				webhookData.webhookId = `immutable_${Date.now()}`;

				// Note: In production, you would register this webhook with Immutable's webhook service
				// via their Hub API. For now, this creates a webhook endpoint that can receive events.

				return true;
			},

			async delete(this: IHookFunctions): Promise<boolean> {
				const webhookData = this.getWorkflowStaticData('node');

				// Clean up webhook data
				delete webhookData.webhookId;
				delete webhookData.webhookUrl;

				return true;
			},
		},
	};

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		const body = this.getBodyData();
		const event = this.getNodeParameter('event') as string;
		const filters = this.getNodeParameter('filters') as {
			collectionAddress?: string;
			userAddress?: string;
			tokenId?: string;
		};

		// Parse the incoming event
		const eventData = body as {
			type?: string;
			event_type?: string;
			data?: Record<string, unknown>;
			timestamp?: string;
		};

		const eventType = eventData.type || eventData.event_type || 'unknown';

		// Filter by event type if not "all"
		if (event !== 'all') {
			const eventTypeMap: Record<string, string[]> = {
				nft_created: ['nft.created', 'mint.created'],
				nft_transferred: ['nft.transferred', 'transfer.created'],
				nft_burned: ['nft.burned'],
				nft_listed: ['order.created'],
				nft_sold: ['trade.created'],
				metadata_updated: ['nft.updated'],
				order_created: ['order.created'],
				order_cancelled: ['order.cancelled'],
				order_filled: ['order.filled'],
				bid_received: ['order.created'],
				trade_executed: ['trade.created'],
				collection_created: ['collection.created'],
				collection_updated: ['collection.updated'],
				deposit_completed: ['deposit.created', 'deposit.updated'],
				withdrawal_completed: ['withdrawal.created', 'withdrawal.updated'],
				item_crafted: ['mint.created'],
				primary_sale_purchase: ['trade.created'],
			};

			const allowedTypes = eventTypeMap[event] || [];
			if (allowedTypes.length > 0 && !allowedTypes.includes(eventType)) {
				return { webhookResponse: { status: 200, body: 'Event filtered out' } };
			}
		}

		// Apply filters
		if (filters.collectionAddress && eventData.data) {
			const collectionMatch =
				eventData.data.collection_address === filters.collectionAddress ||
				eventData.data.contract_address === filters.collectionAddress ||
				eventData.data.token_address === filters.collectionAddress;
			if (!collectionMatch) {
				return { webhookResponse: { status: 200, body: 'Filtered out by collection' } };
			}
		}

		if (filters.userAddress && eventData.data) {
			const userMatch =
				eventData.data.user === filters.userAddress ||
				eventData.data.from === filters.userAddress ||
				eventData.data.to === filters.userAddress ||
				eventData.data.owner === filters.userAddress;
			if (!userMatch) {
				return { webhookResponse: { status: 200, body: 'Filtered out by user' } };
			}
		}

		if (filters.tokenId && eventData.data) {
			if (eventData.data.token_id !== filters.tokenId) {
				return { webhookResponse: { status: 200, body: 'Filtered out by token ID' } };
			}
		}

		return {
			workflowData: [
				[
					{
						json: {
							event: event,
							eventType: eventType,
							timestamp: eventData.timestamp || new Date().toISOString(),
							data: eventData.data || eventData,
							raw: body,
						},
					},
				],
			],
		};
	}
}
