import * as React from 'react'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import styled from 'styled-components'
import * as Bows from 'bows'
import { StoreState } from 'src/store/interface'
import { LocationItem } from 'src/data'
import { PlayerState, GameState } from 'src/reducers'
import { LocationHelper } from 'src/helpers'
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

const DescriptionContainer = styled.div``

const DescriptionWrapper = styled.div`
  margin: 4px 0;
`

const LocationContainer = styled.div`
  margin-top: 24px;
`

interface Props {
  player: PlayerState
  game: GameState
  travelTo: (location: LocationItem) => Promise<void>
}

class BaseSectionMap extends React.Component<Props> {
  componentDidMount() {
    log('componentDidMount triggered.')
  }

  componentWillUnmount() {
    log('componentWillUnmount triggered.')
  }

  async operatorClickHandler(location: LocationItem) {
    log('operatorClickHandler triggered. location:', location)
    await this.props.travelTo(location)
  }

  render(): JSX.Element {
    return (
      <ComponentWrapper>
        {this.renderCaption()}
        {this.renderDescription()}
        {this.renderLocations()}
      </ComponentWrapper>
    )
  }

  private renderCaption(): JSX.Element {
    return <CaptionContainer>Map</CaptionContainer>
  }

  private renderDescription(): JSX.Element {
    return (
      <DescriptionContainer>
        <DescriptionWrapper>These are the regions you have found so far.</DescriptionWrapper>
      </DescriptionContainer>
    )
  }

  private renderLocations(): JSX.Element {
    const availableLocations = LocationHelper.getAvailableItems(this.props.player.character!.currentLevel)
    const nextLocation = LocationHelper.getNextUnavailableItem(this.props.player.character!.currentLevel)

    return (
      <LocationContainer>
        {availableLocations.map((item) => this.renderItem(item, true))}
        {nextLocation && this.renderItem(nextLocation, false)}
      </LocationContainer>
    )
  }

  private renderItem(location: LocationItem, isAvailable: boolean): JSX.Element {
    const heading = location.name
    let subheading = ''

    if (LocationHelper.hasDungeonByKey(location.key)) {
      subheading = `(Dungeon Lvl ${location.dungeon!.mobLevelBase.toLocaleString()})`
    }
    let flavor = ''
    if (!isAvailable) {
      flavor = `(Player level requirement: ${location.levelRequired.toLocaleString()})`
    }
    let ctaType = 'blue'
    let ctaLabel = 'Travel To'
    if (this.props.game.currentLocation === location.key) {
      ctaType = 'disabled'
      ctaLabel = `You're Here`
    } else if (!isAvailable) {
      ctaType = 'disabled'
      ctaLabel = 'N/A'
    }

    return <ListItem ctaType={ctaType as any} key={location.key} heading={heading} subheading={subheading} flavor={flavor} ctaLabel={ctaLabel} onClick={() => this.operatorClickHandler(location)} />
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
    travelTo: async (location: LocationItem): Promise<void> => {
      await dispatch(GameAction.travelTo(location))
    },
  }
}

const SectionMap = connect(
  mapStateToProps,
  mapDispatchToProps
)(BaseSectionMap)
export default SectionMap
