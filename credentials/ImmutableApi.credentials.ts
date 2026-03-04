import {
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class ImmutableApi implements ICredentialType {
	name = 'immutableApi';
	displayName = 'Immutable API';
	documentationUrl = 'https://docs.immutable.com/';
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
			description: 'API key for Immutable authentication. Create one in your Immutable Hub account.',
		},
		{
			displayName: 'API Base URL',
			name: 'apiBaseUrl',
			type: 'string',
			default: 'https://api.immutable.com',
			required: true,
			description: 'Base URL for the Immutable API',
		},
	];
}