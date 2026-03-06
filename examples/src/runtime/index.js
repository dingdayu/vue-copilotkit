import { createServer } from 'node:http'
import { CopilotRuntime, OpenAIAdapter, copilotRuntimeNodeHttpEndpoint } from '@copilotkit/runtime'
import OpenAI from 'openai'
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env file

const port = Number(process.env.PORT || 4000)
const endpoint = process.env.COPILOT_RUNTIME_ENDPOINT || '/copilotkit'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_BASE_URL
})

const serviceAdapter = new OpenAIAdapter({
  openai,
  model: process.env.OPENAI_MODEL || 'gpt-4o-mini'
})

const runtime = new CopilotRuntime({})

const handler = copilotRuntimeNodeHttpEndpoint({
  endpoint,
  runtime,
  serviceAdapter
})

const server = createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-copilotcloud-public-api-key, x-copilotkit-runtime-client-gql-version, x-copilotkit-runtime-client-version");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");

  if (req.method === 'OPTIONS') {
    res.statusCode = 204
    res.end()
    return
  }

  handler(req, res)
})

server.listen(port, () => {
  console.log(`Copilot runtime listening on http://localhost:${port}${endpoint}`)
})
