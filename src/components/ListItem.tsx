import * as React from 'react'
import styled, { css } from 'styled-components'
import * as Bows from 'bows'
import Button from './Button'
import { CtaItem } from 'src/common/interfaces'
import { RandomHelper } from 'src/helpers'

const log = Bows('ListItem')

interface ComponentWrapperProps {
  textColor: string
  opacity: string
  bgColor: string
}

const ComponentWrapper = styled.div`
  margin: 8px 0;
  padding: 8px 12px;
  min-height: calc(64px - 16px);
  transition: background-color 0.3s;
  background-color: #d9ebf0;
  border-radius: 4px;
  display: flex;
  align-items: center;

  ${(props: ComponentWrapperProps) => css`
    color: ${props.textColor};
    opacity: ${props.opacity};
    background-color: ${props.bgColor};
  `}

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
const OperatorContainer = styled.div`
  margin-left: 12px;
  display: flex;
  align-items: center;
`

interface ButtonWrapperProps {
  minWidth: string
}

const ButtonWrapper = styled.div`
  margin: 0 4px;

  ${(props: ButtonWrapperProps) => css`
    min-width: ${props.minWidth};
  `}
`

interface Props {
  heading: string
  subheading: string

  flavor: string
  conversation: string
  explanations: string[]
  textColor: string
  opacity: string
  ctaItems: CtaItem[]
  ctaMinWidth: string
  bgColor: string
}

export default class ListItem extends React.Component<Props> {
  static defaultProps = {
    flavor: '',
    conversation: '',
    explanations: [],
    textColor: '#033649',
    opacity: '1',
    ctaItems: [],
    ctaMinWidth: '60px',
    bgColor: '#d9ebf0',
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

  get displayOperators(): boolean {
    return this.props.ctaItems.length > 0
  }

  render(): JSX.Element {
    // log('render triggered. heading:', this.props.heading, 'bgColor:', this.props.bgColor)
    return (
      <ComponentWrapper textColor={this.props.textColor} opacity={this.props.opacity} bgColor={this.props.bgColor}>
        <ContentWrapper>
          <HeadingWrapper>
            <Heading>{this.props.heading}</Heading> <Subheading>{this.props.subheading}</Subheading>
          </HeadingWrapper>
          {this.renderDescription()}
        </ContentWrapper>
        {this.displayOperators && this.renderOperators()}
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

  private renderOperators(): JSX.Element {
    return <OperatorContainer>{this.props.ctaItems.map((cta) => this.renderOperator(cta))}</OperatorContainer>
  }

  private renderOperator(cta: CtaItem): JSX.Element {
    return (
      <ButtonWrapper key={RandomHelper.generateId()} minWidth={this.props.ctaMinWidth}>
        <Button type={cta.type as any} label={cta.label} onClick={cta.onClick} />
      </ButtonWrapper>
    )
  }
}
