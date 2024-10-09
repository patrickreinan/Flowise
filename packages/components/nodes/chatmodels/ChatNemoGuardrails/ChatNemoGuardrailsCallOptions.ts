import { type BaseMessage } from "@langchain/core/messages";
import { BaseLanguageModelInput, ToolDefinition } from "@langchain/core/language_models/base";
import { CallbackManagerForLLMRun } from "@langchain/core/callbacks/manager";
import { type BaseChatModelParams, BaseChatModel, LangSmithParams, BaseChatModelCallOptions } from "@langchain/core/language_models/chat_models";
import { Ollama } from "ollama/browser";
import { ChatGenerationChunk, ChatResult } from "@langchain/core/outputs";
import { AIMessageChunk } from "@langchain/core/messages";
import type { ChatRequest as OllamaChatRequest } from "ollama";
import { StructuredToolInterface } from "@langchain/core/tools";
import { Runnable, RunnableToolLike } from "@langchain/core/runnables";
export interface ChatNemoGuardrailsCallOptions extends BaseChatModelCallOptions {
    /**
     * An array of strings to stop on.
     */
    stop?: string[];
    tools?: (StructuredToolInterface | RunnableToolLike | ToolDefinition)[];
}
export interface PullModelOptions {
    /**
     * Whether or not to stream the download.
     * @default true
     */
    stream?: boolean;
    insecure?: boolean;
    /**
     * Whether or not to log the status of the download
     * to the console.
     * @default false
     */
    logProgress?: boolean;
}
/**
 * Input to chat model class.
 */
export interface ChatOllamaInput extends BaseChatModelParams {
    /**
     * The model to invoke. If the model does not exist, it
     * will be pulled.
     * @default "llama3"
     */
    model?: string;
    /**
     * The host URL of the Ollama server.
     * @default "http://127.0.0.1:11434"
     */
    baseUrl?: string;
    /**
     * Whether or not to check the model exists on the local machine before
     * invoking it. If set to `true`, the model will be pulled if it does not
     * exist.
     * @default false
     */
    checkOrPullModel?: boolean;
    streaming?: boolean;
    numa?: boolean;
    numCtx?: number;
    numBatch?: number;
    numGpu?: number;
    mainGpu?: number;
    lowVram?: boolean;
    f16Kv?: boolean;
    logitsAll?: boolean;
    vocabOnly?: boolean;
    useMmap?: boolean;
    useMlock?: boolean;
    embeddingOnly?: boolean;
    numThread?: number;
    numKeep?: number;
    seed?: number;
    numPredict?: number;
    topK?: number;
    topP?: number;
    tfsZ?: number;
    typicalP?: number;
    repeatLastN?: number;
    temperature?: number;
    repeatPenalty?: number;
    presencePenalty?: number;
    frequencyPenalty?: number;
    mirostat?: number;
    mirostatTau?: number;
    mirostatEta?: number;
    penalizeNewline?: boolean;
    format?: string;
    /**
     * @default "5m"
     */
    keepAlive?: string | number;
}
