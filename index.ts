import type { ICredentialType, INodeType } from 'n8n-workflow';

import { Trilox } from './nodes/Trilox/Trilox.node';
import { TriloxTrigger } from './nodes/Trilox/TriloxTrigger.node';
import { TriloxApi } from './credentials/TriloxApi.credentials';

const nodeTypes: Record<string, new () => INodeType> = {
	Trilox,
	TriloxTrigger,
};

const credentialTypes: Record<string, new () => ICredentialType> = {
	TriloxApi,
};

export { nodeTypes, credentialTypes };
