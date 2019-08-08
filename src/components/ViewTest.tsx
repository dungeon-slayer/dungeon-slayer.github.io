import * as React from 'react'
import styled from 'styled-components'
import { round } from 'lodash'
import * as Bows from 'bows'
import { RandomHelper } from 'src/helpers'

const log = Bows('ViewTest')

const ComponentWrapper = styled.div``

export default class ViewTest extends React.Component {
  componentDidMount() {
    log('componentDidMount triggered.')

    this.testRandomBoxMuller()
    this.testRandomMobLevel()
    this.testWeightedRandomIndex()
  }

  componentWillUnmount() {
    log('componentWillUnmount triggered.')
  }

  render() {
    return <ComponentWrapper>Test</ComponentWrapper>
  }

  private testRandomBoxMuller() {
    log('testRandomBoxMuller triggered.')
    const min = 1
    const max = 7
    const skew = 1

    const sampleCount = 1000
    const output: number[] = []
    log('min:', min, 'max:', max, 'skew:', skew, 'sample:', sampleCount)

    // Sampling
    for (let i = 0; i < sampleCount; i++) {
      const n = round(RandomHelper.randomBoxMuller(min, max, skew))
      if (output[n] === undefined) {
        output[n] = 1
      } else {
        output[n] += 1
      }
    }

    // Reporting
    for (let i = min; i <= max; i++) {
      const count = output[i] || 0
      const percentage = round((count / sampleCount) * 100, 2)
      log(`${i} > ${count} (${percentage}%)`)
    }
    /**
     * Example output for 7 options, unskewed:
     * 1 > 0 (0%)
     * 2 > 5 (0.5%)
     * 3 > 196 (19.6%)
     * 4 > 594 (59.4%)
     * 5 > 197 (19.7%)
     * 6 > 8 (0.8%)
     * 7 > 0 (0%)
     */
  }

  private testRandomMobLevel() {
    log('testRandomMobLevel triggered.')
    const baseLevel = 10
    const halfRange = 3
    const skew = 1

    const sampleCount = 1000
    const output: number[] = []
    log('baseLevel:', baseLevel, 'halfRange:', halfRange, 'skew:', skew, 'sample:', sampleCount)

    // Sampling
    for (let i = 0; i < sampleCount; i++) {
      const n = RandomHelper.getRandomLevel(baseLevel, halfRange, skew)
      if (output[n] === undefined) {
        output[n] = 1
      } else {
        output[n] += 1
      }
    }

    // Reporting
    const min = baseLevel - halfRange
    const max = baseLevel + halfRange
    for (let i = min; i <= max; i++) {
      const count = output[i] || 0
      const percentage = round((count / sampleCount) * 100, 2)
      log(`${i} > ${count} (${percentage}%)`)
    }
    /**
     * Example output for 7 options, unskewed:
     *  7 > 34 (3.4%)
     *  8 > 40 (4%)
     *  9 > 210 (21%)
     * 10 > 464 (46.4%)
     * 11 > 180 (18%)
     * 12 > 41 (4.1%)
     * 13 > 31 (3.1%)
     */
  }

  private testWeightedRandomIndex() {
    log('testWeightedRandomIndex triggered.')

    const weightArr = [10, 8, 6, 4, 2]

    const sampleCount = 10000
    const output: number[] = []
    log('weightArr:', weightArr, 'sample:', sampleCount)

    // Sampling
    for (let i = 0; i < sampleCount; i++) {
      const n = RandomHelper.weightedRandomIndex(weightArr)
      if (output[n] === undefined) {
        output[n] = 1
      } else {
        output[n] += 1
      }
    }

    // Reporting
    for (let i = 0; i < weightArr.length; i++) {
      const count = output[i] || 0
      const percentage = round((count / sampleCount) * 100, 2)
      log(`${i} > ${count} (${percentage}%)`)
    }
    /**
     * Example output for 5 options of sliding weights [10, 8, 6, 4, 2]:
     * 0 > 3342 (33.42%)
     * 1 > 2696 (26.96%)
     * 2 > 2043 (20.43%)
     * 3 > 1292 (12.92%)
     * 4 > 627 (6.27%)
     */
  }
}
