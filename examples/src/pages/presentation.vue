<template>
  <div class="presentation-container">
    <div class="presentation-header">
      <h2 class="title">🎤 Presentation Demo</h2>
    </div>
    <div class="presentation-wrapper">
      <div class="slide" :class="{ active: currentSlide === index }" v-for="(slide, index) in slides" :key="index">
        <div class="slide-content">
          <h3 class="slide-title">{{ slide.title }}</h3>
          <div class="slide-body" v-html="slide.content"></div>
        </div>
      </div>
    </div>
    <div class="presentation-controls">
      <el-button @click="prevSlide" :disabled="currentSlide === 0">Previous</el-button>
      <span class="slide-indicator">{{ currentSlide + 1 }} / {{ slides.length }}</span>
      <el-button @click="nextSlide" :disabled="currentSlide === slides.length - 1">Next</el-button>
    </div>
    <div class="presentation-actions">
      <el-button @click="addSlide">Add Slide</el-button>
      <el-button @click="editCurrentSlide" :disabled="slides.length === 0">Edit Current Slide</el-button>
      <el-button @click="deleteCurrentSlide" :disabled="slides.length === 0">Delete Slide</el-button>
    </div>
    <CopilotPopup />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { CopilotPopup, useCopilotChatSuggestions } from '@dingdayu/vue-copilotkit-ui'
import { useCopilotReadable, useCopilotAction } from '@dingdayu/vue-copilotkit-core'

interface Slide {
  title: string
  content: string
}

const slides = ref<Slide[]>([
  {
    title: 'Welcome',
    content: '<p>Welcome to this presentation demo!</p><p>This is a simple slide deck powered by CopilotKit.</p>'
  },
  {
    title: 'Features',
    content: '<ul><li>AI-Powered Assistance</li><li>Smart Slide Management</li><li>Real-time Suggestions</li></ul>'
  },
  {
    title: 'Thank You',
    content: '<p>Thank you for watching!</p><p>Feel free to ask the AI assistant for help.</p>'
  }
])

const currentSlide = ref(0)

const prevSlide = () => {
  if (currentSlide.value > 0) {
    currentSlide.value--
  }
}

const nextSlide = () => {
  if (currentSlide.value < slides.value.length - 1) {
    currentSlide.value++
  }
}

const addSlide = () => {
  slides.value.push({
    title: `Slide ${slides.value.length + 1}`,
    content: '<p>New slide content</p>'
  })
}

const editCurrentSlide = () => {
  if (slides.value[currentSlide.value]) {
    const newTitle = prompt('Enter slide title:', slides.value[currentSlide.value].title)
    const newContent = prompt('Enter slide content (HTML):', slides.value[currentSlide.value].content)
    if (newTitle !== null) {
      slides.value[currentSlide.value].title = newTitle
    }
    if (newContent !== null) {
      slides.value[currentSlide.value].content = newContent
    }
  }
}

const deleteCurrentSlide = () => {
  if (slides.value[currentSlide.value]) {
    slides.value.splice(currentSlide.value, 1)
    if (currentSlide.value >= slides.value.length) {
      currentSlide.value = Math.max(0, slides.value.length - 1)
    }
  }
}

useCopilotReadable({
  description: 'The current presentation slides. Each slide has a title and HTML content.',
  value: slides.value
})

useCopilotReadable({
  description: 'The currently active slide index (0-based)',
  value: currentSlide.value
})

useCopilotAction({
  name: 'setSlideTitle',
  description: 'Set the title of the current slide',
  parameters: [
    {
      name: 'title',
      type: 'string',
      description: 'The title to set for the current slide',
      required: true
    }
  ],
  handler: ({ title }) => {
    if (slides.value[currentSlide.value]) {
      slides.value[currentSlide.value].title = title
    }
  }
})

useCopilotAction({
  name: 'setSlideContent',
  description: 'Set the HTML content of the current slide',
  parameters: [
    {
      name: 'content',
      type: 'string',
      description: 'The HTML content to set for the current slide',
      required: true
    }
  ],
  handler: ({ content }) => {
    if (slides.value[currentSlide.value]) {
      slides.value[currentSlide.value].content = content
    }
  }
})

useCopilotAction({
  name: 'addNewSlide',
  description: 'Add a new slide with the specified title and content',
  parameters: [
    {
      name: 'title',
      type: 'string',
      description: 'The title for the new slide',
      required: true
    },
    {
      name: 'content',
      type: 'string',
      description: 'The HTML content for the new slide',
      required: true
    }
  ],
  handler: ({ title, content }) => {
    slides.value.push({
      title,
      content
    })
    currentSlide.value = slides.value.length - 1
  }
})

useCopilotAction({
  name: 'deleteCurrentSlide',
  description: 'Delete the currently active slide',
  parameters: [],
  handler: () => {
    if (slides.value[currentSlide.value]) {
      slides.value.splice(currentSlide.value, 1)
      if (currentSlide.value >= slides.value.length) {
        currentSlide.value = Math.max(0, slides.value.length - 1)
      }
    }
  }
})

useCopilotAction({
  name: 'goToSlide',
  description: 'Navigate to a specific slide',
  parameters: [
    {
      name: 'index',
      type: 'number',
      description: 'The slide index to navigate to (0-based)',
      required: true
    }
  ],
  handler: ({ index }) => {
    if (index >= 0 && index < slides.value.length) {
      currentSlide.value = index
    }
  }
})

useCopilotChatSuggestions({
  instructions:
    'Generate helpful suggestions for presentation creation and editing. Suggest actions like adding slides with specific topics, editing slide content, navigating slides, or creating entire presentation decks.',
  minSuggestions: 2,
  maxSuggestions: 4
})
</script>

<style scoped>
.presentation-container {
  padding: 2rem;
  max-width: 900px;
  margin: 0 auto;
}

.presentation-header {
  margin-bottom: 1.5rem;
}

.title {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
}

.presentation-wrapper {
  position: relative;
  aspect-ratio: 16 / 9;
  background: #000;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 1rem;
}

.slide {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  transition: opacity 0.3s ease;
  display: none;
}

.slide.active {
  opacity: 1;
  display: block;
}

.slide-content {
  padding: 2rem;
  height: 100%;
  color: white;
}

.slide-title {
  font-size: 2rem;
  font-weight: 600;
  margin: 0 0 1.5rem 0;
  color: #4a9eff;
}

.slide-body {
  font-size: 1.25rem;
  line-height: 1.6;
}

.slide-body :deep(p) {
  margin-bottom: 1rem;
}

.slide-body :deep(ul) {
  padding-left: 1.5rem;
}

.slide-body :deep(li) {
  margin-bottom: 0.5rem;
}

.presentation-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.slide-indicator {
  font-size: 1rem;
  color: #666;
  font-weight: 500;
  min-width: 60px;
  text-align: center;
}

.presentation-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.presentation-actions .el-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
</style>
