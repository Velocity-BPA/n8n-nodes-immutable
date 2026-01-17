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

export class ImmutableApi implements ICredentialType {
	name = 'immutableApi';
	displayName = 'Immutable API';
	documentationUrl = 'https://docs.immutable.com/';
	properties: INodeProperties[] = [
		{
			displayName: 'Environment',
			name: 'environment',
			type: 'options',
			options: [
				{
					name: 'Production',
					value: 'production',
					description: 'Production environment',
				},
				{
					name: 'Sandbox',
					value: 'sandbox',
					description: 'Sandbox/testing environment',
				},
			],
			default: 'sandbox',
			description: 'The environment to use',
		},
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			description: 'Your Immutable API key',
		},
		{
			displayName: 'Publishable Key',
			name: 'publishableKey',
			type: 'string',
			default: '',
			description: 'Your Immutable publishable key (for client-side operations)',
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
			baseURL: '={{$credentials.environment === "production" ? "https://api.immutable.com" : "https://api.sandbox.immutable.com"}}',
			url: '/v1/health',
			method: 'GET',
		},
	};
}
