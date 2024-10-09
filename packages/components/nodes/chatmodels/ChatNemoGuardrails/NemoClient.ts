/*
import { AbortableAsyncIterator, parseJSON, post } 
import 'whatwg-fetch'
*/

export interface Config {
    baseUrl: string
    configurationId: string
}

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


  constructor(baseUrl: string, configurationId: string) {
    this.config = new ClientConfig(baseUrl,configurationId)
  }

  async chat(): Promise<any> {

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
        "config_id": this.config.configurationId,
        "messages": [
          {
            "role": "user",
            "content": "Hello! What can you do for me?"
          }
        ]
      });
      
      var requestOptions = {
          method: 'POST',
          body: raw,
          headers: myHeaders
      };
      
      return await fetch(`${this.config.baseUrl}/v1/chat/completions`, requestOptions)
        .then(response => response.text())
        .catch(error => console.log('error', error));

  }
}