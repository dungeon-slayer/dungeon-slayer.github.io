import * as React from 'react'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import styled from 'styled-components'
import * as Bows from 'bows'
import { StoreState } from 'src/store/interface'

const version = require('../../package.json').version // tslint:disable-line
const log = Bows('Header')

const ComponentWrapper = styled.div`
  padding: 24px;
  font-size: 16px;
  font-weight: bold;
`

class BaseHeader extends React.Component {
  componentDidMount() {
    log('componentDidMount triggered.')
  }

  componentWillUnmount() {
    log('componentWillUnmount triggered.')
  }

  render(): JSX.Element {
    return <ComponentWrapper>Dungeon Slayer (v{version})</ComponentWrapper>
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
