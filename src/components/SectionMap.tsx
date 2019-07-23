import * as React from 'react'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import styled from 'styled-components'
import * as Bows from 'bows'
import { StoreState } from 'src/store/interface'
import { DungeonItem } from 'src/data'
import { PlayerState, GameState } from 'src/reducers'
import { DungeonHelper } from 'src/helpers'
import { GameAction } from 'src/actions'
import ListItem from './ListItem'
import { mediaQueries } from 'src/constants'

const log = Bows('SectionMap')

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

const DungeonContainer = styled.div``

interface Props {
  player: PlayerState
  game: GameState
  travelTo: (dungeon: DungeonItem) => Promise<void>
}

class BaseSectionMap extends React.Component<Props> {
  componentDidMount() {
    log('componentDidMount triggered.')
  }

  componentWillUnmount() {
    log('componentWillUnmount triggered.')
  }

  operatorClickHandler(dungeon: DungeonItem) {
    log('operatorClickHandler triggered. dungeon:', dungeon)
    this.props.travelTo(dungeon)
  }

  render(): JSX.Element {
    return (
      <ComponentWrapper>
        {this.renderCaption()}
        {this.renderDungeons()}
      </ComponentWrapper>
    )
  }

  private renderCaption(): JSX.Element {
    return <CaptionContainer>Map</CaptionContainer>
  }

  private renderDungeons(): JSX.Element {
    const availableDungeons = DungeonHelper.getAvailableItems(this.props.player.character!.currentLevel)
    const nextDungeon = DungeonHelper.getNextUnavailableItem(this.props.player.character!.currentLevel)

    return (
      <DungeonContainer>
        {availableDungeons.map((item) => this.renderItem(item, true))}
        {nextDungeon && this.renderItem(nextDungeon, false)}
      </DungeonContainer>
    )
  }

  private renderItem(dungeon: DungeonItem, isAvailable: boolean): JSX.Element {
    const heading = dungeon.name
    const subheading = `(Dungeon Lvl ${dungeon.mobBaseLevel.toLocaleString()})`
    let blurb = dungeon.flavor
    if (!isAvailable) {
      blurb = `(Player level requirement: ${dungeon.levelRequired.toLocaleString()})`
    }

    let ctaType = 'blue'
    let ctaLabel = 'Travel To'
    if (this.props.game.currentLocation === dungeon.key) {
      ctaType = 'disabled'
      ctaLabel = `You're Here`
    }
    if (!isAvailable) {
      ctaType = 'disabled'
      ctaLabel = 'N/A'
    }

    return <ListItem ctaType={ctaType as any} key={dungeon.key} heading={heading} subheading={subheading} blurb={blurb} ctaLabel={ctaLabel} onClick={() => this.operatorClickHandler(dungeon)} />
  }
}

function mapStateToProps(state: StoreState) {
  const { player, game } = state
  return {
    player,
    game,
  }
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    travelTo: async (dungeon: DungeonItem): Promise<void> => {
      await dispatch(GameAction.travelTo(dungeon))
    },
  }
}

const SectionMap = connect(
  mapStateToProps,
  mapDispatchToProps
)(BaseSectionMap)
export default SectionMap
