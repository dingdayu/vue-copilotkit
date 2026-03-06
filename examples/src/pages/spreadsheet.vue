<template>
  <div class="spreadsheet-container">
    <div class="spreadsheet-header">
      <h2 class="title">📊 Spreadsheet Demo</h2>
    </div>
    <div class="spreadsheet-grid">
      <div v-for="(row, rowIndex) in grid" :key="rowIndex" class="spreadsheet-row">
        <div v-for="(cell, cellIndex) in row" :key="cellIndex" class="spreadsheet-cell">
          <input
            type="text"
            v-model="cell.value"
            :class="{ 'header-cell': rowIndex === 0 || cellIndex === 0 }"
            @change="handleCellChange(rowIndex, cellIndex)"
          />
        </div>
      </div>
    </div>
    <div class="spreadsheet-actions">
      <el-button @click="addRow">Add Row</el-button>
      <el-button @click="addColumn">Add Column</el-button>
      <el-button @click="clearGrid">Clear Grid</el-button>
    </div>
    <CopilotPopup />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { CopilotPopup, useCopilotChatSuggestions } from '@dingdayu/vue-copilotkit-ui'
import { useCopilotReadable, useCopilotAction } from '@dingdayu/vue-copilotkit-core'

interface Cell {
  value: string
}

type Grid = Cell[][]

const grid = ref<Grid>([
  [{ value: '' }, { value: 'Q1' }, { value: 'Q2' }, { value: 'Q3' }, { value: 'Q4' }],
  [{ value: 'Revenue' }, { value: '10000' }, { value: '15000' }, { value: '12000' }, { value: '20000' }],
  [{ value: 'Expenses' }, { value: '5000' }, { value: '7000' }, { value: '6000' }, { value: '8000' }]
])

const addRow = () => {
  const newRow = [{ value: `Row ${grid.value.length}` }]
  const columns = grid.value[0]?.length || 5
  for (let i = 1; i < columns; i++) {
    newRow.push({ value: '' })
  }
  grid.value.push(newRow)
}

const addColumn = () => {
  grid.value.forEach(row => {
    row.push({ value: '' })
  })
}

const clearGrid = () => {
  grid.value = [
    [{ value: 'A' }, { value: 'B' }, { value: 'C' }, { value: 'D' }, { value: 'E' }],
    [{ value: '1' }, { value: '' }, { value: '' }, { value: '' }, { value: '' }],
    [{ value: '2' }, { value: '' }, { value: '' }, { value: '' }, { value: '' }],
    [{ value: '3' }, { value: '' }, { value: '' }, { value: '' }, { value: '' }]
  ]
}

const handleCellChange = (rowIndex: number, cellIndex: number) => {
  console.log(`Cell changed at [${rowIndex}][${cellIndex}]: ${grid.value[rowIndex][cellIndex].value}`)
}

useCopilotReadable({
  description: 'The current spreadsheet grid data. Each cell contains a value string.',
  value: grid.value
})

useCopilotAction({
  name: 'setCellValue',
  description: 'Set the value of a specific cell in the spreadsheet',
  parameters: [
    {
      name: 'row',
      type: 'number',
      description: 'The row index (0-based)',
      required: true
    },
    {
      name: 'column',
      type: 'number',
      description: 'The column index (0-based)',
      required: true
    },
    {
      name: 'value',
      type: 'string',
      description: 'The value to set in the cell',
      required: true
    }
  ],
  handler: ({ row, column, value }) => {
    if (grid.value[row] && grid.value[row][column]) {
      grid.value[row][column].value = value
    }
  }
})

useCopilotAction({
  name: 'addSpreadsheetRow',
  description: 'Add a new row to the spreadsheet',
  parameters: [
    {
      name: 'rowName',
      type: 'string',
      description: 'The name for the first cell of the new row',
      required: false
    }
  ],
  handler: ({ rowName }) => {
    const newRow = [{ value: rowName || `Row ${grid.value.length}` }]
    const columns = grid.value[0]?.length || 5
    for (let i = 1; i < columns; i++) {
      newRow.push({ value: '' })
    }
    grid.value.push(newRow)
  }
})

useCopilotAction({
  name: 'clearAllCells',
  description: 'Clear all values in the spreadsheet',
  parameters: [],
  handler: () => {
    grid.value.forEach(row => {
      row.forEach(cell => {
        if (!cell.value.startsWith('Row') && !['A', 'B', 'C', 'D', 'E'].includes(cell.value)) {
          cell.value = ''
        }
      })
    })
  }
})

useCopilotChatSuggestions({
  instructions:
    'Generate helpful suggestions for spreadsheet operations. Suggest actions like setting cell values, adding rows/columns, clearing data, or populating with sample financial data.',
  minSuggestions: 2,
  maxSuggestions: 4
})
</script>

<style scoped>
.spreadsheet-container {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.spreadsheet-header {
  margin-bottom: 1.5rem;
}

.title {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
}

.spreadsheet-grid {
  display: grid;
  gap: 1px;
  background-color: #e0e0e0;
  border: 1px solid #ccc;
  overflow: auto;
  max-height: 500px;
}

.spreadsheet-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
}

.spreadsheet-cell {
  background-color: white;
}

.spreadsheet-cell input {
  width: 100%;
  padding: 8px;
  border: none;
  outline: none;
  font-size: 14px;
  background: transparent;
}

.spreadsheet-cell input:focus {
  background-color: #f0f8ff;
}

.spreadsheet-cell .header-cell {
  font-weight: 600;
  background-color: #f5f5f5;
  text-align: center;
}

.spreadsheet-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  align-items: center;
}

.spreadsheet-actions .el-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
</style>
