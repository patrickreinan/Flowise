/*
import { AbortableAsyncIterator, parseJSON, post } 
import 'whatwg-fetch'
*/
import { Client } from 'langsmith';
import type {
  ChatRequest,
  ChatResponse,
  Config,
  ErrorResponse,
  Fetch,
  GenerateRequest,
  GenerateResponse
} from './interfaces.ts'
import { AbortableAsyncIterator, parseJSON, post } from './utils.js'

export class ClientConfig implements Config {
    baseUrl: string
    configurationId: string

    constructor(baseUrl: string, configurationId: string) {
        this.baseUrl = baseUrl;
        this.configurationId = configurationId;
    }
    
}

export class NemoClient {
  private readonly config: Config
  private readonly fetch: Fetch
  protected readonly ongoingStreamedRequests: AbortableAsyncIterator<object>[] = []

  constructor(baseUrl: string, configurationId: string) {
    this.config = new ClientConfig(baseUrl,configurationId)
  }

  // Abort any ongoing streamed requests to Ollama
  public abort() {
    for (const request of this.ongoingStreamedRequests) {
      request.abort()
    }
    this.ongoingStreamedRequests.length = 0
  }

  /**
   * Processes a request to the Nemo server. If the request is streamable, it will return a
   * AbortableAsyncIterator that yields the response messages. Otherwise, it will return the response
   * object.
   * @param endpoint {string} - The endpoint to send the request to.
   * @param request {object} - The request object to send to the endpoint.
   * @protected {T | AbortableAsyncIterator<T>} - The response object or a AbortableAsyncIterator that yields
   * response messages.
   * @throws {Error} - If the response body is missing or if the response is an error.
   * @returns {Promise<T | AbortableAsyncIterator<T>>} - The response object or a AbortableAsyncIterator that yields the streamed response.
   */
  protected async processStreamableRequest<T extends object>(
    endpoint: string,
    request: { stream?: boolean } & Record<string, any>,
  ): Promise<T | AbortableAsyncIterator<T>> {
    request.stream = request.stream ?? false
    const host = `${this.config.baseUrl}/api/${endpoint}`
    if (request.stream) {
      const abortController = new AbortController()
      const response = await post(this.fetch, host, request, {
        signal: abortController.signal
      })

      if (!response.body) {
        throw new Error('Missing body')
      }

      const itr = parseJSON<T | ErrorResponse>(response.body)
      const abortableAsyncIterator = new AbortableAsyncIterator(
        abortController,
        itr,
        () => {
          const i = this.ongoingStreamedRequests.indexOf(abortableAsyncIterator)
          if (i > -1) {
            this.ongoingStreamedRequests.splice(i, 1)
          }
        },
      )
      this.ongoingStreamedRequests.push(abortableAsyncIterator)
      return abortableAsyncIterator
    }
    const response = await post(this.fetch, host, request)
    return await response.json()
  }

  

  generate(
    request: GenerateRequest & { stream: true },
  ): Promise<AbortableAsyncIterator<GenerateResponse>>
  generate(request: GenerateRequest & { stream?: false }): Promise<GenerateResponse>
  /**
   * Generates a response from a text prompt.
   * @param request {GenerateRequest} - The request object.
   * @returns {Promise<GenerateResponse | AbortableAsyncIterator<GenerateResponse>>} - The response object or
   * an AbortableAsyncIterator that yields response messages.
   */
  async generate(
    request: GenerateRequest,
  ): Promise<GenerateResponse | AbortableAsyncIterator<GenerateResponse>> {
   
    return this.processStreamableRequest<GenerateResponse>('generate', request)
  }

  chat(
    request: ChatRequest & { stream: true },
  ): Promise<AbortableAsyncIterator<ChatResponse>>
  chat(request: ChatRequest & { stream?: false }): Promise<ChatResponse>
  /**
   * Chats with the model. The request object can contain messages with images that are either
   * Uint8Arrays or base64 encoded strings. The images will be base64 encoded before sending the
   * request.
   * @param request {ChatRequest} - The request object.
   * @returns {Promise<ChatResponse | AbortableAsyncIterator<ChatResponse>>} - The response object or an
   * AbortableAsyncIterator that yields response messages.
   */
  async chat(
    request: ChatRequest,
  ): Promise<ChatResponse | AbortableAsyncIterator<ChatResponse>> {
    return this.processStreamableRequest<ChatResponse>('chat', request)
  }

}
 
// export all types from the main entry point so that packages importing types dont need to specify paths
//export * from './interfaces.ts'