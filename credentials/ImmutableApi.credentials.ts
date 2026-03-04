import {
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class ImmutableApi implements ICredentialType {
	name = 'immutableApi';
	displayName = 'Immutable API';
	documentationUrl = 'https://docs.immutable.com/docs/zkEVM/api/';
	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: true,
			description: 'The API key for Immutable API authentication. Get your API key from Immutable Hub.',
		},
		{
			displayName: 'Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://api.immutable.com',
			required: true,
			description: 'The base URL for the Immutable API',
		},
	];
}