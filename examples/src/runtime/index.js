import { createServer } from 'node:http'
import { CopilotRuntime, copilotRuntimeNodeHttpEndpoint } from '@copilotkit/runtime'
import { BuiltInAgent } from '@copilotkit/runtime/v2'
import { createOpenAICompatible } from '@ai-sdk/openai-compatible'
import dotenv from 'dotenv'

dotenv.config() // Load environment variables from .env file

const port = Number(process.env.PORT || 4000)
const endpoint = process.env.COPILOT_RUNTIME_ENDPOINT || '/copilotkit'

const model = process.env.OPENAI_MODEL || 'Qwen/Qwen3.5-9B'
const baseURL = process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1'
const apiKey = process.env.OPENAI_API_KEY

const provider = createOpenAICompatible({
  name: 'openai-compatible',
  baseURL,
  apiKey,
})

const runtime = new CopilotRuntime({
  agents: {
    default: new BuiltInAgent({
      model: provider.chatModel(model),
      forwardSystemMessages: true,
      topP: 0.8,
      temperature: 0.7,
      presencePenalty: 1.5,
    })
  }
})

const handler = copilotRuntimeNodeHttpEndpoint({
  endpoint,
  runtime
})

const server = createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, x-copilotcloud-public-api-key, x-copilotkit-runtime-client-gql-version, x-copilotkit-runtime-client-version'
  )
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')

  if (req.method === 'OPTIONS') {
    res.statusCode = 204
    res.end()
    return
  }

  const requestUrl = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`)
  const requestPath = requestUrl.pathname.replace(/\/$/, '')
  const endpointPath = endpoint.replace(/\/$/, '')

  if (req.method === 'GET' && requestPath === endpointPath) {
    res.setHeader('Content-Type', 'application/json')
    res.statusCode = 200
    res.end(
      JSON.stringify({
        status: 'ok',
        endpoint,
        message: 'Send POST with JSON { method, params?, body? } to this endpoint.'
      })
    )
    return
  }

  handler(req, res)
})

server.listen(port, () => {
  console.log(`Copilot runtime listening on http://localhost:${port}${endpoint}`)
})
