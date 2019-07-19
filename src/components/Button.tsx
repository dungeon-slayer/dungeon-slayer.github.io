import * as React from 'react'
import styled from 'styled-components'
import * as Bows from 'bows'

const log = Bows('Button')

const ComponentWrapper = styled.div`
  border-radius: 4px;
  display: inline-block;
  padding: 6px 12px;
  cursor: pointer;
  background-color: #93c6d4;
  transition: background-color 0.3s;
  min-width: 100px;
  text-align: center;

  &:hover {
    background-color: #a1cdda;
  }
`

interface Props {
  label: string
  onClick: any
}

export default class Button extends React.Component<Props> {
  constructor(props: Props) {
    super(props)
  }

  componentDidMount() {
    log('componentDidMount triggered.')
  }

  componentWillUnmount() {
    log('componentWillUnmount triggered.')
  }

  clickHandler(e: Event) {
    if (this.props.onClick) {
      this.props.onClick()
    }
  }

  render(): JSX.Element {
    return <ComponentWrapper onClick={this.clickHandler.bind(this)}>{this.props.label}</ComponentWrapper>
  }
}
