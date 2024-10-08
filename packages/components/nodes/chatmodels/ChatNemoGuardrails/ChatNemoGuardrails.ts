import { ICommonObject, IMultiModalOption, IndexingResult, INode, INodeData, INodeOptionsValue, INodeOutputsValue, INodeParams } from '../../../src/Interface'


class ChatNemoGuardrails implements INode {
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
        this.baseClasses = [this.type]

        this.inputs = [
            {
                label: 'Configuration ID',
                name: 'configId',
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
        const configId = nodeData.inputs?.configId
        const baseUrl = nodeData.inputs?.baseUrl

        const obj = {
            configId,
            baseUrl
        }

    }   


}

module.exports = { nodeClass: ChatNemoGuardrails }