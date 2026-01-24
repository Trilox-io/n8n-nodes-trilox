import type {
	IDataObject,
	IExecuteFunctions,
	IHookFunctions,
	ILoadOptionsFunctions,
	IHttpRequestMethods,
	IRequestOptions,
} from 'n8n-workflow';

export async function triloxApiRequest(
	this: IExecuteFunctions | ILoadOptionsFunctions | IHookFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body: IDataObject = {},
	qs: IDataObject = {},
): Promise<any> {
	const credentials = await this.getCredentials('triloxApi');
	const baseUrl = credentials.baseUrl as string;

	const options: IRequestOptions = {
		method,
		url: `${baseUrl}${endpoint}`,
		headers: {
			'Authorization': `Bearer ${credentials.apiKey}`,
			'Content-Type': 'application/json',
		},
		qs,
		body,
		json: true,
	};

	try {
		return await this.helpers.request(options);
	} catch (error) {
		throw error;
	}
}

export async function triloxWebhookRequest(
	this: IExecuteFunctions,
	appKey: string,
	body: IDataObject = {},
): Promise<any> {
	const credentials = await this.getCredentials('triloxApi');
	const baseUrl = credentials.baseUrl as string;

	const options: IRequestOptions = {
		method: 'POST',
		url: `${baseUrl}/api/webhooks/${appKey}/message`,
		body,
		json: true,
	};

	try {
		return await this.helpers.request(options);
	} catch (error) {
		throw error;
	}
}
