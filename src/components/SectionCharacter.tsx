import * as React from 'react'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import styled from 'styled-components'
import * as Bows from 'bows'
import { StoreState } from 'src/store/interface'
import { ConsumableItem, DropItem, AbilityItem } from 'src/data'
import { PlayerState, BattleState } from 'src/reducers'
import { PlayerHelper, AbilityHelper } from 'src/helpers'
import { PlayerAction } from 'src/actions'
import ListItem from './ListItem'
import { mediaQueries } from 'src/constants'
import { CtaItem, ActiveAbilityItem } from 'src/common/interfaces'

const log = Bows('SectionCharacter')

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

const SubcaptionContainer = styled.div`
  font-size: 20px;
  font-weight: bold;
  margin: 24px 0 12px 0;
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

const NoContentWrapper = styled(DescriptionWrapper)`
  color: #dc0073;
`

const ConsumableContainer = styled.div`
  margin-top: 24px;
`

const DropContainer = styled.div`
  margin-top: 24px;
`

interface Props {
  player: PlayerState
  battle: BattleState
  useConsumable: (consumable: ConsumableItem) => Promise<void>
  toggleAbility: (ability: AbilityItem) => Promise<void>
}

class BaseSectionCharacter extends React.Component<Props> {
  componentDidMount() {
    log('componentDidMount triggered.')
  }

  componentWillUnmount() {
    log('componentWillUnmount triggered.')
  }

  async consumableClickHandler(consumable: ConsumableItem) {
    log('consumableClickHandler triggered. consumable:', consumable)
    await this.props.useConsumable(consumable)
  }

  async abilityClickHandler(ability: AbilityItem) {
    log('abilityClickHandler triggered. ability:', ability)
    await this.props.toggleAbility(ability)
  }

  render(): JSX.Element {
    return (
      <ComponentWrapper>
        {this.renderCaption()}
        {this.renderAbilities()}
        {this.renderConsumables()}
        {this.renderDrops()}
      </ComponentWrapper>
    )
  }

  private renderCaption(): JSX.Element {
    return (
      <CaptionContainer role="heading" aria-level={1}>
        Character
      </CaptionContainer>
    )
  }

  private renderAbilities(): JSX.Element {
    const availableAbilities = PlayerHelper.getAvailableAbilityItems(this.props.player)
    const usedAP = PlayerHelper.getUsedAbilityPoint(this.props.player)
    const totalAP = PlayerHelper.getTotalAbilityPoint(this.props.player.character!.currentLevel)

    let dynamicContent: JSX.Element
    if (availableAbilities.length === 0) {
      dynamicContent = <NoContentWrapper>You do not have any abilities available.</NoContentWrapper>
    } else {
      dynamicContent = <React.Fragment>{availableAbilities.map((item) => this.renderAbility(item))}</React.Fragment>
    }

    return (
      <React.Fragment>
        <SubcaptionContainer role="heading" aria-level={2}>
          Abilities
        </SubcaptionContainer>
        <DescriptionWrapper>Abilities you have acquired throughout the adventure.</DescriptionWrapper>
        <EmphasisDescriptionWrapper>
          You allocated <strong>{usedAP}</strong> out of total <strong>{totalAP}</strong> Ability Points.
        </EmphasisDescriptionWrapper>
        <ConsumableContainer>{dynamicContent}</ConsumableContainer>
      </React.Fragment>
    )
  }

  private renderAbility(aaItem: ActiveAbilityItem): JSX.Element | null {
    const ability = AbilityHelper.getItemByKey(aaItem.key)

    if (!ability) {
      log('Failed to find ability:', aaItem)
      return null
    }

    const availableAP = PlayerHelper.getAvailableAbilityPoint(this.props.player)
    const apCost = AbilityHelper.getApCost(ability, aaItem.level)

    const heading = AbilityHelper.getFullName(ability, aaItem.level)
    const subheading = `(AP: ${apCost})`
    const flavor = AbilityHelper.getFlavorText(ability, aaItem.level)

    const ctaItem: CtaItem = {
      type: availableAP > apCost ? 'red' : 'disabled',
      label: 'Off',
      onClick: () => this.abilityClickHandler(ability),
    }
    if (AbilityHelper.isActivated(this.props.player, ability.key)) {
      ctaItem.type = 'green'
      ctaItem.label = 'On'
    }

    return <ListItem key={ability.key} heading={heading} subheading={subheading} flavor={flavor} ctaItems={[ctaItem]} ctaMinWidth="100px" />
  }

  private renderConsumables(): JSX.Element {
    const availableConsumables = PlayerHelper.getAvailableConsumables(this.props.player)

    let dynamicContent: JSX.Element
    if (availableConsumables.length === 0) {
      dynamicContent = <NoContentWrapper>You do not have any consumables in your inventory.</NoContentWrapper>
    } else {
      dynamicContent = <React.Fragment>{availableConsumables.map((item) => this.renderConsumable(item))}</React.Fragment>
    }

    return (
      <React.Fragment>
        <SubcaptionContainer role="heading" aria-level={2}>
          Consumables
        </SubcaptionContainer>
        <DescriptionContainer>
          <DescriptionWrapper>Items that may help you throughout the adventure.</DescriptionWrapper>
        </DescriptionContainer>
        <ConsumableContainer>{dynamicContent}</ConsumableContainer>
      </React.Fragment>
    )
  }

  private renderConsumable(consumable: ConsumableItem): JSX.Element | null {
    const availableItem = PlayerHelper.getAvailableItemByKey(this.props.player.availableConsumables!, consumable.key)
    if (!availableItem) {
      log('Failed to find available item for consumable key:', consumable.key)
      return null
    }

    const heading = consumable.name
    const subheading = `(×${availableItem.quantity.toLocaleString()})`
    const flavor = consumable.flavor
    const ctaItem: CtaItem = {
      type: 'blue',
      label: 'Use',
      onClick: () => this.consumableClickHandler(consumable),
    }
    if (PlayerHelper.isInFightingMode(this.props.player, this.props.battle)) {
      ctaItem.type = 'disabled'
    }

    return <ListItem key={consumable.key} heading={heading} subheading={subheading} flavor={flavor} ctaItems={[ctaItem]} ctaMinWidth="100px" />
  }

  private renderDrops(): JSX.Element {
    const availableDrops = PlayerHelper.getAvailableDrops(this.props.player)

    let dynamicContent: JSX.Element
    if (availableDrops.length === 0) {
      dynamicContent = <NoContentWrapper>You do not have any drops in your inventory.</NoContentWrapper>
    } else {
      dynamicContent = <React.Fragment>{availableDrops.map((item) => this.renderDrop(item))}</React.Fragment>
    }

    return (
      <React.Fragment>
        <SubcaptionContainer role="heading" aria-level={2}>
          Obtained Drops
        </SubcaptionContainer>
        <DescriptionContainer>
          <DescriptionWrapper>Collectable items from all those battle rewards.</DescriptionWrapper>
        </DescriptionContainer>
        <DropContainer>{dynamicContent}</DropContainer>
      </React.Fragment>
    )
  }

  private renderDrop(drop: DropItem): JSX.Element | null {
    const availableItem = PlayerHelper.getAvailableItemByKey(this.props.player.availableDrops!, drop.key)
    if (!availableItem) {
      log('Failed to find available item for drop key:', drop.key)
      return null
    }

    const heading = drop.name
    const subheading = `(×${availableItem.quantity.toLocaleString()})`
    const flavor = drop.flavor

    return <ListItem key={drop.key} heading={heading} subheading={subheading} flavor={flavor} ctaItems={[]} />
  }
}

function mapStateToProps(state: StoreState) {
  const { player, battle } = state
  return {
    player,
    battle,
  }
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    useConsumable: async (consumable: ConsumableItem): Promise<void> => {
      await dispatch(PlayerAction.useConsumable(consumable))
    },

    toggleAbility: async (ability: AbilityItem): Promise<void> => {
      await dispatch(PlayerAction.toggleAbility(ability))
    },
  }
}

const SectionCharacter = connect(
  mapStateToProps,
  mapDispatchToProps
)(BaseSectionCharacter)
export default SectionCharacter
