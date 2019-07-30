import { QuestItem } from 'src/common/interfaces'
import { DropHelper } from './drop-helper'
import { ConsumableHelper } from './consumable-helper'

export class QuestHelper {
  static getRequestLabel(quest: QuestItem): string {
    const parts: string[] = []
    for (const requestItem of quest.requestItems) {
      const itemName = DropHelper.getNameByKey(requestItem.key)
      if (requestItem.quantity === 1) {
        parts.push(itemName)
      } else {
        parts.push(`${itemName} ×${requestItem.quantity}`)
      }
    }
    return `Request: ${parts.join(', ')}`
  }

  static getRewardLabel(quest: QuestItem): string {
    const parts: string[] = []
    for (const rewardItem of quest.rewardItems) {
      const itemName = ConsumableHelper.getNameByKey(rewardItem.key)
      if (rewardItem.quantity === 1) {
        parts.push(itemName)
      } else {
        parts.push(`${itemName} ×${rewardItem.quantity}`)
      }
    }
    return `Reward: ${parts.join(', ')}`
  }
}
