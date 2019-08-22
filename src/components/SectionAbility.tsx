import * as React from 'react'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import styled from 'styled-components'
import * as Bows from 'bows'
import { StoreState } from 'src/store/interface'
import { PlayerState } from 'src/reducers'
import { AbilityHelper, PlayerHelper } from 'src/helpers'
import { AbilityItem } from 'src/data'
import { PlayerAction } from 'src/actions'
import ListItem from './ListItem'
import { mediaQueries } from 'src/constants'
import { CtaItem, ActiveAbilityItem } from 'src/common/interfaces'

const log = Bows('SectionAbility')

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

const AbilityContainer = styled.div`
  margin-top: 24px;
`

const NoAbilityContainer = styled(AbilityContainer)`
  color: #dc0073;
`

interface Props {
  player: PlayerState
  toggleAbility: (ability: AbilityItem) => Promise<void>
}

class BaseSectionAbility extends React.Component<Props> {
  componentDidMount() {
    log('componentDidMount triggered.')
  }

  componentWillUnmount() {
    log('componentWillUnmount triggered.')
  }

  async operatorClickHandler(ability: AbilityItem) {
    log('operatorClickHandler triggered. ability:', ability)
    await this.props.toggleAbility(ability)
  }

  render(): JSX.Element {
    return (
      <ComponentWrapper>
        {this.renderCaption()}
        {this.renderDescription()}
        {this.renderItems()}
      </ComponentWrapper>
    )
  }

  private renderCaption(): JSX.Element {
    return <CaptionContainer>Ability</CaptionContainer>
  }

  private renderDescription(): JSX.Element {
    const usedAP = PlayerHelper.getUsedAbilityPoint(this.props.player)
    const totalAP = PlayerHelper.getTotalAbilityPoint(this.props.player.character!.currentLevel)

    return (
      <DescriptionContainer>
        <DescriptionWrapper>Abilities you have acquired throughout the adventure.</DescriptionWrapper>
        <EmphasisDescriptionWrapper>
          You allocated <strong>{usedAP}</strong> out of total <strong>{totalAP}</strong> Ability Points.
        </EmphasisDescriptionWrapper>
      </DescriptionContainer>
    )
  }

  private renderItems(): JSX.Element | null {
    const availableAbilities = PlayerHelper.getAvailableAbilityItems(this.props.player)

    if (availableAbilities.length === 0) {
      return <NoAbilityContainer>You do not have any abilities available.</NoAbilityContainer>
    }

    return <AbilityContainer>{availableAbilities.map((item) => this.renderItem(item))}</AbilityContainer>
  }

  private renderItem(aaItem: ActiveAbilityItem): JSX.Element | null {
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
      onClick: () => this.operatorClickHandler(ability),
    }
    if (AbilityHelper.isActivated(this.props.player, ability.key)) {
      ctaItem.type = 'green'
      ctaItem.label = 'On'
    }

    return <ListItem key={ability.key} heading={heading} subheading={subheading} flavor={flavor} ctaItems={[ctaItem]} ctaMinWidth="100px" />
  }
}

function mapStateToProps(state: StoreState) {
  const { player } = state
  return {
    player,
  }
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    toggleAbility: async (ability: AbilityItem): Promise<void> => {
      await dispatch(PlayerAction.toggleAbility(ability))
    },
  }
}

const SectionAbility = connect(
  mapStateToProps,
  mapDispatchToProps
)(BaseSectionAbility)
export default SectionAbility
