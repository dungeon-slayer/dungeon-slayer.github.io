import { filter, find } from 'lodash'
import { LoreItem, lores } from 'src/data/lores'

export class LoreHelper {
  static getDropLoresByKey(key: string): LoreItem[] {
    return LoreHelper.getLoresByCategoryAndKey('drop', key)
  }

  static getQuestLoresByKey(key: string): LoreItem[] {
    return LoreHelper.getLoresByCategoryAndKey('quest', key)
  }

  static getLevelLoresByKey(key: string): LoreItem[] {
    return LoreHelper.getLoresByCategoryAndKey('level', key)
  }

  static getCustomLoreMessageByKey(key: string): string {
    const matched = find(lores, (item) => item.category === 'custom' && item.key === key)
    return matched!.message
  }

  private static getLoresByCategoryAndKey(category: string, key: string): LoreItem[] {
    return filter(lores, (item) => item.category === category && item.key === key)
  }
}
