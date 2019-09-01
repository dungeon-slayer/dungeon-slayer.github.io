import * as React from 'react'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import styled from 'styled-components'
import * as Bows from 'bows'
import { StoreState } from 'src/store/interface'
import { ProgressState, GameState, BattleState, PlayerState } from 'src/reducers'
import { LocationHelper, HtmlParseHelper } from 'src/helpers'
import { mediaQueries } from 'src/constants'
import { LocationItem } from 'src/data'
import SegmentDungeon from './SegmentDungeon'
import SegmentAlchemist from './SegmentAlchemist'
import SegmentMerchant from './SegmentMerchant'
import SegmentQuestGiver from './SegmentQuestGiver'

const log = Bows('SectionLocation')

const ComponentWrapper = styled.div``

const CaptionContainer = styled.div`
  font-size: 24px;
  font-weight: bold;
  text-transform: uppercase;
  margin-bottom: 24px;

  @media ${mediaQueries.mediumUp} {
    display: none;
  }
`

const DescriptionContainer = styled.div``

const DescriptionWrapper = styled.div`
  margin: 4px 0;
`

const EmphasisDescriptionWrapper = styled.div`
  margin-top: 12px;
  background-color: rgba(255, 184, 98, 0.1);
  border-radius: 4px;
  padding: 12px;
`

interface Props {
  progress: ProgressState
  game: GameState
  battle: BattleState
  player: PlayerState
}

class BaseSectionLocation extends React.Component<Props> {
  componentDidMount() {
    log('componentDidMount triggered.')
  }

  componentWillUnmount() {
    log('componentWillUnmount triggered.')
  }

  get currentLocation(): LocationItem | undefined {
    return LocationHelper.getItemByKey(this.props.game.currentLocation)
  }

  get hasAlchemist(): boolean {
    return LocationHelper.hasAlchemistByKey(this.props.game.currentLocation)
  }

  get hasMerchant(): boolean {
    return LocationHelper.hasMerchantByKey(this.props.game.currentLocation)
  }

  get hasQuestGiver(): boolean {
    return LocationHelper.hasQuestGiverByKey(this.props.game.currentLocation)
  }

  get hasDungeon(): boolean {
    return LocationHelper.hasDungeonByKey(this.props.game.currentLocation)
  }

  get displayGoldDescription(): boolean {
    return this.hasAlchemist || this.hasMerchant
  }

  get currentLocationName(): string {
    if (!this.currentLocation) {
      return 'Unknown Location'
    }
    return this.currentLocation.name
  }

  get currentLocationFlavorText(): string {
    if (!this.currentLocation) {
      return ''
    }
    return this.currentLocation.flavor
  }

  render(): JSX.Element {
    return (
      <ComponentWrapper>
        {this.renderCaption()}
        {this.renderDescription()}
        {this.hasAlchemist && <SegmentAlchemist />}
        {this.hasMerchant && <SegmentMerchant />}
        {this.hasQuestGiver && <SegmentQuestGiver />}
        {this.hasDungeon && <SegmentDungeon />}
      </ComponentWrapper>
    )
  }

  private renderCaption(): JSX.Element {
    return (
      <CaptionContainer role="heading" aria-level={1}>
        Location
      </CaptionContainer>
    )
  }

  private renderDescription(): JSX.Element {
    const sentences = [`You are at <strong>${this.currentLocationName}</strong>.`, this.currentLocationFlavorText]
    if (LocationHelper.hasDungeonByKey(this.props.game.currentLocation)) {
      sentences.push(`Be on your guard as this place is filled with hostile mobs.`)
    } else {
      sentences.push(`Check around the region to see if anything can be helpful.`)
    }

    return (
      <DescriptionContainer>
        <DescriptionWrapper>{HtmlParseHelper.parse(sentences.join(' '))}</DescriptionWrapper>
        {this.displayGoldDescription && (
          <EmphasisDescriptionWrapper>
            You have <strong>{this.props.player.gold!.toLocaleString()}</strong> gold.
          </EmphasisDescriptionWrapper>
        )}
      </DescriptionContainer>
    )
  }
}

function mapStateToProps(state: StoreState) {
  const { progress, game, battle, player } = state
  return {
    progress,
    game,
    battle,
    player,
  }
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {}
}

const SectionLocation = connect(
  mapStateToProps,
  mapDispatchToProps
)(BaseSectionLocation)
export default SectionLocation
