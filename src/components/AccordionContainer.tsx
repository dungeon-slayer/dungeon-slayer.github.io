import * as React from 'react'
import styled from 'styled-components'
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown'
import ArrowRightIcon from '@material-ui/icons/ArrowRight'

import * as Bows from 'bows'
import { IconComponent } from 'src/common/interfaces'

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
  caption: string
}

interface State {
  isActive: boolean
}

const defaultState: State = {
  isActive: true,
}

export class AccordionContainer extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = defaultState
  }

  componentDidMount() {
    log('componentDidMount triggered.')
  }

  componentWillUnmount() {
    log('componentWillUnmount triggered.')
  }

  get ArrowIcon(): IconComponent {
    return this.state.isActive ? ArrowDropDownIcon : ArrowRightIcon
  }

  clickHandler() {
    log('clickHandler triggered.')
    this.setState({
      isActive: !this.state.isActive,
    })
  }

  render(): JSX.Element {
    return (
      <ComponentWrapper>
        {this.renderCaption()}
        {this.state.isActive && this.renderContent()}
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
