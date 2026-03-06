import { shallowRef } from 'vue'
import { randomId } from '@copilotkit/shared'

export type FlatCategoryStoreId = string

interface FlatCategoryStoreElement<T> {
  id: FlatCategoryStoreId
  value: T
  categories: Set<string>
}

export default function useFlatCategoryStore<T>() {
  const elements = shallowRef(new Map<FlatCategoryStoreId, FlatCategoryStoreElement<T>>())

  const addElement = (value: T, categories: string[]) => {
    const id = randomId()
    const element: FlatCategoryStoreElement<T> = {
      id,
      value,
      categories: new Set(categories)
    }
    elements.value.set(id, element)
    return id
  }

  const removeElement = (id: FlatCategoryStoreId) => {
    elements.value.delete(id)
  }

  const allElements = (categories: string[]) => {
    if (!categories.length) {
      return Array.from(elements.value.values()).map(element => element.value)
    }

    const categoriesSet = new Set(categories)
    return Array.from(elements.value.values())
      .filter(element => setsHaveIntersection(categoriesSet, element.categories))
      .map(element => element.value)
  }

  return { addElement, removeElement, allElements }
}

function setsHaveIntersection<T>(setA: Set<T>, setB: Set<T>): boolean {
  const [smallerSet, largerSet] = setA.size <= setB.size ? [setA, setB] : [setB, setA]
  for (let item of smallerSet) {
    if (largerSet.has(item)) {
      return true
    }
  }
  return false
}
