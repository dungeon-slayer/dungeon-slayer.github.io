import * as React from 'react'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import styled from 'styled-components'
import * as Bows from 'bows'
import { StoreState } from 'src/store/interface'
import { PlayerState, BattleState, GameState } from 'src/reducers'
import { PlayerHelper, MobHelper, BattleHelper } from 'src/helpers'
import { BattleAction } from 'src/actions'
import ListItem from './ListItem'
import { CtaItem, CharacterItem } from 'src/common/interfaces'
import AccordionContainer from './AccordionContainer'

const log = Bows('SegmentDungeon')

const ComponentWrapper = styled.div``

const DescriptionContainer = styled.div``

const DescriptionWrapper = styled.div`
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
  player: PlayerState
  battle: BattleState
  game: GameState
  // useConsumable: (consumable: ConsumableItem) => Promise<void>
  engageBattle: (mob: CharacterItem) => Promise<void>
}

class BaseSegmentDungeon extends React.Component<Props> {
  componentDidMount() {
    log('componentDidMount triggered.')
  }

  componentWillUnmount() {
    log('componentWillUnmount triggered.')
  }

  get availableMobs(): CharacterItem[] {
    return this.props.game.mobs!
  }

  async mobItemClickHandler(mob: CharacterItem) {
    // log('mobItemClickHandler triggered. mob:', mob)
    await this.props.engageBattle(mob)
  }

  render(): JSX.Element {
    return (
      <ComponentWrapper>
        <AccordionContainer componentKey="dungeon" caption="Dungeon">
          {this.renderDungeon()}
        </AccordionContainer>
      </ComponentWrapper>
    )
  }

  private renderDungeon(): JSX.Element {
    return (
      <React.Fragment>
        <DescriptionContainer>
          <DescriptionWrapper>
            <PropertyKey>Queue Size:</PropertyKey> <PropertyValue>{PlayerHelper.getMobQueueSize(this.props.player.character!.currentLevel).toLocaleString()}</PropertyValue>
          </DescriptionWrapper>
        </DescriptionContainer>
        <MobContainer>{this.availableMobs.map((mob) => this.renderMobItem(mob))}</MobContainer>
      </React.Fragment>
    )
  }

  private renderMobItem(mob: CharacterItem): JSX.Element | null {
    const mobTemplate = MobHelper.getMobTemplateByKey(mob.key)

    if (!mobTemplate) {
      log('Failed to find template for mob:', mob)
      return null
    }

    const key = mob.id
    const heading = mobTemplate.name
    const subheading = `(Lvl ${mob.currentLevel.toLocaleString()})`
    const ctaItem: CtaItem = {
      type: 'blue',
      label: 'Fight',
      onClick: () => this.mobItemClickHandler(mob),
    }
    if (BattleHelper.isEngaging(this.props.battle) && this.props.battle.targetMob!.id === mob.id) {
      ctaItem.type = 'disabled'
      ctaItem.label = 'In Combat'
    }
    if (PlayerHelper.isInFightingMode(this.props.player, this.props.battle)) {
      ctaItem.type = 'disabled'
    }

    let flavor = ''
    let textColor: string | undefined
    if (mobTemplate.category === 'unique') {
      flavor = mobTemplate.flavor
      textColor = '#d000b1'
    }

    return <ListItem key={key} heading={heading} subheading={subheading} flavor={flavor} textColor={textColor} ctaItems={[ctaItem]} ctaMinWidth="100px" />
  }
}

function mapStateToProps(state: StoreState) {
  const { player, battle, game } = state
  return {
    player,
    battle,
    game,
  }
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    engageBattle: async (mob: CharacterItem): Promise<void> => {
      await dispatch(BattleAction.engageBattle(mob))
    },
  }
}

const SegmentDungeon = connect(
  mapStateToProps,
  mapDispatchToProps
)(BaseSegmentDungeon)
export default SegmentDungeon
