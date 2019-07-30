import * as React from 'react'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import styled from 'styled-components'
import { FaGithub } from 'react-icons/fa'
import * as Bows from 'bows'
import { StoreState } from 'src/store/interface'

const version = require('../../package.json').version // tslint:disable-line
const log = Bows('Header')

const ComponentWrapper = styled.div`
  padding: 0 24px;
  height: 60px;
  display: flex;
  align-items: center;
`

const CaptionWrapper = styled.div`
  flex-grow: 1;
`

const GameTitle = styled.div`
  display: inline-block;
  font-size: 16px;
  font-weight: bold;
`

const GameVersion = styled.div`
  display: inline-block;
  margin-left: 6px;
  color: #93c6d4;
`

const SocialWrapper = styled.div`
  a {
    display: flex;
    font-size: 24px;
    padding: 6px;
    color: #838383;
    transition: opacity 0.3s;

    &:hover {
      opacity: 0.75;
    }
  }
`

class BaseHeader extends React.Component {
  componentDidMount() {
    log('componentDidMount triggered.')
  }

  componentWillUnmount() {
    log('componentWillUnmount triggered.')
  }

  render(): JSX.Element {
    return (
      <ComponentWrapper>
        <CaptionWrapper>
          <GameTitle>Dungeon Slayer</GameTitle>
          <GameVersion>(v{version})</GameVersion>
        </CaptionWrapper>
        <SocialWrapper>
          <a href="https://github.com/dungeon-slayer/dungeon-slayer.github.io/tree/develop" target="_blank">
            <FaGithub />
          </a>
        </SocialWrapper>
      </ComponentWrapper>
    )
  }
}

function mapStateToProps(state: StoreState) {
  return {}
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {}
}

const Header = connect(
  mapStateToProps,
  mapDispatchToProps
)(BaseHeader)
export default Header
