import * as React from 'react'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import styled from 'styled-components'
import * as Bows from 'bows'
import { StoreState } from 'src/store/interface'
import { LocationItem } from 'src/data'
import { PlayerState, GameState, BattleState } from 'src/reducers'
import { LocationHelper, PlayerHelper } from 'src/helpers'
import { GameAction } from 'src/actions'
import ListItem from './ListItem'
import { mediaQueries } from 'src/constants'
import { CtaItem } from 'src/common/interfaces'
import AccordionContainer from './AccordionContainer'

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

const MobListContainer = styled.div`
  opacity: 0.7;
`

const MobListBlurb = styled.div`
  color: #1692bb;
`

interface Props {
  player: PlayerState
  game: GameState
  battle: BattleState
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
    return (
      <CaptionContainer role="heading" aria-level={1}>
        Map
      </CaptionContainer>
    )
  }

  private renderDescription(): JSX.Element {
    return (
      <DescriptionContainer>
        <DescriptionWrapper>These are the regions you have found so far.</DescriptionWrapper>
      </DescriptionContainer>
    )
  }

  private renderLocations(): JSX.Element {
    const availableLocations = LocationHelper.getAvailableItems(this.props.player)
    const nextLocation = LocationHelper.getNextUnavailableItem(this.props.player)

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
    let extraContent: JSX.Element | undefined

    if (LocationHelper.hasDungeonByKey(location.key)) {
      subheading = `(Dungeon Lvl ${location.dungeon!.mobLevelBase.toLocaleString()})`
      extraContent = (
        <MobListContainer>
          <AccordionContainer componentKey={`ec_${location.key}`} caption="More information" captionType="normal" isClosedByDefault={true}>
            <MobListBlurb>{LocationHelper.getMobListLabel(location)}</MobListBlurb>
          </AccordionContainer>
        </MobListContainer>
      )
    }
    // let flavor = ''
    let flavor = location.flavor
    if (!isAvailable) {
      flavor = LocationHelper.getRequirementLabel(location)
    }

    const ctaItem: CtaItem = {
      type: PlayerHelper.isInFightingMode(this.props.player, this.props.battle) ? 'disabled' : 'blue',
      label: 'Travel To',
      onClick: () => this.operatorClickHandler(location),
    }

    if (this.props.game.currentLocation === location.key) {
      ctaItem.type = 'disabled'
      ctaItem.label = `You're Here`
    } else if (!isAvailable) {
      ctaItem.type = 'disabled'
      ctaItem.label = 'N/A'
      extraContent = undefined
    }

    return <ListItem key={location.key} heading={heading} subheading={subheading} blurb={flavor} ctaItems={[ctaItem]} ctaMinWidth="120px" extraContent={extraContent} />
  }
}

function mapStateToProps(state: StoreState) {
  const { player, game, battle } = state
  return {
    player,
    game,
    battle,
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
