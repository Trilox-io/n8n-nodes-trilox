import type { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { triloxApiRequest } from '../../GenericFunctions';

export async function escalate(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData> {
	const appId = this.getNodeParameter('appId', index) as string;
	const chatId = this.getNodeParameter('chatId', index) as string;
	const reason = this.getNodeParameter('reason', index, '') as string;

	// Build request body
	const body: any = {};
	if (reason) {
		body.reason = reason;
	}

	// Escalate conversation using chat ID
	const response = await triloxApiRequest.call(
		this,
		'POST',
		`/api/conversations/by-chat-id/${encodeURIComponent(chatId)}/escalate`,
		body,
		{ appId },
	);

	return {
		json: response.data || response,
		pairedItem: { item: index },
	};
}
