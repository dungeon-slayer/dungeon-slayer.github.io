export interface PlayerTemplate {
  hpBase: number
  hpLevelModifier: number
  attackBase: number
  attackLevelModifier: number
  defenseBase: number
  defenseLevelModifier: number
  chargeTimeMs: number
}

export const playerTemplate: PlayerTemplate = {
  hpBase: 180,
  hpLevelModifier: 20,
  attackBase: 10,
  attackLevelModifier: 1.8,
  defenseBase: 6,
  defenseLevelModifier: 1.8,
  chargeTimeMs: 1500,
}
