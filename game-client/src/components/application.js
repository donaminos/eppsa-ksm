import React from "react"
import { connect } from "react-redux"
import styled, { ThemeProvider } from "styled-components"
import cloneDeep from "lodash.clonedeep"

import Card from "./card"
import { default as Background } from "./background"
import Header from "./header"
import pages from "./pages"
import Score from "./score"

const Container = styled.div`
  background-color: white;
  height: 100%;
  display: flex;
  flex-direction: column;
`

class Application extends React.Component {
  constructor(props) {
    super(props)
    this.state = { renderCardContent: true, showHeader: getPageData(props).showHeader }
  }

  componentWillReceiveProps(nextProps) {
    const previousPage = getPageData(this.props)
    const nextPage = getPageData(nextProps)
    if (previousPage.showHeader !== nextPage.showHeader) {
      this.setState({ renderCardContent: false, showHeader: nextPage.showHeader })
      setTimeout(() => this.setState({ renderCardContent: true }), 500)
    }
  }

  render() {
    const { challengeNumber, content, score, showScore } = this.props
    const { render, showHeader } = getPageData(this.props)
    const challenge = content.challenges[challengeNumber]

    return (
      <ThemeProvider theme={ (theme) => updateTheme(theme, challenge) }>
        <Container>
          <Header { ...this.props } show={ showHeader } />
          <Score score={ score } show={ showScore } />
          <Background
            { ...this.props }
            bannerText={ content.name } >
            <Card small={ showHeader }>
              { this.state.renderCardContent && React.createElement(render, this.props) }
            </Card>
          </Background>
        </Container>
      </ThemeProvider>
    )
  }
}

function getPageData({ showGameManual, gameState }) {
  return showGameManual ? pages.GAME_MANUAL : pages[gameState]
}

function updateTheme(theme, challenge) {
  const newTheme = cloneDeep(theme)
  newTheme.colors.area = challenge ? challenge.color : theme.colors.secondary
  return newTheme
}

export default connect((state) => state)(Application)
