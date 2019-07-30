import * as React from 'react'
import styled from 'styled-components'
import * as Bows from 'bows'
import { SelectItem } from 'src/common/interfaces'

const log = Bows('Select')

const ComponentWrapper = styled.div`
  margin-top: 2px;

  select {
    font-size: 18px;
  }
`

interface Props {
  selectedValue: string
  options: SelectItem[]
  onChange: any
}

export default class Select extends React.Component<Props> {
  static defaultProps = {
    selectedValue: '',
    onChange: undefined,
  }

  constructor(props: Props) {
    super(props)
  }

  componentDidMount() {
    log('componentDidMount triggered.')
  }

  componentWillUnmount() {
    log('componentWillUnmount triggered.')
  }

  changeHandler(e: Event) {
    if (this.props.onChange) {
      this.props.onChange(e)
    }
  }

  render(): JSX.Element {
    return (
      <ComponentWrapper>
        <select defaultValue={this.props.selectedValue} onChange={this.changeHandler.bind(this)}>
          {this.props.options.map((option) => this.renderOption(option))}
        </select>
      </ComponentWrapper>
    )
  }

  private renderOption(option: SelectItem): JSX.Element {
    const properties: any = { key: option.value, value: option.value }
    return React.createElement('option', properties, option.label)
  }
}
