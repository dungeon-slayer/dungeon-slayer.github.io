import * as React from 'react'
import styled from 'styled-components'
import * as Bows from 'bows'

const log = Bows('ViewNotFound')

const ComponentWrapper = styled.div``

export default class ViewNotFound extends React.Component {
  componentDidMount() {
    log('componentDidMount triggered.')
  }

  componentWillUnmount() {
    log('componentWillUnmount triggered.')
  }

  render() {
    return <ComponentWrapper>Not found</ComponentWrapper>
  }
}
