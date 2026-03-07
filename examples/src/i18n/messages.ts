export const messages = {
  'zh-CN': {
    common: {
      backHome: '返回示例首页',
      howToTry: '建议试试',
      language: '语言',
      chinese: '中文',
      english: 'English',
      save: '保存',
      cancel: '取消'
    },
    app: {
      toolbar: {
        configured: 'Copilot 配置已生效',
        notConfigured: '尚未配置 Copilot 运行参数',
        change: '修改',
        title: '配置 Copilot 连接信息',
        helper: '可配置本地 runtime 地址或 Copilot Cloud 公钥。',
        runtimeLabel: 'Runtime URL',
        apiKeyLabel: 'Public API Key',
        runtimePlaceholder: 'http://localhost:4000/copilotkit',
        apiKeyPlaceholder: 'ck_pub_...'
      }
    },
    home: {
      eyebrow: 'CopilotKit Vue 示例',
      title: '示例导航与学习路径',
      subtitle: '每个示例都聚焦一个明确场景，降低理解成本，方便快速上手。',
      workflowTitle: '核心工作流',
      workflowDesc: '从待办、表单、邮件到表格，覆盖常见业务交互。',
      dataTitle: '数据与内容生成',
      dataDesc: '通过数据看板、电子表格、演示文稿理解复杂场景。',
      sdkTitle: '组件与 SDK',
      sdkDesc: '集中体验 Chat / Popup / Sidebar 与 SDK hooks。',
      cards: {
        todolistTitle: '待办助手',
        todolistDesc: '用自然语言添加、完成和整理任务。',
        formTitle: '智能表单',
        formDesc: '让 AI 根据描述自动补全结构化字段。',
        textareaTitle: '邮件回复',
        textareaDesc: '结合邮件上下文，生成更自然的回复草稿。',
        tableTitle: '表格操作',
        tableDesc: '通过 Action 对表格数据做增删改。',
        dataTitle: '数据分析助手',
        dataDesc: '围绕看板指标提问并产出洞察。',
        sheetTitle: '电子表格',
        sheetDesc: '在网格数据中进行批量编辑和智能填充。',
        deckTitle: '演示文稿',
        deckDesc: '让 AI 协助维护与生成幻灯片内容。',
        sdkTitle: '组件 + SDK 综合示例',
        sdkDesc: '集中演示 hooks 与 UI 组件协同方式。'
      }
    },
    pages: {
      todolist: {
        title: '待办助手',
        subtitle: '面向任务管理的最小示例：Readable + Action + 建议词。',
        inputPlaceholder: '输入任务，或在侧边 Copilot 中直接让 AI 添加...',
        add: '添加任务'
      },
      form: {
        title: '智能表单',
        subtitle: '描述用户信息，让 AI 一次填完多个字段。',
        submit: '提交',
        reset: '重置',
        labels: {
          name: '姓名',
          gender: '性别',
          phone: '电话',
          email: '邮箱',
          hobby: '爱好',
          date: '出生日期',
          address1: '省市',
          address2: '街道门牌'
        }
      },
      textarea: {
        title: '邮件回复助手',
        subtitle: '利用历史邮件上下文，自动生成更完整的回复。',
        subject: '邮件主题：项目启动会议',
        replyPlaceholder: '输入回复或让 AI 帮你起草...',
        reply: '发送回复',
        from: '发件人',
        to: '收件人'
      },
      table: {
        title: '表格操作助手',
        subtitle: '通过 Copilot Action 对表格执行新增、删除、更新。'
      },
      spreadsheet: {
        title: '电子表格助手',
        subtitle: '适合演示按坐标更新单元格和批量填充。',
        addRow: '新增行',
        addColumn: '新增列',
        clear: '清空表格'
      },
      presentation: {
        title: '演示文稿助手',
        subtitle: '使用 Marp Markdown 生成演示文稿，切换模板并导出为 PPTX。',
        prev: '上一页',
        next: '下一页',
        add: '新增页',
        remove: '删除当前页'
      },
      sdk: {
        title: '组件与 SDK 综合示例',
        subtitle: '集中演示 CopilotChat、Popup、Sidebar 与常用 hooks。',
        stateTitle: 'SDK 状态',
        configTitle: '建议词配置',
        hitlTitle: '人工确认（HITL）',
        pending: '待处理中断',
        interrupt: '模拟中断',
        accept: '通过',
        reject: '拒绝',
        clear: '清空',
        sidebarTitle: 'Sidebar 默认配置',
        apply: '应用配置'
      },
      data: {
        title: '数据分析助手',
        subtitle: '示例化的业务看板 + Copilot 问答 + 洞察维护。',
        revenue: '总营收',
        profit: '总利润',
        customers: '客户数',
        margin: '利润率',
        notes: '分析结论'
      }
    }
  },
  'en-US': {
    common: {
      backHome: 'Back to examples',
      howToTry: 'Try prompts',
      language: 'Language',
      chinese: '中文',
      english: 'English',
      save: 'Save',
      cancel: 'Cancel'
    },
    app: {
      toolbar: {
        configured: 'Copilot settings are active',
        notConfigured: 'Copilot runtime is not configured yet',
        change: 'Change',
        title: 'Configure Copilot connection',
        helper: 'You can set a local runtime URL or a Copilot Cloud public key.',
        runtimeLabel: 'Runtime URL',
        apiKeyLabel: 'Public API Key',
        runtimePlaceholder: 'http://localhost:4000/copilotkit',
        apiKeyPlaceholder: 'ck_pub_...'
      }
    },
    home: {
      eyebrow: 'CopilotKit Vue Examples',
      title: 'Example Navigation and Learning Path',
      subtitle: 'Each example focuses on one clear scenario to reduce learning friction.',
      workflowTitle: 'Core workflows',
      workflowDesc: 'Todo, forms, email and table operations for common app patterns.',
      dataTitle: 'Data and content generation',
      dataDesc: 'Understand richer scenarios with dashboards, sheets and slides.',
      sdkTitle: 'Components and SDK',
      sdkDesc: 'Explore Chat / Popup / Sidebar with SDK hooks in one place.',
      cards: {
        todolistTitle: 'Todo assistant',
        todolistDesc: 'Use natural language to add, complete and organize tasks.',
        formTitle: 'Smart form',
        formDesc: 'Let AI fill structured fields from a short description.',
        textareaTitle: 'Email reply',
        textareaDesc: 'Generate better replies with historical email context.',
        tableTitle: 'Table operations',
        tableDesc: 'Use Actions to append, remove and update rows.',
        dataTitle: 'Data assistant',
        dataDesc: 'Ask questions about dashboard metrics and generate insights.',
        sheetTitle: 'Spreadsheet',
        sheetDesc: 'Edit grid data and perform AI-assisted updates.',
        deckTitle: 'Presentation',
        deckDesc: 'Create and edit slide decks with AI help.',
        sdkTitle: 'Components + SDK full demo',
        sdkDesc: 'Showcases hooks and UI components working together.'
      }
    },
    pages: {
      todolist: {
        title: 'Todo assistant',
        subtitle: 'A minimal scenario for Readable + Action + suggestions.',
        inputPlaceholder: 'Type a task, or ask Copilot to add one directly...',
        add: 'Add'
      },
      form: {
        title: 'Smart form',
        subtitle: 'Describe profile information and let AI fill all fields.',
        submit: 'Submit',
        reset: 'Reset',
        labels: {
          name: 'Name',
          gender: 'Gender',
          phone: 'Phone',
          email: 'Email',
          hobby: 'Hobbies',
          date: 'Birth date',
          address1: 'City/Province',
          address2: 'Street/Number'
        }
      },
      textarea: {
        title: 'Email reply assistant',
        subtitle: 'Use thread context to generate complete reply drafts.',
        subject: 'Subject: Project kickoff meeting',
        replyPlaceholder: 'Write your reply or ask AI to draft it...',
        reply: 'Send reply',
        from: 'From',
        to: 'To'
      },
      table: {
        title: 'Table operations assistant',
        subtitle: 'Use Copilot Actions to append, delete, and update table rows.'
      },
      spreadsheet: {
        title: 'Spreadsheet assistant',
        subtitle: 'Good for showing coordinate-based edits and batch fills.',
        addRow: 'Add row',
        addColumn: 'Add column',
        clear: 'Clear sheet'
      },
      presentation: {
        title: 'Presentation assistant',
        subtitle: 'Generate presentations from Marp Markdown, switch themes, and export to PPTX.',
        prev: 'Previous',
        next: 'Next',
        add: 'Add slide',
        remove: 'Delete current'
      },
      sdk: {
        title: 'Components and SDK full demo',
        subtitle: 'Explore CopilotChat, Popup, Sidebar, and common hooks together.',
        stateTitle: 'SDK state',
        configTitle: 'Suggestion configs',
        hitlTitle: 'Human in the loop',
        pending: 'Pending interrupt',
        interrupt: 'Simulate interrupt',
        accept: 'Accept',
        reject: 'Reject',
        clear: 'Clear',
        sidebarTitle: 'Sidebar defaults',
        apply: 'Apply defaults'
      },
      data: {
        title: 'Data assistant',
        subtitle: 'Example dashboard with Copilot Q&A and insight management.',
        revenue: 'Revenue',
        profit: 'Profit',
        customers: 'Customers',
        margin: 'Margin',
        notes: 'Insight notes'
      }
    }
  }
}
