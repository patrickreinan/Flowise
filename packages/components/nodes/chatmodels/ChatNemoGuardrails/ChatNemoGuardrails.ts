import { ICommonObject, IMultiModalOption, IndexingResult, INode, INodeData, INodeOptionsValue, INodeOutputsValue, INodeParams } from '../../../src/Interface'
import { BaseChatModel, type BaseChatModelParams } from "@langchain/core/language_models/chat_models";
import { AIMessage, AIMessageChunk, BaseMessage } from "@langchain/core/messages";
import { CallbackManager, CallbackManagerForLLMRun } from "@langchain/core/callbacks/manager";
import { ChatGeneration, ChatResult } from "@langchain/core/outputs";
import { FailedAttemptHandler } from "@langchain/core/utils/async_caller";
import { BaseChatModelCallOptions } from "@langchain/core/language_models/chat_models";
import { getBaseClasses, getCredentialData, getCredentialParam } from '../../../src/utils'
import { ClientConfig, NemoClient } from './NemoClient';

export interface ChatNemoGuardrailsCallOptions extends BaseChatModelCallOptions {
    /**
     * An array of strings to stop on.
     */
    stop?: string[];

}


export interface ChatNemoGuardrailsInput extends BaseChatModelParams {

    configurationId?: string;
    /**
     * The host URL of the Ollama server.
     * @default "http://localhost:8000"
     */
    baseUrl?: string;
    
}

class ChatNemoGuardrailsModel extends BaseChatModel<ChatNemoGuardrailsCallOptions, AIMessageChunk> implements ChatNemoGuardrailsInput {
    
	configurationId: string;
	id: string;
	baseUrl: string;
	callbackManager?: CallbackManager | undefined;
	maxConcurrency?: number | undefined;
	maxRetries?: number | undefined;
	onFailedAttempt?: FailedAttemptHandler | undefined;
    client: NemoClient;
    

    _llmType(): string {
        // Add your implementation here
        return "nemo-guardrails";
    }

    _generate(messages: BaseMessage[], options: this['ParsedCallOptions'], runManager?: CallbackManagerForLLMRun): Promise<ChatResult> {

        
        async function result(client: NemoClient) :  Promise<ChatResult> {

          

            const nonChunkMessage = new AIMessage({
                id: "id",
                content: messages[0].content,
                tool_calls: [],
              });

              
      return {
            generations: [
              {
                text: "text",
                message: nonChunkMessage,
              },
            ],
          };
        }
        return result(this.client);
        
    }
	

	constructor({ id, fields }: { id: string; fields: Partial<ChatNemoGuardrailsInput> & BaseChatModelParams; }) {
		super(fields);
		this.id = id;
		this.configurationId = fields.configurationId ?? '';
		this.baseUrl = fields.baseUrl ?? '';
		this.callbackManager = fields.callbackManager;
		this.maxConcurrency = fields.maxConcurrency;
		this.maxRetries = fields.maxRetries;
		this.onFailedAttempt = fields.onFailedAttempt;
        this.client = new NemoClient(this.baseUrl, this.configurationId)
	}
}

class ChatNemoGuardrailsChatModel implements INode {
    label: string
    name: string
    version: number
    type: string
    icon: string
    category: string
    description: string
    baseClasses: string[]
    credential: INodeParams
    inputs: INodeParams[]

    constructor() { 
        this.label = 'Chat Nemo Guardrails'
        this.name = 'chatNemoGuardrails'
        this.version = 1.0
        this.type = 'ChatNemoGuardrails'
        this.icon = 'nemo.svg'
        this.category = 'Chat Models'
        this.description = 'Access models through the Nemo Guardrails API'
        this.baseClasses = [this.type, ...getBaseClasses(ChatNemoGuardrailsModel)]

        this.inputs = [
            {
                label: 'Configuration ID',
                name: 'configurationId',
                type: 'string',
                optional: false
                
            },
            {
                label: 'Base URL',
                name: 'baseUrl',
                type: 'string',
                optional: false
            }
        ]


    }

    async init(nodeData: INodeData, _: string, options: ICommonObject): Promise<any> {
        const configurationId = nodeData.inputs?.configurationId
        const baseUrl = nodeData.inputs?.baseUrl


        const obj: Partial<ChatNemoGuardrailsInput> = {
            configurationId: configurationId,
            baseUrl: baseUrl
        }

        const model = new ChatNemoGuardrailsModel({ id: nodeData.id, fields: obj })
        return model

    }   


}

module.exports = { nodeClass: ChatNemoGuardrailsChatModel }