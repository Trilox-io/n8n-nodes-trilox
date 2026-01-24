import type {
	IHookFunctions,
	INodeType,
	INodeTypeDescription,
	IWebhookFunctions,
	IWebhookResponseData,
	INodePropertyOptions,
	ILoadOptionsFunctions,
} from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

import { triggerOperations, triggerFields } from './descriptions/TriggerDescription';
import { triloxApiRequest } from './GenericFunctions';
import {
	checkWebhookExists,
	createWebhook,
	deleteWebhook,
	receiveWebhook,
} from './operations/webhook/receiveReply.operation';

export class TriloxTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Trilox Trigger',
		name: 'triloxTrigger',
		icon: 'file:trilox.svg',
		group: ['trigger'],
		version: 1,
		subtitle: '={{$parameter["events"].join(", ")}}',
		description: 'Starts the workflow when a support agent sends a message',
		defaults: {
			name: 'Trilox Trigger',
		},
		inputs: [],
		outputs: ['main'],
		credentials: [
			{
				name: 'triloxApi',
				required: true,
			},
		],
		webhooks: [
			{
				name: 'default',
				httpMethod: 'POST',
				responseMode: 'onReceived',
				path: 'trilox-webhook',
			},
		],
		properties: [
			...triggerOperations,
			...triggerFields,
		],
		codex: {
			categories: ['Communication'],
			subcategories: {
				Communication: ['Customer Support'],
			},
			resources: {
				primaryDocumentation: [
					{
						url: 'https://github.com/Trilox-io/n8n-nodes-trilox#readme',
					},
				],
			},
			alias: [
				'customer support',
				'human handover',
				'agent reply',
				'chat',
				'live chat',
				'agent message',
			],
		},
	};

	methods = {
		loadOptions: {
			async getApps(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				try {
					// Call /api/apps which automatically returns apps for the API key's project
					const response = await triloxApiRequest.call(this, 'GET', '/api/apps');
					const apps = response.data || response;

					if (!Array.isArray(apps)) {
						throw new NodeOperationError(
							this.getNode(),
							'Invalid response format from Trilox API',
						);
					}

					if (apps.length === 0) {
						// Return a helpful message if no apps found
						return [
							{
								name: 'No apps found - Create an app in your Trilox project first',
								value: '',
							},
						];
					}

					return apps.map((app: any) => ({
						name: app.name,
						value: app.id,
					}));
				} catch (error) {
					const errorMessage = error instanceof Error ? error.message : 'Unknown error';
					throw new NodeOperationError(
						this.getNode(),
						`Failed to load apps: ${errorMessage}. Make sure your API key is valid and associated with a project.`,
					);
				}
			},
		},
	};

	webhookMethods = {
		default: {
			async checkExists(this: IHookFunctions): Promise<boolean> {
				return await checkWebhookExists.call(this);
			},
			async create(this: IHookFunctions): Promise<boolean> {
				return await createWebhook.call(this);
			},
			async delete(this: IHookFunctions): Promise<boolean> {
				return await deleteWebhook.call(this);
			},
		},
	};

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		return await receiveWebhook.call(this);
	}
}
