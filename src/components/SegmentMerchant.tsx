import * as React from 'react'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import styled from 'styled-components'
import * as Bows from 'bows'
import { StoreState } from 'src/store/interface'
import { PlayerState, BattleState, GameState } from 'src/reducers'
import { PlayerHelper, PriceMultiplierHelper, LocationHelper, ConsumableHelper } from 'src/helpers'
import { GameAction } from 'src/actions'
import ListItem from './ListItem'
import { CtaItem, PriceMultiplierItem } from 'src/common/interfaces'
import { ConsumableItem } from 'src/data'
import AccordionContainer from './AccordionContainer'

const log = Bows('SegmentMerchant')

const ComponentWrapper = styled.div``

const DescriptionContainer = styled.div``

const DescriptionWrapper = styled.div`
  margin: 4px 0;
`

const ConsumableContainer = styled.div`
  margin-top: 24px;
`

interface Props {
  player: PlayerState
  battle: BattleState
  game: GameState
  buyConsumableItem: (consumable: ConsumableItem, quantity: number) => Promise<void>
}

class BaseSegmentMerchant extends React.Component<Props> {
  componentDidMount() {
    log('componentDidMount triggered.')
  }

  componentWillUnmount() {
    log('componentWillUnmount triggered.')
  }

  async consumableItemClickHandler(consumable: ConsumableItem, quantity: number) {
    // log('consumableItemClickHandler triggered. consumable:', consumable)
    await this.props.buyConsumableItem(consumable, quantity)
  }

  render(): JSX.Element {
    return (
      <ComponentWrapper>
        <AccordionContainer componentKey="merchant" caption="Merchant">
          {this.renderMerchant()}
        </AccordionContainer>
      </ComponentWrapper>
    )
  }

  private renderMerchant(): JSX.Element {
    const location = LocationHelper.getItemByKey(this.props.game.currentLocation)!

    return (
      <React.Fragment>
        <DescriptionContainer>
          <DescriptionWrapper>A merchant might sell things you may need.</DescriptionWrapper>
        </DescriptionContainer>
        <ConsumableContainer>{location.merchant!.map((item) => this.renderConsumableItem(item))}</ConsumableContainer>
      </React.Fragment>
    )
  }

  private renderConsumableItem(priceMultiplierItem: PriceMultiplierItem): JSX.Element {
    const consumable = ConsumableHelper.getItemByKey(priceMultiplierItem.key)!
    const cost = PriceMultiplierHelper.calculatePrice(consumable.basePrice, priceMultiplierItem.multiplier)

    const key = consumable.key
    const heading = consumable.name
    const subheading = `(${cost.toLocaleString()} gold) (owns ${PlayerHelper.countAvailableConsumableByKey(this.props.player, consumable.key)})`
    const flavor = consumable.flavor
    const ctaItems: CtaItem[] = [
      { type: PlayerHelper.hasEnoughGold(this.props.player, this.props.game.currentLocation!, consumable, 1) ? 'blue' : 'disabled', label: 'Buy', onClick: () => this.consumableItemClickHandler(consumable, 1) },
      { type: PlayerHelper.hasEnoughGold(this.props.player, this.props.game.currentLocation!, consumable, 10) ? 'blue' : 'disabled', label: 'x10', onClick: () => this.consumableItemClickHandler(consumable, 10) },
      { type: PlayerHelper.hasEnoughGold(this.props.player, this.props.game.currentLocation!, consumable, 100) ? 'blue' : 'disabled', label: 'x100', onClick: () => this.consumableItemClickHandler(consumable, 100) },
    ]

    return <ListItem key={key} heading={heading} subheading={subheading} flavor={flavor} ctaItems={ctaItems} />
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
    buyConsumableItem: async (consumable: ConsumableItem, quantity: number): Promise<void> => {
      await dispatch(GameAction.buyConsumableItem(consumable, quantity))
    },
  }
}

const SegmentMerchant = connect(
  mapStateToProps,
  mapDispatchToProps
)(BaseSegmentMerchant)
export default SegmentMerchant
