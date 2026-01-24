import type { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { triloxApiRequest, triloxWebhookRequest } from '../../GenericFunctions';

export async function recordMessage(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData> {
	const appId = this.getNodeParameter('appId', index) as string;
	const chatId = this.getNodeParameter('chatId', index) as string;
	const senderType = this.getNodeParameter('senderType', index) as string;
	const channel = this.getNodeParameter('channel', index, 'api') as string;
	const message = this.getNodeParameter('message', index) as string;
	const visitorName = this.getNodeParameter('visitorName', index, '') as string;
	const visitorMetadataStr = this.getNodeParameter('visitorMetadata', index, '{}') as string;

	// Validate message length
	if (message.length < 1 || message.length > 10000) {
		throw new NodeOperationError(
			this.getNode(),
			'Message must be between 1 and 10,000 characters',
			{ itemIndex: index },
		);
	}

	// Get app details to retrieve app_key
	const appResponse = await triloxApiRequest.call(this, 'GET', `/api/apps/${appId}`);
	const appKey = appResponse.data?.appKey || appResponse.appKey;

	if (!appKey) {
		throw new NodeOperationError(
			this.getNode(),
			`Failed to retrieve app key for app ${appId}`,
			{ itemIndex: index },
		);
	}

	// Build request body
	const body: any = {
		chat_id: chatId,
		message: message.trim(),
		sender_type: senderType,
		channel: channel,
	};

	if (senderType === 'visitor') {
		if (visitorName) {
			body.visitor_name = visitorName;
		}

		// Parse visitor metadata
		if (visitorMetadataStr && visitorMetadataStr !== '{}') {
			try {
				body.visitor_metadata = JSON.parse(visitorMetadataStr);
			} catch (error) {
				const errorMessage = error instanceof Error ? error.message : 'Unknown error';
				throw new NodeOperationError(
					this.getNode(),
					`Invalid JSON in visitor metadata: ${errorMessage}`,
					{ itemIndex: index },
				);
			}
		}
	}

	// Record message via webhook endpoint
	const response = await triloxWebhookRequest.call(this, appKey, body);

	return {
		json: response.data || response,
		pairedItem: { item: index },
	};
}
