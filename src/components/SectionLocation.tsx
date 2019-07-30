import * as React from 'react'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { find } from 'lodash'
import styled from 'styled-components'
import * as Bows from 'bows'
import { StoreState } from 'src/store/interface'
import { ProgressState, GameState, BattleState, PlayerState } from 'src/reducers'
import { MobHelper, LocationHelper, BattleHelper, PlayerHelper, HtmlParseHelper, PriceMultiplierHelper, ConsumableHelper, QuestHelper } from 'src/helpers'
import { CharacterItem, PriceMultiplierItem, QuestItem } from 'src/common/interfaces'
import { BattleAction, GameAction } from 'src/actions'
import ListItem from './ListItem'
import { mediaQueries } from 'src/constants'
import { LocationItem, drops, DropItem, ConsumableItem } from 'src/data'

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

const SubcaptionContainer = styled.div`
  font-size: 20px;
  font-weight: bold;
  margin: 24px 0 12px 0;
`

const DescriptionContainer = styled.div``

const DescriptionWrapper = styled.div`
  margin: 4px 0;
`

const GoldDescriptionWrapper = styled(DescriptionWrapper)`
  margin-top: 12px;
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

const DropContainer = styled.div`
  margin-top: 24px;
`

const NoDropContainer = styled(DropContainer)`
  color: #dc0073;
`

const ConsumableContainer = styled.div`
  margin-top: 24px;
`

const QuestContainer = styled.div`
  margin-top: 24px;
`

const NoQuestContainer = styled(QuestContainer)`
  color: #dc0073;
`

interface Props {
  progress: ProgressState
  game: GameState
  battle: BattleState
  player: PlayerState
  sellDropItem: (drop: DropItem) => Promise<void>
  buyConsumableItem: (consumable: ConsumableItem) => Promise<void>
  deliverQuestItem: (quest: QuestItem) => Promise<void>
  engageBattle: (mob: CharacterItem) => Promise<void>
}

class BaseSectionLocation extends React.Component<Props> {
  componentDidMount() {
    log('componentDidMount triggered.')
  }

  componentWillUnmount() {
    log('componentWillUnmount triggered.')
  }

  get currentLocation(): LocationItem | undefined {
    return LocationHelper.getItemByKey(this.props.game.currentLocation)
  }

  get hasAlchemist(): boolean {
    return LocationHelper.hasAlchemistByKey(this.props.game.currentLocation)
  }

  get hasMerchant(): boolean {
    return LocationHelper.hasMerchantByKey(this.props.game.currentLocation)
  }

  get hasQuestGiver(): boolean {
    return LocationHelper.hasQuestGiverByKey(this.props.game.currentLocation)
  }

  get hasDungeon(): boolean {
    return LocationHelper.hasDungeonByKey(this.props.game.currentLocation)
  }

  get displayGoldDescription(): boolean {
    return this.hasAlchemist || this.hasMerchant
  }

  get currentLocationName(): string {
    if (!this.currentLocation) {
      return 'Unknown Location'
    }
    return this.currentLocation.name
  }

  get currentLocationFlavorText(): string {
    if (!this.currentLocation) {
      return ''
    }
    return this.currentLocation.flavor
  }

  get availableDropsToSell(): DropItem[] {
    const outputDrops: DropItem[] = []

    for (const drop of drops) {
      const priceMultiplierValue = PriceMultiplierHelper.getPriceMultiplierValue(this.currentLocation!.alchemist!, drop)
      if (priceMultiplierValue > 0) {
        const availableDropItem = find(this.props.player.availableDrops!, (ad) => ad.key === drop.key)
        if (availableDropItem && availableDropItem.quantity > 0) {
          outputDrops.push(drop)
        }
      }
    }

    return outputDrops
  }

  get availableQuests(): QuestItem[] {
    const location = LocationHelper.getItemByKey(this.props.game.currentLocation)!
    const availableQuests = PlayerHelper.getAvailableQuests(this.props.player, location)
    return availableQuests
  }

  async dropItemClickHandler(drop: DropItem) {
    // log('dropItemClickHandler triggered. drop:', drop)
    await this.props.sellDropItem(drop)
  }

  async consumableItemClickHandler(consumable: ConsumableItem) {
    // log('consumableItemClickHandler triggered. consumable:', consumable)
    await this.props.buyConsumableItem(consumable)
  }

  async questItemClickHandler(quest: QuestItem) {
    // log('questItemClickHandler triggered. quest:', quest)
    await this.props.deliverQuestItem(quest)
  }

  async mobItemClickHandler(mob: CharacterItem) {
    // log('mobItemClickHandler triggered. mob:', mob)
    await this.props.engageBattle(mob)
  }

  render(): JSX.Element {
    return (
      <ComponentWrapper>
        {this.renderCaption()}
        {this.renderDescription()}
        {this.hasAlchemist && this.renderAlchemist()}
        {this.hasMerchant && this.renderMerchant()}
        {this.hasQuestGiver && this.renderQuestGiver()}
        {this.hasDungeon && this.renderDungeon()}
      </ComponentWrapper>
    )
  }

  private renderCaption(): JSX.Element {
    return <CaptionContainer>Location</CaptionContainer>
  }

  private renderDescription(): JSX.Element {
    const sentences = [`You are at <strong>${this.currentLocationName}</strong>.`, this.currentLocationFlavorText]
    if (LocationHelper.hasDungeonByKey(this.props.game.currentLocation)) {
      sentences.push(`Be on your guard as this place is filled with hostile mobs.`)
    } else {
      sentences.push(`Check around the region to see if anything can be helpful.`)
    }

    return (
      <DescriptionContainer>
        <DescriptionWrapper>{HtmlParseHelper.parse(sentences.join(' '))}</DescriptionWrapper>
        {this.displayGoldDescription && (
          <GoldDescriptionWrapper>
            You have <strong>{this.props.player.gold!.toLocaleString()}</strong> gold.
          </GoldDescriptionWrapper>
        )}
      </DescriptionContainer>
    )
  }

  private renderAlchemist(): JSX.Element | null {
    return (
      <React.Fragment>
        <SubcaptionContainer>Alchemist</SubcaptionContainer>
        <DescriptionContainer>
          <DescriptionWrapper>The residential alchemist seeks out for exotic items found in the dungeons.</DescriptionWrapper>
        </DescriptionContainer>
        {this.renderDrops()}
      </React.Fragment>
    )
  }

  private renderDrops(): JSX.Element {
    if (this.availableDropsToSell.length === 0) {
      return <NoDropContainer>There are no items you can sell.</NoDropContainer>
    } else {
      return <DropContainer>{drops.map((drop) => this.renderDropItem(drop))}</DropContainer>
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
    const subheading = `(${sellPrice} gold) (owns ${availableDropItem.quantity})`
    const flavor = drop.flavor
    const ctaType = 'blue'
    const ctaLabel = 'Sell'

    return <ListItem key={key} ctaType={ctaType as any} heading={heading} subheading={subheading} flavor={flavor} ctaLabel={ctaLabel} onClick={() => this.dropItemClickHandler(drop)} />
  }

  private renderMerchant(): JSX.Element {
    const location = LocationHelper.getItemByKey(this.props.game.currentLocation)!

    return (
      <React.Fragment>
        <SubcaptionContainer>Merchant</SubcaptionContainer>
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
    const subheading = `(${cost} gold) (owns ${PlayerHelper.countAvailableConsumableByKey(this.props.player, consumable.key)})`
    const flavor = consumable.flavor
    const ctaType = 'blue'
    const ctaLabel = 'Buy'

    return <ListItem key={key} ctaType={ctaType as any} heading={heading} subheading={subheading} flavor={flavor} ctaLabel={ctaLabel} onClick={() => this.consumableItemClickHandler(consumable)} />
  }

  private renderQuestGiver(): JSX.Element {
    return (
      <React.Fragment>
        <SubcaptionContainer>Quest Giver</SubcaptionContainer>
        <DescriptionContainer>
          <DescriptionWrapper>Locals who may wish to seek assistance from adventurers use quest giver as proxy to deliver the job request.</DescriptionWrapper>
        </DescriptionContainer>
        {this.renderQuests()}
      </React.Fragment>
    )
  }

  private renderQuests(): JSX.Element {
    if (this.availableQuests.length > 0) {
      return <QuestContainer>{this.availableQuests.map((quest) => this.renderQuestItem(quest))}</QuestContainer>
    } else {
      return <NoQuestContainer>There are no quests available.</NoQuestContainer>
    }
  }

  private renderQuestItem(quest: QuestItem): JSX.Element {
    const key = quest.key
    const heading = quest.name
    const subheading = ``
    const conversation = quest.conversation
    const explanations = [QuestHelper.getRequestLabel(quest), QuestHelper.getRewardLabel(quest)]
    const ctaType = 'blue'
    const ctaLabel = 'Deliver'

    return <ListItem key={key} ctaType={ctaType as any} heading={heading} subheading={subheading} conversation={conversation} explanations={explanations} ctaLabel={ctaLabel} onClick={() => this.questItemClickHandler(quest)} />
  }

  private renderDungeon(): JSX.Element {
    return (
      <React.Fragment>
        <SubcaptionContainer>Dungeon</SubcaptionContainer>
        <DescriptionContainer>
          <DescriptionWrapper>
            <PropertyKey>Queue Size:</PropertyKey> <PropertyValue>{PlayerHelper.getMobQueueSize(this.props.player.character!.currentLevel).toLocaleString()}</PropertyValue>
          </DescriptionWrapper>
        </DescriptionContainer>
        <MobContainer>{this.props.game.mobs!.map((mob) => this.renderMobItem(mob))}</MobContainer>
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
    const flavor = ''

    let ctaType = 'blue'
    let ctaLabel = 'Fight'
    if (BattleHelper.isEngaging(this.props.battle) && this.props.battle.targetMob!.id === mob.id) {
      ctaType = 'disabled'
      ctaLabel = 'In Combat'
    }

    return <ListItem key={key} ctaType={ctaType as any} heading={heading} subheading={subheading} flavor={flavor} ctaLabel={ctaLabel} onClick={() => this.mobItemClickHandler(mob)} />
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
    sellDropItem: async (drop: DropItem): Promise<void> => {
      await dispatch(GameAction.sellDropItem(drop))
    },
    buyConsumableItem: async (consumable: ConsumableItem): Promise<void> => {
      await dispatch(GameAction.buyConsumableItem(consumable))
    },
    deliverQuestItem: async (quest: QuestItem): Promise<void> => {
      await dispatch(GameAction.deliverQuestItem(quest))
    },
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
