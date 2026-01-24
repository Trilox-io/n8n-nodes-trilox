import type { INodeProperties } from 'n8n-workflow';

export const triggerOperations: INodeProperties[] = [
	{
		displayName: 'Trigger On',
		name: 'events',
		type: 'multiOptions',
		noDataExpression: true,
		required: true,
		options: [
			{
				name: 'Agent Message',
				value: 'agent_message',
				description: 'Triggers when a support agent sends a message',
			},
		],
		default: ['agent_message'],
	},
];

export const triggerFields: INodeProperties[] = [
	{
		displayName: 'App',
		name: 'appId',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getApps',
		},
		default: '',
		required: true,
		description: 'Select the Trilox app to receive agent messages from',
	},
];
