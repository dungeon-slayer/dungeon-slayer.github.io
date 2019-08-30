import * as React from 'react'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import styled from 'styled-components'
import * as Bows from 'bows'
import { StoreState } from 'src/store/interface'
import { AbilityItem } from 'src/data'
import { PlayerState, BattleState } from 'src/reducers'
import { PlayerHelper, AbilityHelper } from 'src/helpers'
import { PlayerAction } from 'src/actions'
import ListItem from './ListItem'
import { CtaItem, ActiveAbilityItem } from 'src/common/interfaces'

const log = Bows('SegmentAbility')

const ComponentWrapper = styled.div``

const SubcaptionContainer = styled.div`
  font-size: 20px;
  font-weight: bold;
  margin: 24px 0 12px 0;
`

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

interface Props {
  player: PlayerState
  battle: BattleState
  toggleAbility: (ability: AbilityItem) => Promise<void>
}

class BaseSegmentAbility extends React.Component<Props> {
  componentDidMount() {
    log('componentDidMount triggered.')
  }

  componentWillUnmount() {
    log('componentWillUnmount triggered.')
  }

  async abilityClickHandler(ability: AbilityItem) {
    log('abilityClickHandler triggered. ability:', ability)
    await this.props.toggleAbility(ability)
  }

  render(): JSX.Element {
    return <ComponentWrapper>{this.renderAbilities()}</ComponentWrapper>
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
    toggleAbility: async (ability: AbilityItem): Promise<void> => {
      await dispatch(PlayerAction.toggleAbility(ability))
    },
  }
}

const SegmentAbility = connect(
  mapStateToProps,
  mapDispatchToProps
)(BaseSegmentAbility)
export default SegmentAbility
