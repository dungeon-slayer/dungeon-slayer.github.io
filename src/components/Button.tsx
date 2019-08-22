import * as React from 'react'
import styled, { css } from 'styled-components'
import * as Bows from 'bows'

const log = Bows('Button')

interface ComponentWrapperProps {
  isDisabled: boolean
  type: string
}

const ComponentWrapper = styled.div`
  border-radius: 4px;
  display: inline-block;
  padding: 6px 12px;
  background-color: #d5d5d5;
  color: #1c1c1c;
  transition: opacity 0.3s, background-color 0.3s, color 0.3s;
  // min-width: 100px;
  width: calc(100% - 24px);
  text-align: center;
  // font-weight: bold;

  ${(props: ComponentWrapperProps) => css`
    ${props.type === 'blue' &&
      `
      background-color: #1976d2;
      color: #ffffff;
    `}

    ${props.type === 'green' &&
      `
      background-color: #19d275;
      color: #ffffff;
    `}

    ${props.type === 'red' &&
      `
      background-color: #dc004e;
      color: #ffffff;
    `}

    ${props.type === 'disabled' &&
      `
      background-color: #d7d7d7;
      color: #9f9f9f;
    `}

    ${!props.isDisabled &&
      `
      cursor: pointer;

      &:hover {
        opacity: 0.75;
      }
    `}
  `}
`

interface Props {
  label: string
  type: 'default' | 'blue' | 'green' | 'red' | 'disabled'
  onClick: any
}

export default class Button extends React.Component<Props> {
  static defaultProps = {
    type: 'default',
  }

  constructor(props: Props) {
    super(props)
  }

  get isDisabled(): boolean {
    return this.props.type === 'disabled'
  }

  componentDidMount() {
    log('componentDidMount triggered.')
  }

  componentWillUnmount() {
    log('componentWillUnmount triggered.')
  }

  clickHandler(e: Event) {
    if (this.props.onClick && !this.isDisabled) {
      this.props.onClick()
    }
  }

  render(): JSX.Element {
    return (
      <ComponentWrapper type={this.props.type} isDisabled={this.isDisabled} onClick={this.clickHandler.bind(this)}>
        {this.props.label}
      </ComponentWrapper>
    )
  }
}
