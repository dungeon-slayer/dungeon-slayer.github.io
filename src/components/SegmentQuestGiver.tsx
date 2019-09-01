import * as React from 'react'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import styled from 'styled-components'
import * as Bows from 'bows'
import { StoreState } from 'src/store/interface'
import { PlayerState, BattleState, GameState } from 'src/reducers'
import { PlayerHelper, LocationHelper, QuestHelper } from 'src/helpers'
import { GameAction } from 'src/actions'
import ListItem from './ListItem'
import { CtaItem, QuestItem } from 'src/common/interfaces'
import AccordionContainer from './AccordionContainer'

const log = Bows('SegmentQuestGiver')

const ComponentWrapper = styled.div``

const DescriptionContainer = styled.div``

const DescriptionWrapper = styled.div`
  margin: 4px 0;
`

const QuestContainer = styled.div`
  margin-top: 24px;
`

const NoQuestContainer = styled(QuestContainer)`
  color: #dc0073;
`

const QuestBlurbContainer = styled.div`
  color: #1692bb;
  line-height 1.1;
`

const QuestBlurb = styled.div`
  margin: 4px 0;
`

interface Props {
  player: PlayerState
  battle: BattleState
  game: GameState
  deliverQuestItem: (quest: QuestItem) => Promise<void>
}

class BaseSegmentQuestGiver extends React.Component<Props> {
  componentDidMount() {
    log('componentDidMount triggered.')
  }

  componentWillUnmount() {
    log('componentWillUnmount triggered.')
  }

  get availableQuests(): QuestItem[] {
    const location = LocationHelper.getItemByKey(this.props.game.currentLocation)!
    const availableQuests = PlayerHelper.getAvailableQuests(this.props.player, location)
    return availableQuests
  }

  get lockedQuests(): QuestItem[] {
    const location = LocationHelper.getItemByKey(this.props.game.currentLocation)!
    const lockedQuests = PlayerHelper.getLockedQuests(this.props.player, location)
    return lockedQuests
  }

  async questItemClickHandler(quest: QuestItem) {
    await this.props.deliverQuestItem(quest)
  }

  render(): JSX.Element {
    return (
      <ComponentWrapper>
        <AccordionContainer componentKey="quest-giver" caption="Quest Giver">
          {this.renderQuestGiver()}
        </AccordionContainer>
      </ComponentWrapper>
    )
  }

  private renderQuestGiver(): JSX.Element {
    return (
      <React.Fragment>
        <DescriptionContainer>
          <DescriptionWrapper>Locals who may wish to seek assistance from adventurers use quest giver as proxy to deliver the job request.</DescriptionWrapper>
        </DescriptionContainer>
        {this.renderQuests()}
      </React.Fragment>
    )
  }

  private renderQuests(): JSX.Element {
    if (this.availableQuests.length > 0) {
      return (
        <QuestContainer>
          {this.availableQuests.map((quest) => this.renderQuestItem(quest, true))}
          {this.lockedQuests.map((quest) => this.renderQuestItem(quest, false))}
        </QuestContainer>
      )
    } else {
      return <NoQuestContainer>There are no quests available.</NoQuestContainer>
    }
  }

  private renderQuestItem(quest: QuestItem, isAvailable: boolean): JSX.Element {
    const key = quest.key
    const heading = quest.name
    const subheading = ``
    const blurb = (
      <QuestBlurbContainer>
        <QuestBlurb>{QuestHelper.getRequestLabel(quest)}</QuestBlurb>
        <QuestBlurb>{QuestHelper.getRewardLabel(quest)}</QuestBlurb>
      </QuestBlurbContainer>
    )
    let textColor: string | undefined
    let opacity: string | undefined

    const ctaItem: CtaItem = {
      type: 'blue',
      label: 'Deliver',
      onClick: () => this.questItemClickHandler(quest),
    }

    if (!PlayerHelper.hasFulfillQuestRequirement(this.props.player, quest)) {
      ctaItem.type = 'disabled'
    }

    if (!isAvailable) {
      textColor = 'gray'
      opacity = '0.4'
      ctaItem.type = 'disabled'
    }

    return <ListItem key={key} heading={heading} subheading={subheading} blurb={blurb} textColor={textColor} opacity={opacity} ctaItems={[ctaItem]} />
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
    deliverQuestItem: async (quest: QuestItem): Promise<void> => {
      await dispatch(GameAction.deliverQuestItem(quest))
    },
  }
}

const SegmentQuestGiver = connect(
  mapStateToProps,
  mapDispatchToProps
)(BaseSegmentQuestGiver)
export default SegmentQuestGiver
