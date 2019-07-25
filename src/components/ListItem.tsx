import * as React from 'react'
import styled from 'styled-components'
import * as Bows from 'bows'
import Button from './Button'

const log = Bows('ListItem')

const ComponentWrapper = styled.div`
  margin: 8px 0;
  padding: 12px 12px;
  min-height: calc(60px - 24px);
  transition: background-color 0.3s;
  background-color: #d9ebf0;
  border-radius: 4px;
  display: flex;
  align-items: center;

  &:hover {
    background-color: #d9e0f0;
  }
`

const ContentWrapper = styled.div`
  flex-grow: 1;
`

const HeadingWrapper = styled.div``

const Heading = styled.div`
  display: inline-block;
  font-weight: bold;
`

const Subheading = styled.div`
  display: inline-block;
`

const BlurbWrapper = styled.div`
  color: #666666;
  line-height 1.1;
`

const OperatorWrapper = styled.div`
  margin-left: 12px;
`

interface Props {
  heading: string
  subheading: string
  blurb: string
  ctaType: 'default' | 'blue' | 'red' | 'disabled'
  ctaLabel: string
  onClick: any
}

export default class ListItem extends React.Component<Props> {
  static defaultProps = {
    ctaType: 'default',
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

  clickHandler(e: Event) {
    if (this.props.onClick) {
      this.props.onClick()
    }
  }

  render(): JSX.Element {
    return (
      <ComponentWrapper>
        <ContentWrapper>
          <HeadingWrapper>
            <Heading>{this.props.heading}</Heading> <Subheading>{this.props.subheading}</Subheading>
          </HeadingWrapper>
          {!!this.props.blurb && this.renderBlurb()}
        </ContentWrapper>
        <OperatorWrapper>
          <Button type={this.props.ctaType} label={this.props.ctaLabel} onClick={this.clickHandler.bind(this)} />
        </OperatorWrapper>
      </ComponentWrapper>
    )
  }

  private renderBlurb(): JSX.Element {
    return <BlurbWrapper>{this.props.blurb}</BlurbWrapper>
  }
}
