/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class ImmutableNetwork implements ICredentialType {
	name = 'immutableNetwork';
	displayName = 'Immutable Network';
	documentationUrl = 'https://docs.immutable.com/';
	properties: INodeProperties[] = [
		{
			displayName: 'Network',
			name: 'network',
			type: 'options',
			options: [
				{
					name: 'zkEVM Mainnet',
					value: 'zkevmMainnet',
					description: 'Immutable zkEVM Mainnet (Production)',
				},
				{
					name: 'zkEVM Testnet',
					value: 'zkevmTestnet',
					description: 'Immutable zkEVM Testnet (Development)',
				},
				{
					name: 'Immutable X Mainnet',
					value: 'imxMainnet',
					description: 'Immutable X Mainnet (Production)',
				},
				{
					name: 'Immutable X Testnet',
					value: 'imxTestnet',
					description: 'Immutable X Testnet (Development)',
				},
			],
			default: 'zkevmTestnet',
			description: 'The Immutable network to connect to',
		},
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			description: 'Your Immutable API key from the Hub',
		},
		{
			displayName: 'Private Key',
			name: 'privateKey',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			description: 'Private key for signing transactions (optional)',
		},
		{
			displayName: 'Mnemonic',
			name: 'mnemonic',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			description: 'Mnemonic phrase for wallet (optional, alternative to private key)',
		},
		{
			displayName: 'Stark Private Key',
			name: 'starkPrivateKey',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			description: 'Stark private key for Immutable X operations (optional)',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				'x-api-key': '={{$credentials.apiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.network === "zkevmMainnet" ? "https://api.immutable.com" : $credentials.network === "zkevmTestnet" ? "https://api.sandbox.immutable.com" : $credentials.network === "imxMainnet" ? "https://api.x.immutable.com" : "https://api.sandbox.x.immutable.com"}}',
			url: '/v1/health',
			method: 'GET',
		},
	};
}
