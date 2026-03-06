<template>
  <main class="demo-page bg-gradient-to-b from-amber-50 to-slate-50">
    <div class="demo-page-shell">
      <RouterLink class="font-semibold text-blue-700" to="/">{{ t('common.backHome') }}</RouterLink>

      <section class="mt-3 grid gap-4 rounded-2xl border border-slate-200 bg-white/90 p-5">
        <header>
          <h1 class="text-2xl font-bold text-slate-900">{{ t('pages.form.title') }}</h1>
          <p class="mt-1 text-sm text-slate-500">{{ t('pages.form.subtitle') }}</p>
        </header>

        <div class="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-slate-700">
          <strong>{{ t('common.howToTry') }}</strong>
          <ul class="mt-2 list-disc space-y-1 pl-5">
            <li v-for="item in quickPrompts" :key="item">{{ item }}</li>
          </ul>
        </div>

        <form class="grid max-w-3xl gap-3" @submit.prevent="onSubmit">
          <label class="grid gap-1 text-sm text-slate-700">
            <span>{{ t('pages.form.labels.name') }}</span>
            <input
              v-model="form.name"
              class="rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500"
            />
          </label>

          <label class="grid gap-1 text-sm text-slate-700">
            <span>{{ t('pages.form.labels.gender') }}</span>
            <select
              v-model="form.gender"
              class="rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500"
            >
              <option v-for="genderOption in genderOptions" :key="genderOption.value" :value="genderOption.value">
                {{ genderOption.label }}
              </option>
            </select>
          </label>

          <label class="grid gap-1 text-sm text-slate-700">
            <span>{{ t('pages.form.labels.phone') }}</span>
            <input
              v-model="form.phone"
              class="rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500"
            />
          </label>

          <label class="grid gap-1 text-sm text-slate-700">
            <span>{{ t('pages.form.labels.email') }}</span>
            <input
              v-model="form.email"
              type="email"
              class="rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500"
            />
          </label>

          <fieldset class="grid gap-1 text-sm text-slate-700">
            <legend class="mb-1">{{ t('pages.form.labels.hobby') }}</legend>
            <div class="flex flex-wrap gap-3">
              <label
                v-for="hobbyOption in hobbyOptions"
                :key="hobbyOption.value"
                class="inline-flex items-center gap-2"
              >
                <input
                  type="checkbox"
                  :value="hobbyOption.value"
                  :checked="form.hobby.includes(hobbyOption.value)"
                  @change="toggleHobby(hobbyOption.value, ($event.target as HTMLInputElement).checked)"
                />
                <span>{{ hobbyOption.label }}</span>
              </label>
            </div>
          </fieldset>

          <label class="grid gap-1 text-sm text-slate-700">
            <span>{{ t('pages.form.labels.date') }}</span>
            <input
              v-model="form.date"
              type="date"
              class="rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500"
            />
          </label>

          <label class="grid gap-1 text-sm text-slate-700">
            <span>{{ t('pages.form.labels.address1') }}</span>
            <textarea
              v-model="form.address1"
              rows="2"
              class="rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500"
            />
          </label>

          <label class="grid gap-1 text-sm text-slate-700">
            <span>{{ t('pages.form.labels.address2') }}</span>
            <textarea
              v-model="form.address2"
              rows="2"
              class="rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500"
            />
          </label>

          <div class="inline-flex gap-2">
            <button type="submit" class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white">
              {{ t('pages.form.submit') }}
            </button>
            <button type="button" class="rounded-lg border border-slate-300 px-4 py-2 text-sm" @click="onReset">
              {{ t('pages.form.reset') }}
            </button>
          </div>
        </form>
      </section>
    </div>

    <CopilotPopup />
  </main>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue'
import { useI18n } from 'vue-i18n'

import { useCopilotAction, useCopilotReadable } from '@dingdayu/vue-copilotkit-core'
import { CopilotPopup, useCopilotChatSuggestions } from '@dingdayu/vue-copilotkit-ui'

const { t, locale } = useI18n()

type FormValue = {
  name: string
  gender: string
  phone: string
  email: string
  hobby: string[]
  date: string
  address1: string
  address2: string
}

const emptyForm = (): FormValue => ({
  name: '',
  gender: '0',
  phone: '',
  email: '',
  hobby: [],
  date: '',
  address1: '',
  address2: ''
})

const form = reactive<FormValue>(emptyForm())

const genderOptions = computed(() => [
  { value: '0', label: locale.value === 'zh-CN' ? '未知' : 'Unknown' },
  { value: '1', label: locale.value === 'zh-CN' ? '男' : 'Male' },
  { value: '2', label: locale.value === 'zh-CN' ? '女' : 'Female' }
])

const hobbyOptions = computed(() => [
  { value: '1', label: locale.value === 'zh-CN' ? '足球' : 'Football' },
  { value: '2', label: locale.value === 'zh-CN' ? '篮球' : 'Basketball' },
  { value: '3', label: locale.value === 'zh-CN' ? '排球' : 'Volleyball' }
])

const toggleHobby = (value: string, checked: boolean) => {
  if (checked) {
    if (!form.hobby.includes(value)) form.hobby.push(value)
    return
  }
  const index = form.hobby.indexOf(value)
  if (index >= 0) form.hobby.splice(index, 1)
}

useCopilotReadable({
  description: "The user's information.",
  value: form
})

useCopilotReadable({ description: 'The hobby list.', value: hobbyOptions })
useCopilotReadable({ description: 'The gender list.', value: genderOptions })

useCopilotAction({
  name: 'updateUserInfo',
  description: "Update the user's information",
  parameters: [
    { name: 'name', type: 'string', description: 'The name of the user' },
    { name: 'gender', type: 'string', description: 'The gender of the user' },
    { name: 'phone', type: 'string', description: 'The phone of the user' },
    { name: 'email', type: 'string', description: 'The email of the user' },
    { name: 'hobby', type: 'string[]', description: 'The hobby list by option value' },
    { name: 'date', type: 'string', description: 'The date of the user, format: YYYY-MM-DD' },
    { name: 'address1', type: 'string', description: 'The address1 of the user, contains city/province' },
    { name: 'address2', type: 'string', description: 'The address2 of the user, contains street/number' }
  ],
  handler: info => {
    Object.assign(form, emptyForm(), info)
  }
})

const formSuggestionInstructions = computed(() =>
  locale.value === 'zh-CN'
    ? '生成有助于填写用户信息表单的建议，优先给出批量填写、按字段修改、重置某些字段等可执行指令。'
    : 'Generate actionable suggestions for filling this user profile form, including full autofill, targeted field updates, and reset operations.'
)

const formSuggestions = computed(() =>
  locale.value === 'zh-CN'
    ? [
        { title: '整表填充', message: '按产品经理画像一次性填写完整用户资料表单。' },
        { title: '仅改联系方式', message: '只更新电话和邮箱，其他字段保持不变。' },
        { title: '更新兴趣与生日', message: '把爱好改为足球和篮球，出生日期改为 1998-09-12。' },
        { title: '重置地址信息', message: '清空 address1 和 address2 字段，并保留其余信息。' }
      ]
    : [
        { title: 'Autofill profile', message: 'Fill the whole form with a realistic product manager profile.' },
        { title: 'Update contacts only', message: 'Only update phone and email, keep all other fields unchanged.' },
        { title: 'Change hobbies/date', message: 'Set hobbies to football and basketball, and date to 1998-09-12.' },
        { title: 'Reset addresses', message: 'Clear address1 and address2 while keeping other fields as-is.' }
      ]
)

useCopilotChatSuggestions(
  {
    instructions: formSuggestionInstructions,
    minSuggestions: 2,
    maxSuggestions: 4,
    suggestions: formSuggestions
  },
  [locale, formSuggestions]
)

const onSubmit = () => {
  console.log('submit', form)
}

const onReset = () => {
  Object.assign(form, emptyForm())
}

const quickPrompts = computed(() =>
  locale.value === 'zh-CN'
    ? ['“帮我填写一个产品经理的用户资料”', '“把爱好改成足球和篮球，出生日期设为 1998-09-12”', '“仅更新电话和邮箱”']
    : [
        '"Fill this form with a sample product manager profile"',
        '"Set hobbies to football and basketball, and date to 1998-09-12"',
        '"Only update phone and email"'
      ]
)
</script>
