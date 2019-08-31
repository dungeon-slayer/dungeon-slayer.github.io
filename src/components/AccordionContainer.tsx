import * as React from 'react'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import styled from 'styled-components'
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown'
import ArrowRightIcon from '@material-ui/icons/ArrowRight'
import * as Bows from 'bows'
import { IconComponent } from 'src/common/interfaces'
import { StoreState } from 'src/store/interface'
import { GameState } from 'src/reducers'
import { GameHelper } from 'src/helpers'
import { ControlAction } from 'src/actions'

const log = Bows('AccordionContainer')

const ComponentWrapper = styled.div``

const CaptionContainer = styled.div`
  padding: 12px 0;
  font-size: 20px;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: opacity 0.3s;

  &:hover {
    opacity: 0.8;
  }
`

const Caption = styled.div``

const ContentContainer = styled.div``

interface Props {
  game: GameState
  toggleAccordion: (accordionKey: string) => Promise<void>

  componentKey: string
  caption: string
}

class BaseAccordionContainer extends React.Component<Props> {
  componentDidMount() {
    log('componentDidMount triggered.')
  }

  componentWillUnmount() {
    log('componentWillUnmount triggered.')
  }

  get isActive(): boolean {
    return GameHelper.isAccordionActive(this.props.game, this.props.componentKey)
  }

  get ArrowIcon(): IconComponent {
    return this.isActive ? ArrowDropDownIcon : ArrowRightIcon
  }

  clickHandler() {
    // log('clickHandler triggered. componentKey:', this.props.componentKey)
    this.props.toggleAccordion(this.props.componentKey)
  }

  render(): JSX.Element {
    return (
      <ComponentWrapper>
        {this.renderCaption()}
        {this.isActive && this.renderContent()}
      </ComponentWrapper>
    )
  }

  private renderCaption(): JSX.Element {
    return (
      <CaptionContainer role="heading" aria-level={2} onClick={() => this.clickHandler()}>
        <this.ArrowIcon />
        <Caption>{this.props.caption}</Caption>
      </CaptionContainer>
    )
  }

  private renderContent(): JSX.Element {
    const restProps = this.props

    return <ContentContainer {...restProps} />
  }
}

function mapStateToProps(state: StoreState) {
  const { game } = state
  return {
    game,
  }
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    toggleAccordion: async (accordionKey: string): Promise<void> => {
      await dispatch(ControlAction.toggleAccordion(accordionKey))
    },
  }
}

const AccordionContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(BaseAccordionContainer)
export default AccordionContainer
