import * as React from 'react'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import styled from 'styled-components'
import * as Bows from 'bows'
import { StoreState } from 'src/store/interface'
import { mediaQueries } from 'src/constants'
import SegmentAbility from './SegmentAbility'
import SegmentConsumable from './SegmentConsumable'
import SegmentDrop from './SegmentDrop'

const log = Bows('SectionCharacter')

const ComponentWrapper = styled.div``

const CaptionContainer = styled.div`
  font-size: 24px;
  font-weight: bold;
  text-transform: uppercase;
  margin-bottom: 24px;

  @media ${mediaQueries.mediumUp} {
    display: none;
  }
`

interface Props {
  _placeholder?: any
}

class BaseSectionCharacter extends React.Component<Props> {
  componentDidMount() {
    log('componentDidMount triggered.')
  }

  componentWillUnmount() {
    log('componentWillUnmount triggered.')
  }

  render(): JSX.Element {
    return (
      <ComponentWrapper>
        {this.renderCaption()}
        <SegmentAbility />
        <SegmentConsumable />
        <SegmentDrop />
      </ComponentWrapper>
    )
  }

  private renderCaption(): JSX.Element {
    return (
      <CaptionContainer role="heading" aria-level={1}>
        Character
      </CaptionContainer>
    )
  }
}

function mapStateToProps(state: StoreState) {
  return {}
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {}
}

const SectionCharacter = connect(
  mapStateToProps,
  mapDispatchToProps
)(BaseSectionCharacter)
export default SectionCharacter
