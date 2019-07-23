import * as React from 'react'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import styled from 'styled-components'
import * as Bows from 'bows'
import { StoreState } from 'src/store/interface'
import { ProgressState, GameState, BattleState, PlayerState } from 'src/reducers'
import { MobHelper, DungeonHelper, BattleHelper, PlayerHelper } from 'src/helpers'
import { CharacterItem } from 'src/common/interfaces'
import { BattleAction } from 'src/actions'
import ListItem from './ListItem'
import { mediaQueries } from 'src/constants'

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

const DescriptionContainer = styled.div`
  border: solid 1px #93c6d4;
  border-radius: 4px;
  box-sizing: border-box;
  padding: 12px;

  @media ${mediaQueries.mediumUp} {
    padding: 24px;
  }
`

const SubcaptionContainer = styled.div`
  font-size: 20px;
  font-weight: bold;
  margin: 24px 0 12px 0;
`

const LocationPropertyWrapper = styled.div`
  margin: 4px 0;
`

const PropertyKey = styled.div`
  display: inline-block;
`

const PropertyValue = styled.div`
  display: inline-block;
  font-weight: bold;
`

const MobContainer = styled.div`
  margin-top: 24px;
`

interface Props {
  progress: ProgressState
  game: GameState
  battle: BattleState
  player: PlayerState
  engageBattle: (mob: CharacterItem) => Promise<void>
}

class BaseSectionLocation extends React.Component<Props> {
  get hasDungeon(): boolean {
    const dungeonItem = DungeonHelper.getItemByKey(this.props.game.currentLocation)
    return !!dungeonItem
  }

  get currentLocationName(): string {
    const dungeonItem = DungeonHelper.getItemByKey(this.props.game.currentLocation)
    if (!dungeonItem) {
      return 'Unknown Location'
    }
    return dungeonItem.name
  }

  componentDidMount() {
    log('componentDidMount triggered.')
  }

  componentWillUnmount() {
    log('componentWillUnmount triggered.')
  }

  operatorClickHandler(mob: CharacterItem) {
    log('operatorClickHandler triggered. mob:', mob)
    this.props.engageBattle(mob)
  }

  render(): JSX.Element {
    return (
      <ComponentWrapper>
        {this.renderCaption()}
        {this.renderDescription()}
        {this.hasDungeon && this.renderDungeon()}
      </ComponentWrapper>
    )
  }

  private renderCaption(): JSX.Element {
    return <CaptionContainer>Location</CaptionContainer>
  }

  private renderDescription(): JSX.Element | null {
    return (
      <DescriptionContainer>
        <LocationPropertyWrapper>
          You are at <strong>{this.currentLocationName}.</strong>
        </LocationPropertyWrapper>
        <LocationPropertyWrapper>This is a dungeon area.</LocationPropertyWrapper>
      </DescriptionContainer>
    )
  }

  private renderDungeon(): JSX.Element | null {
    return (
      <React.Fragment>
        <SubcaptionContainer>Dungeon</SubcaptionContainer>
        <DescriptionContainer>
          <LocationPropertyWrapper>
            <PropertyKey>Queue Size:</PropertyKey> <PropertyValue>{PlayerHelper.getMobQueueSize(this.props.player.character!.currentLevel).toLocaleString()}</PropertyValue>
          </LocationPropertyWrapper>
        </DescriptionContainer>
        {this.renderMobItems()}
      </React.Fragment>
    )
  }

  private renderMobItems(): JSX.Element | null {
    if (!this.props.game.mobs || this.props.game.mobs.length === 0) {
      return null
    }
    return <MobContainer>{this.props.game.mobs.map((mob) => this.renderMobItem(mob))}</MobContainer>
  }

  private renderMobItem(mob: CharacterItem): JSX.Element | null {
    const mobTemplate = MobHelper.getMobTemplateByKey(mob.key)

    if (!mobTemplate) {
      log('Failed to find template for mob:', mob)
      return null
    }

    const heading = mobTemplate.name
    const subheading = `(Lvl ${mob.currentLevel.toLocaleString()})`
    const blurb = ''

    let ctaType = 'blue'
    let ctaLabel = 'Fight'
    if (BattleHelper.isEngaging(this.props.battle) && this.props.battle.targetMob!.id === mob.id) {
      ctaType = 'disabled'
      ctaLabel = 'In Combat'
    }

    return <ListItem ctaType={ctaType as any} key={mob.id} heading={heading} subheading={subheading} blurb={blurb} ctaLabel={ctaLabel} onClick={() => this.operatorClickHandler(mob)} />
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
  return {
    engageBattle: async (mob: CharacterItem): Promise<void> => {
      await dispatch(BattleAction.engageBattle(mob))
    },
  }
}

const SectionLocation = connect(
  mapStateToProps,
  mapDispatchToProps
)(BaseSectionLocation)
export default SectionLocation
