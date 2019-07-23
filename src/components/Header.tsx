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
  font-size: 16px;
  font-weight: bold;
  display: flex;
  align-items: center;
`

const CaptionWrapper = styled.div`
  flex-grow: 1;
`

const SocialWrapper = styled.div`
  a {
    display: flex;
    font-size: 24px;
    padding: 6px;
    color: #666666;
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
        <CaptionWrapper>Dungeon Slayer (v{version})</CaptionWrapper>
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
