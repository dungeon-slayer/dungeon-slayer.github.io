import { find } from 'lodash'
import { SectionItem, sections } from 'src/data'

export class SectionHelper {
  static getItemByKey(key: string | undefined): SectionItem | undefined {
    if (!key) {
      return undefined
    }

    const matchedItem = find(sections, (item) => item.key === key)
    return matchedItem
  }
}
