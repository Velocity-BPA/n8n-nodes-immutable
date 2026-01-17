/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import {
	IAuthenticateGeneric,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class ImmutablePassport implements ICredentialType {
	name = 'immutablePassport';
	displayName = 'Immutable Passport';
	documentationUrl = 'https://docs.immutable.com/docs/zkEVM/products/passport';
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
			displayName: 'Client ID',
			name: 'clientId',
			type: 'string',
			default: '',
			description: 'Your Immutable Passport client ID',
		},
		{
			displayName: 'Client Secret',
			name: 'clientSecret',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			description: 'Your Immutable Passport client secret',
		},
		{
			displayName: 'Redirect URI',
			name: 'redirectUri',
			type: 'string',
			default: '',
			description: 'OAuth redirect URI configured in Passport settings',
		},
		{
			displayName: 'Logout Redirect URI',
			name: 'logoutRedirectUri',
			type: 'string',
			default: '',
			description: 'URI to redirect to after logout',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				'x-client-id': '={{$credentials.clientId}}',
			},
		},
	};
}
