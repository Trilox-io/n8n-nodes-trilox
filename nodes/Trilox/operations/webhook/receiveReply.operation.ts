import type { IHookFunctions, IWebhookFunctions, IWebhookResponseData } from 'n8n-workflow';
import { triloxApiRequest } from '../../GenericFunctions';

export async function checkWebhookExists(
	this: IHookFunctions,
): Promise<boolean> {
	const appId = this.getNodeParameter('appId') as string;

	try {
		const response = await triloxApiRequest.call(this, 'GET', `/api/apps/${appId}`);
		const app = response.data || response;
		const webhookUrl = this.getNodeWebhookUrl('default');

		// Check if the webhook URL is already configured
		return app.replyWebhookUrl === webhookUrl;
	} catch (error) {
		return false;
	}
}

export async function createWebhook(
	this: IHookFunctions,
): Promise<boolean> {
	const appId = this.getNodeParameter('appId') as string;
	const webhookUrl = this.getNodeWebhookUrl('default');

	await triloxApiRequest.call(this, 'PATCH', `/api/apps/${appId}`, {
		replyWebhookUrl: webhookUrl,
	});

	return true;
}

export async function deleteWebhook(
	this: IHookFunctions,
): Promise<boolean> {
	const appId = this.getNodeParameter('appId') as string;

	try {
		await triloxApiRequest.call(this, 'PATCH', `/api/apps/${appId}`, {
			replyWebhookUrl: null,
		});
		return true;
	} catch (error) {
		// Don't throw error on delete failure
		return false;
	}
}

export async function receiveWebhook(
	this: IWebhookFunctions,
): Promise<IWebhookResponseData> {
	const bodyData = this.getBodyData();

	// Expected payload structure from Trilox:
	// {
	//   conversation_id: string,
	//   message_id: string,
	//   chat_id: string,
	//   channel: string,
	//   message: string,
	//   sender_name: string,
	//   sender_id: string,
	//   type?: 'text' | 'image' | 'file' | 'audio' | 'video',
	//   file_url?: string,
	//   metadata?: object,
	// }

	return {
		workflowData: [
			[
				{
					json: bodyData,
				},
			],
		],
	};
}
