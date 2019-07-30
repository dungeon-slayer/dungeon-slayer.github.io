import * as React from 'react'
import styled from 'styled-components'
import * as Bows from 'bows'
import Button from './Button'

const log = Bows('ListItem')

const ComponentWrapper = styled.div`
  margin: 8px 0;
  padding: 8px 12px;
  min-height: calc(64px - 16px);
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

const DescriptionWrapper = styled.div``

const FlavorWrapper = styled.div`
  color: #838383;
  line-height 1.1;
  margin: 4px 0;
`

const ConversationWrapper = styled.div`
  color: #838383;
  line-height 1.1;
  margin: 6px 0;
  font-family: TimesNewRoman, "Times New Roman", Times, Baskerville, Georgia, serif;
  letter-spacing: 0;
  font-style: italic;
`

const ExplanationWrapper = styled.div`
  color: #1692bb;
  // font-style: italic;
  line-height 1.1;
  margin: 4px 0;
`
const OperatorWrapper = styled.div`
  margin-left: 12px;
`

interface Props {
  heading: string
  subheading: string
  flavor: string
  conversation: string
  explanations: string[]
  ctaType: 'default' | 'blue' | 'red' | 'disabled'
  ctaLabel: string
  onClick: any
}

export default class ListItem extends React.Component<Props> {
  static defaultProps = {
    ctaType: 'default',
    ctaLabel: 'Click',
    flavor: '',
    conversation: '',
    explanations: [],
    onClick: undefined,
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

  get displayCta(): boolean {
    return !!this.props.onClick
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
          {this.renderDescription()}
        </ContentWrapper>
        {this.displayCta && this.renderOperator()}
      </ComponentWrapper>
    )
  }

  private renderDescription(): JSX.Element {
    return (
      <DescriptionWrapper>
        {this.props.flavor && <FlavorWrapper>{this.props.flavor}</FlavorWrapper>}
        {this.props.conversation && <ConversationWrapper>"{this.props.conversation}"</ConversationWrapper>}
        {this.props.explanations.map((explanation) => this.renderExplanation(explanation))}
      </DescriptionWrapper>
    )
  }

  private renderExplanation(explanation: string): JSX.Element {
    return <ExplanationWrapper>{explanation}</ExplanationWrapper>
  }

  private renderOperator(): JSX.Element {
    return (
      <OperatorWrapper>
        <Button type={this.props.ctaType} label={this.props.ctaLabel} onClick={this.clickHandler.bind(this)} />
      </OperatorWrapper>
    )
  }
}
