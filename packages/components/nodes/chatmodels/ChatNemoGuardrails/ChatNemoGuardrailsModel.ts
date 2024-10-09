import { BaseChatModel, type BaseChatModelParams } from "@langchain/core/language_models/chat_models";
import { ChatNemoGuardrailsCallOptions, ChatOllamaInput } from "./ChatNemoGuardrailsCallOptions";
import { AIMessageChunk, BaseMessage } from "@langchain/core/messages";
import { ChatNemoGuardrailsInput } from "./ChatNemoGuardrailsInput";
import { CallbackManager, CallbackManagerForLLMRun } from "@langchain/core/callbacks/manager";
import { ChatResult } from "@langchain/core/outputs";
import { FailedAttemptHandler } from "@langchain/core/utils/async_caller";


export declare class ChatNemoGuardrailsModel extends BaseChatModel<ChatNemoGuardrailsCallOptions, AIMessageChunk> implements ChatNemoGuardrailsInput {
    configurationId: string;
    id: string;
    baseUrl: string;
    callbackManager?: CallbackManager | undefined;
    maxConcurrency?: number | undefined;
    maxRetries?: number | undefined;
    onFailedAttempt?: FailedAttemptHandler | undefined;
    _llmType(): string;
    _generate(messages: BaseMessage[], options: this["ParsedCallOptions"], runManager?: CallbackManagerForLLMRun): Promise<ChatResult>;


/*
    
    constructor({ id, fields }: { id: string; fields: Partial<ChatNemoGuardrailsInput> & BaseChatModelParams; }) {
            
            super(fields)
            this.id = id
            this.configurationId = fields.configurationId?
            
    }
*/
    
}

