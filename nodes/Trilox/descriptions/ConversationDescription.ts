import type { INodeProperties } from 'n8n-workflow';

export const conversationOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['conversation'],
			},
		},
		options: [
			{
				name: 'Record Message',
				value: 'recordMessage',
				description: 'Record a message in the conversation database',
				action: 'Record a message',
			},
			{
				name: 'Escalate to Human',
				value: 'escalate',
				description: 'Escalate conversation to human agent',
				action: 'Escalate to human',
			},
			{
				name: 'Check Handler',
				value: 'checkHandler',
				description: 'Check who is handling the conversation and route accordingly',
				action: 'Check handler',
			},
		],
		default: 'recordMessage',
	},
];

export const conversationFields: INodeProperties[] = [
	// Common fields
	{
		displayName: 'App',
		name: 'appId',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getApps',
		},
		displayOptions: {
			show: {
				resource: ['conversation'],
			},
		},
		default: '',
		required: true,
		description: 'Select the Trilox app (chat inbox). Apps are automatically loaded from the project associated with your API key.',
	},
	{
		displayName: 'Chat ID',
		name: 'chatId',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['conversation'],
			},
		},
		default: '',
		required: true,
		placeholder: 'Unique identifier',
		description: 'Unique identifier for the conversation',
	},

	// Record Message fields
	{
		displayName: 'Sender Type',
		name: 'senderType',
		type: 'options',
		options: [
			{
				name: 'Bot',
				value: 'bot',
				description: 'Automated bot response',
			},
			{
				name: 'Visitor',
				value: 'visitor',
				description: 'Customer/visitor message',
			},
		],
		displayOptions: {
			show: {
				resource: ['conversation'],
				operation: ['recordMessage'],
			},
		},
		default: 'bot',
		required: true,
		description: 'Type of sender for the message. Use Bot for automated responses, Visitor for customer messages.',
	},
	{
		displayName: 'Channel',
		name: 'channel',
		type: 'options',
		options: [
			{
				name: 'n8n Chat',
				value: 'n8n_chat',
				description: 'Message from n8n chat interface',
			},
			{
				name: 'Telegram',
				value: 'telegram',
				description: 'Message from Telegram',
			},
			{
				name: 'WhatsApp',
				value: 'whatsapp',
				description: 'Message from WhatsApp',
			},
			{
				name: 'Messenger',
				value: 'messenger',
				description: 'Message from Facebook Messenger',
			},
			{
				name: 'Instagram',
				value: 'instagram',
				description: 'Message from Instagram Direct',
			},
			{
				name: 'Widget',
				value: 'widget',
				description: 'Message from chat widget',
			},
			{
				name: 'API',
				value: 'api',
				description: 'Message from API integration',
			},
		],
		displayOptions: {
			show: {
				resource: ['conversation'],
				operation: ['recordMessage'],
			},
		},
		default: 'n8n_chat',
		description: 'Select the communication channel for this message. This helps track which platform the message originated from.',
	},
	{
		displayName: 'Message',
		name: 'message',
		type: 'string',
		typeOptions: {
			rows: 4,
		},
		displayOptions: {
			show: {
				resource: ['conversation'],
				operation: ['recordMessage'],
			},
		},
		default: '',
		required: true,
		placeholder: 'Your message content',
		description: 'Message content to record (1-10000 characters)',
	},
	{
		displayName: 'Visitor Name',
		name: 'visitorName',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['conversation'],
				operation: ['recordMessage'],
				senderType: ['visitor'],
			},
		},
		default: '',
		placeholder: 'Visitor full name',
		description: 'Name of the visitor (optional)',
	},
	{
		displayName: 'Visitor Metadata',
		name: 'visitorMetadata',
		type: 'json',
		displayOptions: {
			show: {
				resource: ['conversation'],
				operation: ['recordMessage'],
				senderType: ['visitor'],
			},
		},
		default: '{}',
		placeholder: '{"key": "value"}',
		description: 'Additional visitor metadata as JSON object (optional)',
	},

	// Escalate fields
	{
		displayName: 'Escalation Reason',
		name: 'reason',
		type: 'string',
		typeOptions: {
			rows: 3,
		},
		displayOptions: {
			show: {
				resource: ['conversation'],
				operation: ['escalate'],
			},
		},
		default: '',
		placeholder: 'Reason for escalating to human agent',
		description: 'Optional reason for escalation (helps human agents understand context)',
	},
];
