import type {
	IExecuteFunctions,
	ILoadOptionsFunctions,
	INodeExecutionData,
	INodePropertyOptions,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

import { conversationOperations, conversationFields } from './descriptions/ConversationDescription';
import { triloxApiRequest } from './GenericFunctions';
import { recordMessage } from './operations/conversation/recordMessage.operation';
import { escalate } from './operations/conversation/escalate.operation';
import { checkHandler } from './operations/conversation/checkHandler.operation';

export class Trilox implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Trilox',
		name: 'trilox',
		icon: 'file:trilox.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with Trilox API for conversation management and human handover',
		defaults: {
			name: 'Trilox',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'triloxApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Conversation',
						value: 'conversation',
					},
				],
				default: 'conversation',
			},
			...conversationOperations,
			...conversationFields,
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
				'escalation',
				'chat',
				'bot to human',
				'live chat',
				'record message',
				'save message',
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

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		const output: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			try {
				if (resource === 'conversation') {
					if (operation === 'recordMessage') {
						const result = await recordMessage.call(this, i);
						output.push(result);
					} else if (operation === 'escalate') {
						const result = await escalate.call(this, i);
						output.push(result);
					} else if (operation === 'checkHandler') {
						const result = await checkHandler.call(this, i);
						output.push(result);
					}
				}
			} catch (error) {
				if (this.continueOnFail()) {
					const errorMessage = error instanceof Error ? error.message : 'Unknown error';
					output.push({
						json: {
							error: errorMessage,
						},
						pairedItem: { item: i },
					});
					continue;
				}
				throw error;
			}
		}

		return [output];
	}
}
