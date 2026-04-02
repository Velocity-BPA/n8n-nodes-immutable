import {
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class ImmutableApi implements ICredentialType {
	name = 'immutableApi';
	displayName = 'Immutable API';
	documentationUrl = 'https://docs.immutable.com';
	properties: INodeProperties[] = [
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
			description: 'The environment to connect to',
		},
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			description: 'The API key for accessing Immutable X. Get your API key from Immutable Hub.',
			required: true,
		},
		{
			displayName: 'API Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://api.immutable.com/v1',
			description: 'Base URL for the Immutable API',
			required: true,
		},
	];
}