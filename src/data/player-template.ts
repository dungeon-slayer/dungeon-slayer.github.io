export interface PlayerTemplate {
  hpBase: number
  hpLevelModifier: number
  attackBase: number
  attackLevelModifier: number
  defenseBase: number
  defenseLevelModifier: number
}

export const playerTemplate: PlayerTemplate = {
  hpBase: 180,
  hpLevelModifier: 20,
  attackBase: 10,
  attackLevelModifier: 1.8,
  defenseBase: 6,
  defenseLevelModifier: 1.6,
}
