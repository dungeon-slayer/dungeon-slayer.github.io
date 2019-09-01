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
  // min-height: calc(64px - 16px);
  transition: background-color 0.3s;
  background-color: #d9ebf0;
  border-radius: 4px;

  ${(props: ComponentWrapperProps) => css`
    color: ${props.textColor};
    opacity: ${props.opacity};
    background-color: ${props.bgColor};
  `}

  &:hover {
    background-color: #d9e0f0;
  }
`

const MainContainer = styled.div`
  display: flex;
  align-items: center;
  min-height: 64px;
`

const ExtraContentContainer = styled.div`
  background-color: rgba(0, 0, 0, 0.04);
  border-radius: 4px;
  transition: background-color 0.3s;
  padding: 8px;
  margin-bottom: 8px;

  &:hover {
    background-color: rgba(0, 0, 0, 0.06);
  }
`

const ContentContainer = styled.div`
  flex-grow: 1;
`

const HeadingContainer = styled.div``

const HeadingWrapper = styled.div`
  display: inline-block;
  font-weight: bold;
`

const SubheadingWrapper = styled.div`
  display: inline-block;
`

const DescriptionContainer = styled.div``

const BlurbWrapper = styled.div`
  color: #838383;
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
  heading: string | JSX.Element
  subheading: string | JSX.Element
  blurb?: string | JSX.Element
  extraContent?: JSX.Element

  textColor: string
  opacity: string
  ctaItems: CtaItem[]
  ctaMinWidth: string
  bgColor: string
}

export default class ListItem extends React.Component<Props> {
  static defaultProps = {
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
    return (
      <ComponentWrapper textColor={this.props.textColor} opacity={this.props.opacity} bgColor={this.props.bgColor}>
        <MainContainer>
          <ContentContainer>
            {this.renderHeading()}
            {this.renderDescription()}
          </ContentContainer>
          {this.displayOperators && this.renderOperators()}
        </MainContainer>
        {!!this.props.extraContent && this.renderExtraContent()}
      </ComponentWrapper>
    )
  }

  private renderHeading(): JSX.Element {
    return (
      <HeadingContainer>
        <HeadingWrapper>{this.props.heading}</HeadingWrapper> <SubheadingWrapper>{this.props.subheading}</SubheadingWrapper>
      </HeadingContainer>
    )
  }

  private renderDescription(): JSX.Element {
    return <DescriptionContainer>{this.props.blurb && <BlurbWrapper>{this.props.blurb}</BlurbWrapper>}</DescriptionContainer>
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

  private renderExtraContent(): JSX.Element {
    return <ExtraContentContainer>{this.props.extraContent}</ExtraContentContainer>
  }
}
