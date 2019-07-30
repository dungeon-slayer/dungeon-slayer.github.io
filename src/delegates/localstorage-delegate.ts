import { GameSaveItem } from 'src/common/interfaces'

export class LocalstorageDelegate {
  static setProgress(data: GameSaveItem) {
    const dataStr = JSON.stringify(data)
    localStorage.setItem('gameProgress', dataStr)
  }

  static getProgress(): GameSaveItem | undefined {
    const dataStr = localStorage.getItem('gameProgress')
    try {
      return JSON.parse(dataStr!)
    } catch (err) {
      return undefined
    }
  }

  static removeProgress() {
    localStorage.removeItem('gameProgress')
  }
}
