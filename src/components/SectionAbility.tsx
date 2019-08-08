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
        <DescriptionWrapper>
          You allocated <strong>{usedAP}</strong> out of total <strong>{totalAP}</strong> Ability Points.
        </DescriptionWrapper>
      </DescriptionContainer>
    )
  }

  private renderItems(): JSX.Element | null {
    const availableAbilities = PlayerHelper.getAvailableAbilityKeys(this.props.player)

    if (availableAbilities.length === 0) {
      return <NoAbilityContainer>You do not have any abilities available.</NoAbilityContainer>
    }

    return <AbilityContainer>{availableAbilities.map((key) => this.renderItem(key))}</AbilityContainer>
  }

  private renderItem(abilityKey: string): JSX.Element | null {
    const ability = AbilityHelper.getItemByKey(abilityKey)

    if (!ability) {
      log('Failed to find ability:', abilityKey)
      return null
    }

    const heading = ability.name
    const subheading = `(AP: ${ability.apCost})`
    const flavor = ability.flavor

    let ctaType = 'red'
    let ctaLabel = 'Off'
    if (AbilityHelper.isActivated(this.props.player, ability.key)) {
      ctaType = 'green'
      ctaLabel = 'On'
    }

    return <ListItem ctaType={ctaType as any} key={ability.key} heading={heading} subheading={subheading} flavor={flavor} ctaLabel={ctaLabel} onClick={() => this.operatorClickHandler(ability)} />
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
