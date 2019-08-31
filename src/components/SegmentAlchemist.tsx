import * as React from 'react'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { find } from 'lodash'
import styled from 'styled-components'
import * as Bows from 'bows'
import { StoreState } from 'src/store/interface'
import { PlayerState, BattleState, GameState } from 'src/reducers'
import { PlayerHelper, PriceMultiplierHelper, LocationHelper } from 'src/helpers'
import { GameAction } from 'src/actions'
import ListItem from './ListItem'
import { CtaItem } from 'src/common/interfaces'
import { DropItem, drops, LocationItem } from 'src/data'
import AccordionContainer from './AccordionContainer'

const log = Bows('SegmentAlchemist')

const ComponentWrapper = styled.div``

const DescriptionContainer = styled.div``

const DescriptionWrapper = styled.div`
  margin: 4px 0;
`

const DropContainer = styled.div`
  margin-top: 24px;
`

const NoDropContainer = styled(DropContainer)`
  color: #dc0073;
`

interface Props {
  player: PlayerState
  battle: BattleState
  game: GameState
  sellDropItem: (drop: DropItem, quantity: number) => Promise<void>
}

class BaseSegmentAlchemist extends React.Component<Props> {
  componentDidMount() {
    log('componentDidMount triggered.')
  }

  componentWillUnmount() {
    log('componentWillUnmount triggered.')
  }

  get currentLocation(): LocationItem | undefined {
    return LocationHelper.getItemByKey(this.props.game.currentLocation)
  }

  get availableDropsForSell(): DropItem[] {
    const outputDrops: DropItem[] = []

    for (const drop of drops) {
      if (drop.basePrice > 0) {
        const priceMultiplierValue = PriceMultiplierHelper.getPriceMultiplierValue(this.currentLocation!.alchemist!, drop)
        if (priceMultiplierValue > 0) {
          const availableDropItem = find(this.props.player.availableDrops!, (ad) => ad.key === drop.key)
          if (availableDropItem && availableDropItem.quantity > 0) {
            outputDrops.push(drop)
          }
        }
      }
    }

    return outputDrops
  }

  async dropItemClickHandler(drop: DropItem, quantity: number) {
    // log('dropItemClickHandler triggered. drop:', drop)
    await this.props.sellDropItem(drop, quantity)
  }

  render(): JSX.Element {
    return (
      <ComponentWrapper>
        <AccordionContainer componentKey="alchemist" caption="Alchemist">
          {this.renderAlchemist()}
        </AccordionContainer>
      </ComponentWrapper>
    )
  }

  private renderAlchemist(): JSX.Element | null {
    return (
      <React.Fragment>
        <DescriptionContainer>
          <DescriptionWrapper>The residential alchemist seeks out for exotic items found in the dungeons.</DescriptionWrapper>
        </DescriptionContainer>
        {this.renderDrops()}
      </React.Fragment>
    )
  }

  private renderDrops(): JSX.Element {
    if (this.availableDropsForSell.length === 0) {
      return <NoDropContainer>There are no items you can sell.</NoDropContainer>
    } else {
      return <DropContainer>{this.availableDropsForSell.map((drop) => this.renderDropItem(drop))}</DropContainer>
    }
  }

  private renderDropItem(drop: DropItem): JSX.Element | null {
    const priceMultiplierValue = PriceMultiplierHelper.getPriceMultiplierValue(this.currentLocation!.alchemist!, drop)
    if (!priceMultiplierValue) {
      return null
    }

    const availableDropItem = find(this.props.player.availableDrops!, (ad) => ad.key === drop.key)
    if (!availableDropItem) {
      return null
    }

    const key = drop.key
    const sellPrice = PriceMultiplierHelper.calculatePrice(drop.basePrice, priceMultiplierValue)
    const heading = drop.name
    const subheading = `(${sellPrice.toLocaleString()} gold) (owns ${availableDropItem.quantity})`
    const flavor = drop.flavor
    const ctaItems: CtaItem[] = [
      { type: PlayerHelper.hasEnoughDrops(this.props.player, drop.key, 1) ? 'blue' : 'disabled', label: 'Sell', onClick: () => this.dropItemClickHandler(drop, 1) },
      { type: PlayerHelper.hasEnoughDrops(this.props.player, drop.key, 10) ? 'blue' : 'disabled', label: 'x10', onClick: () => this.dropItemClickHandler(drop, 10) },
      { type: PlayerHelper.hasEnoughDrops(this.props.player, drop.key, 100) ? 'blue' : 'disabled', label: 'x100', onClick: () => this.dropItemClickHandler(drop, 100) },
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
    sellDropItem: async (drop: DropItem, quantity: number): Promise<void> => {
      await dispatch(GameAction.sellDropItem(drop, quantity))
    },
  }
}

const SegmentAlchemist = connect(
  mapStateToProps,
  mapDispatchToProps
)(BaseSegmentAlchemist)
export default SegmentAlchemist
