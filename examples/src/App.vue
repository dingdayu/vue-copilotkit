<template>
  <ProvideApiKeyDialog v-model:apiKey="state.apiKey" v-model:runtimeUrl="state.runtimeUrl" />
  <div class="container">
    <CopilotKit :publicApiKey="state.apiKey || 'undefined'" :key="state.apiKey || 'undefined'" :runtimeUrl="state.runtimeUrl">
      <RouterView />
    </CopilotKit>
  </div>
</template>

<script setup lang="ts">
import { CopilotKit } from '@dingdayu/vue-copilotkit-core'
import ProvideApiKeyDialog from './components/ProvideApiKeyDialog.tsx'
import { reactive } from 'vue';

const state = reactive({
  apiKey:localStorage.getItem("apiKey")||''  ,
  runtimeUrl: localStorage.getItem("runtimeUrl")||'http://10.0.7.105:4002/copilotkit'
})
</script>
