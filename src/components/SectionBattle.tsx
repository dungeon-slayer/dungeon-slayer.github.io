import * as React from 'react'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import styled from 'styled-components'
import * as Bows from 'bows'
import { StoreState } from 'src/store/interface'
import { ProgressState, GameState, BattleState, PlayerState } from 'src/reducers'
import { CharacterItem, CtaItem } from 'src/common/interfaces'
import { PlayerHelper, CharacterHelper, BattleHelper, AbilityHelper } from 'src/helpers'
import { mediaQueries } from 'src/constants'
import ListItem from './ListItem'
import { PlayerAction } from 'src/actions'

const log = Bows('SectionBattle')

const ComponentWrapper = styled.div``

const OperatorContainer = styled.div`
  margin: 24px 24px 0 24px;
`

const BattlePanelContainer = styled.div`
  padding: 12px 24px 24px 24px;
  display: flex;
  margin: 0 -12px;

  @media ${mediaQueries.smallOnly} {
    flex-wrap: wrap;
  }
`

const CharacterContainer = styled.div`
  flex-grow: 1;
  flex-basis: 100%
  margin: 12px 0;

  @media ${mediaQueries.mediumUp} {
    flex-basis: 45%;
    margin: 0 12px;
  }
`

const InfoContainer = styled.div`
  border: double 4px #036564;
  border-radius: 8px;
  box-sizing: border-box;
  padding: 12px;
  flex-grow: 1;
  height: 100%;
  min-height: 180px;

  @media ${mediaQueries.mediumUp} {
    min-height: 190px;
  }
`

const DisabledInfoContainer = styled(InfoContainer)`
  opacity: 0.2;
`

const CaptionWrapper = styled.div`
  margin-bottom: 6px;
`

const Name = styled.div`
  font-weight: bold;
  display: inline-block;
`

const Level = styled.div`
  display: inline-block;
`

const StatWrapper = styled.div``

const StatKey = styled.div`
  display: inline-block;
`

const StatValue = styled.div`
  display: inline-block;
`

const AbilitiesWrapper = styled.div`
  margin-top: 8px;
  font-size: 12px;
  font-style: italic;
  color: #d000b1;
`

interface Props {
  progress: ProgressState
  game: GameState
  player: PlayerState
  battle: BattleState
  toggleAutoBattle: () => Promise<void>
}

class BaseSectionBattle extends React.Component<Props> {
  componentDidMount() {
    log('componentDidMount triggered.')
  }

  componentWillUnmount() {
    log('componentWillUnmount triggered.')
  }

  async operatorClickHandler() {
    log('operatorClickHandler triggered.')
    this.props.toggleAutoBattle()
  }

  render(): JSX.Element {
    return (
      <ComponentWrapper>
        <OperatorContainer>{this.renderOperator()}</OperatorContainer>
        <BattlePanelContainer>
          <CharacterContainer>{this.renderPlayerInfo()}</CharacterContainer>
          <CharacterContainer>{this.renderMobInfo()}</CharacterContainer>
        </BattlePanelContainer>
      </ComponentWrapper>
    )
  }

  private renderOperator(): JSX.Element {
    const ctaItem: CtaItem = {
      type: 'red',
      label: 'Off',
      onClick: () => this.operatorClickHandler(),
    }
    if (this.props.player.autoBattleEnabled) {
      ctaItem.type = 'green'
      ctaItem.label = 'On'
    }

    const heading = 'Auto Battle'
    const subheading = ''
    const flavor = 'Automatically engage in combat when idle.'
    const bgColor = '#edf5fd'

    return <ListItem heading={heading} subheading={subheading} flavor={flavor} ctaItems={[ctaItem]} ctaMinWidth="100px" bgColor={bgColor} />
  }

  private renderPlayerInfo(): JSX.Element {
    return this.renderCharacterInfo(this.props.player.character!)
  }

  private renderMobInfo(): JSX.Element | null {
    if (!this.props.battle.targetMob) {
      return null
    }
    return this.renderCharacterInfo(this.props.battle.targetMob)
  }

  private renderCharacterInfo(character: CharacterItem): JSX.Element {
    const name = CharacterHelper.getName(character)
    const _InfoContainer = character.key === 'player' || BattleHelper.isEngaging(this.props.battle) ? InfoContainer : DisabledInfoContainer

    return (
      <_InfoContainer>
        <CaptionWrapper>
          <Name>{name}</Name> <Level>(Lvl {character.currentLevel.toLocaleString()})</Level>
        </CaptionWrapper>
        {this.renderExperience(character)}
        <StatWrapper>
          <StatKey>HP:</StatKey>{' '}
          <StatValue>
            {character.currentHp.toLocaleString()} / {character.maxHp.toLocaleString()}
          </StatValue>
        </StatWrapper>
        <StatWrapper>
          <StatKey>Attack:</StatKey> <StatValue>{character.attack.toLocaleString()}</StatValue>
        </StatWrapper>
        <StatWrapper>
          <StatKey>Defense:</StatKey> <StatValue>{character.defense.toLocaleString()}</StatValue>
        </StatWrapper>
        {this.renderAbilities(character)}
      </_InfoContainer>
    )
  }

  private renderExperience(character: CharacterItem): JSX.Element | null {
    if (character.key !== 'player') {
      // return null
      return <StatWrapper>{'\u00a0'}</StatWrapper>
    }

    return (
      <StatWrapper>
        <StatKey>EXP:</StatKey>{' '}
        <StatValue>
          {character.currentExp.toLocaleString()} / {PlayerHelper.getExpRequiredToLevelUp(character.currentLevel).toLocaleString()}
        </StatValue>
      </StatWrapper>
    )
  }

  private renderAbilities(character: CharacterItem): JSX.Element | null {
    if (!character.activeAbilities || character.activeAbilities.length === 0) {
      return null
    }

    const activeAbilityNames: string[] = []
    for (const activeAbilityItem of character.activeAbilities) {
      const ability = AbilityHelper.getItemByKey(activeAbilityItem.key)
      if (ability) {
        const aaItem = PlayerHelper.getAvailableAbilityItemByAbilityKey(this.props.player, ability.key)
        if (aaItem) {
          const abilityName = AbilityHelper.getFullName(ability, aaItem.level)
          activeAbilityNames.push(abilityName)
        }
      }
    }

    if (activeAbilityNames.length === 0) {
      return null
    }

    const abilitiesText = activeAbilityNames.join(', ')
    return <AbilitiesWrapper>{abilitiesText}</AbilitiesWrapper>
  }
}

function mapStateToProps(state: StoreState) {
  const { progress, game, player, battle } = state
  return {
    progress,
    game,
    player,
    battle,
  }
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    toggleAutoBattle: async (): Promise<void> => {
      await dispatch(PlayerAction.toggleAutoBattle())
    },
  }
}

const SectionBattle = connect(
  mapStateToProps,
  mapDispatchToProps
)(BaseSectionBattle)
export default SectionBattle
