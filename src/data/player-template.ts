export interface PlayerTemplate {
  hpBase: number
  hpLevelMultiplier: number
  attackBase: number
  attackLevelMultiplier: number
  defenseBase: number
  defenseLevelMultiplier: number
  chargeTimeMs: number
}

export const playerTemplate: PlayerTemplate = {
  hpBase: 180,
  hpLevelMultiplier: 20,
  attackBase: 10,
  attackLevelMultiplier: 1.8,
  defenseBase: 6,
  defenseLevelMultiplier: 1.8,
  chargeTimeMs: 1500,
}
