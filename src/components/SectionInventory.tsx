import * as React from 'react'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import styled from 'styled-components'
import * as Bows from 'bows'
import { StoreState } from 'src/store/interface'
import { ConsumableItem, DropItem } from 'src/data'
import { PlayerState } from 'src/reducers'
import { PlayerHelper } from 'src/helpers'
import { PlayerAction } from 'src/actions'
import ListItem from './ListItem'
import { mediaQueries } from 'src/constants'
import { CtaItem } from 'src/common/interfaces'

const log = Bows('SectionInventory')

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
  useConsumable: (consumable: ConsumableItem) => Promise<void>
}

class BaseSectionInventory extends React.Component<Props> {
  componentDidMount() {
    log('componentDidMount triggered.')
  }

  componentWillUnmount() {
    log('componentWillUnmount triggered.')
  }

  async operatorClickHandler(consumable: ConsumableItem) {
    log('operatorClickHandler triggered. consumable:', consumable)
    await this.props.useConsumable(consumable)
  }

  render(): JSX.Element {
    return (
      <ComponentWrapper>
        {this.renderCaption()}
        {this.renderConsumables()}
        {this.renderDrops()}
      </ComponentWrapper>
    )
  }

  private renderCaption(): JSX.Element {
    return <CaptionContainer>Inventory</CaptionContainer>
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
        <SubcaptionContainer>Consumables</SubcaptionContainer>
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
      onClick: () => this.operatorClickHandler(consumable),
    }

    return <ListItem key={consumable.key} heading={heading} subheading={subheading} flavor={flavor} ctaItems={[ctaItem]} />
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
        <SubcaptionContainer>Obtained Drops</SubcaptionContainer>
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
  const { player } = state
  return {
    player,
  }
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    useConsumable: async (consumable: ConsumableItem): Promise<void> => {
      await dispatch(PlayerAction.useConsumable(consumable))
    },
  }
}

const SectionInventory = connect(
  mapStateToProps,
  mapDispatchToProps
)(BaseSectionInventory)
export default SectionInventory
