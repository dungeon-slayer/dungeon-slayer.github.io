import * as React from 'react'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import styled, { css } from 'styled-components'
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown'
import ArrowRightIcon from '@material-ui/icons/ArrowRight'
import { omit, keys } from 'lodash'
import * as Bows from 'bows'
import { IconComponent } from 'src/common/interfaces'
import { StoreState } from 'src/store/interface'
import { GameState } from 'src/reducers'
import { GameHelper } from 'src/helpers'
import { ControlAction } from 'src/actions'

const log = Bows('AccordionContainer')

const ComponentWrapper = styled.div``

interface CaptionContainerProps {
  type: string | undefined
}

const CaptionContainer = styled.div`
  padding: 4px 0;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: opacity 0.3s;

  ${(props: CaptionContainerProps) => css`
    ${props.type === 'heading' &&
      `
      padding: 12px 0;
      font-size: 20px;
    `}
  `}

  &:hover {
    opacity: 0.8;
  }
`

const Caption = styled.div``

const ContentContainer = styled.div``

interface Props {
  game: GameState
  toggleAccordion: (accordionKey: string) => Promise<void>
  setAccordion: (accordionKey: string, isActive: boolean) => Promise<void>

  componentKey: string
  caption: string
  captionType?: string
  isClosedByDefault?: boolean
}

class BaseAccordionContainer extends React.Component<Props> {
  static defaultProps = {
    captionType: 'heading',
    isClosedByDefault: false,
  }

  componentDidMount() {
    log('componentDidMount triggered.')

    if (this.props.isClosedByDefault) {
      this.props.setAccordion(this.props.componentKey, false)
    }
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
    if (this.props.captionType === 'heading') {
      return (
        <CaptionContainer type={this.props.captionType} role="heading" aria-level={2} onClick={() => this.clickHandler()}>
          <this.ArrowIcon />
          <Caption>{this.props.caption}</Caption>
        </CaptionContainer>
      )
    }

    return (
      <CaptionContainer type={this.props.captionType} onClick={() => this.clickHandler()}>
        <this.ArrowIcon />
        <Caption>{this.props.caption}</Caption>
      </CaptionContainer>
    )
  }

  private renderContent(): JSX.Element {
    // const restProps = this.props
    const restProps = omit(this.props, keys(BaseAccordionContainer.defaultProps))
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

    setAccordion: async (accordionKey: string, isActive: boolean): Promise<void> => {
      await dispatch(ControlAction.setAccordion(accordionKey, isActive))
    },
  }
}

const AccordionContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(BaseAccordionContainer)
export default AccordionContainer
