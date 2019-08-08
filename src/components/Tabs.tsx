import * as React from 'react'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import styled from 'styled-components'
import * as Bows from 'bows'
import { StoreState } from 'src/store/interface'
import { ControlAction } from 'src/actions'
import { ProgressState, GameState } from 'src/reducers'
import { sections, SectionItem } from 'src/data'
import { mediaQueries } from 'src/constants'

const log = Bows('Tabs')

const ComponentWrapper = styled.div`
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  margin: 0 -6px;
`

const TabWrapper = styled.div`
  flex-grow: 1;
  box-sizing: border-box;
  border-radius: 4px;
  padding: 18px 6px;
  cursor: pointer;
  background-color: #afd5df;
  transition: background-color 0.3s;
  margin: 0 6px;

  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: #93c6d4;
  }
`

const ActiveTabWrapper = styled(TabWrapper)`
  background-color: #93c6d4;
  cursor: default;
  position: relative;

  &:hover {
    background-color: #93c6d4;
  }

  &::after {
    content: '';
    position: absolute;
    top: calc(100% - 4px);
    left: calc(50% - 4px);
    width: 8px;
    height: 8px;
    background-color: #93c6d4;
    transform: rotate(45deg);
  }
`

const IconWrapper = styled.div`
  @media ${mediaQueries.mediumUp} {
    display: none;
  }
`

const NameWrapper = styled.div`
  font-weight: bold;
  padding-bottom: 4px;
  display: none;

  @media ${mediaQueries.mediumUp} {
    display: block;
  }
`

interface Props {
  progress: ProgressState
  game: GameState
  setActiveSection: (section: string) => Promise<void>
}

class BaseTabs extends React.Component<Props> {
  componentDidMount() {
    log('componentDidMount triggered.')
  }

  componentWillUnmount() {
    log('componentWillUnmount triggered.')
  }

  async tabClickHandler(sectionKey: string) {
    // log('tabClickHandler triggered. sectionKey:', sectionKey)
    if (this.props.game.activeSection !== sectionKey) {
      await this.props.setActiveSection(sectionKey)
    }
  }

  render(): JSX.Element {
    return <ComponentWrapper>{sections.map((sectionItem) => this.renderTab(sectionItem))}</ComponentWrapper>
  }

  private renderTab(sectionItem: SectionItem): JSX.Element {
    const _Wrapper = this.props.game.activeSection === sectionItem.key ? ActiveTabWrapper : TabWrapper

    return (
      <_Wrapper key={sectionItem.key} onClick={() => this.tabClickHandler(sectionItem.key)}>
        <IconWrapper>
          <sectionItem.Icon />
        </IconWrapper>
        <NameWrapper>{sectionItem.name}</NameWrapper>
      </_Wrapper>
    )
  }
}

function mapStateToProps(state: StoreState) {
  const { progress, game } = state
  return {
    progress,
    game,
  }
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    setActiveSection: async (section: string): Promise<void> => {
      dispatch(ControlAction.setActiveSection(section))
    },
  }
}

const Tabs = connect(
  mapStateToProps,
  mapDispatchToProps
)(BaseTabs)
export default Tabs
