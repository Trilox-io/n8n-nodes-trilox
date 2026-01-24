import type { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { triloxApiRequest } from '../../GenericFunctions';

export async function checkHandler(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData> {
	const appId = this.getNodeParameter('appId', index) as string;
	const chatId = this.getNodeParameter('chatId', index) as string;

	// Get conversation by chat ID
	const response = await triloxApiRequest.call(
		this,
		'GET',
		`/api/conversations/by-chat-id/${encodeURIComponent(chatId)}`,
		{},
		{ appId },
	);

	const conversation = response.data || response;

	// Return conversation data with handlerType field
	// Users can add a Switch node to route based on handlerType:
	// - 'bot': Bot is handling the conversation
	// - 'assigned_human': Human agent is assigned
	// - 'awaiting_human': Waiting for human agent assignment
	return {
		json: conversation,
		pairedItem: { item: index },
	};
}
