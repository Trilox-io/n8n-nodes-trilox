import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class TriloxApi implements ICredentialType {
	name = 'triloxApi';
	displayName = 'Trilox API';
	documentationUrl = 'https://github.com/trilox/n8n-nodes-trilox#readme';
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
			placeholder: 'sk_proj_xxxxxxxxxxxxx',
			description: 'Your Trilox Project API Key. Get it from: Trilox Dashboard → Project Settings → API Keys',
		},
		{
			displayName: 'Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://api.trilox.io',
			required: true,
			description: 'Trilox API base URL. Change this only if you are using a self-hosted instance',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				'Authorization': '={{`Bearer ${$credentials.apiKey}`}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.baseUrl}}',
			url: '/api/projects',
			method: 'GET',
		},
	};
}
