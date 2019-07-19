import { viewports } from './viewports'

export const mediaQueries = {
  smallUp: `(min-width: ${viewports.small}px)`,
  mediumUp: `(min-width: ${viewports.medium}px)`,
  largeUp: `(min-width: ${viewports.large}px)`,
  xlargeUp: `(min-width: ${viewports.xlarge}px)`,
  xxlargeUp: `(min-width: ${viewports.xxlarge}px)`,

  smallOnly: `(min-width: ${viewports.small}px) and (max-width: ${viewports.medium - 1}px)`,
  mediumOnly: `(min-width: ${viewports.medium}px) and (max-width: ${viewports.large - 1}px)`,
  largeOnly: `(min-width: ${viewports.large}px) and (max-width: ${viewports.xlarge - 1}px)`,
  xlargeOnly: `(min-width: ${viewports.xlarge}px) and (max-width: ${viewports.xxlarge - 1}px)`,
}
