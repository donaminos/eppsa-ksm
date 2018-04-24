import React from "react"
import { connect } from "react-redux"
import styled, { ThemeProvider, withTheme } from "styled-components"
import cloneDeep from "lodash.clonedeep"

import Card from "./card"
import GameManualButton from "./gameManualButton"
import { default as Background } from "./background"
import Header from "./header"
import pages from "./pages"

const Container = styled.div`
  background-color: white;
  height: 100%;
  display: flex;
  flex-direction: column;
`

const Header = styled.div`
  height: ${100 - appRatio}%;
  overflow: scroll;
`

const Background = styled(BackgroundComponent)`
  height: ${appRatio}%;
`

const innerRatio = window.innerWidth / window.innerHeight

function Application(props) {
  const { content, gameState, winWidth, winHeight } = props
  const { render, showHeader } = getPageData(props)
  const challenge = props.content.challenges[props.challengeNumber]

  return (
    <ThemeProvider
      theme={ (theme) => updateTheme(theme, winWidth, winHeight, challenge, showHeader) }>
      <Container>
      { showHeader && <Header
        props={ props } /> }
        <Background
          bannerText={ content.name }
          inGameSetup={ inGameSetup(gameState) } >
          <Card>
            { React.createElement(render, props) }
          </Card>
        </Background>
      </Container>
    </ThemeProvider>
  )
}

function enhance(props) {
  if (props.content.challenges[props.challengeNumber]) {
    const challengeTypes = props.content.challenges[props.challengeNumber].challengeTypes
    const challengeType = Object.keys(omit(challengeTypes, "template"))[0]
    const challengeUri = resolveChallengeWebAppUri(challengeType)
    const challengeData = {
      color: props.content.challenges[props.challengeNumber].color,
      challenge: challengeTypes[challengeType],
      shared: props.content.shared,
      staticServerUri: props.staticServerUri,
      assetServerUri: props.assetServerUri,
      gameServerUri: props.gameServerUri,
      room: props.challengeRoom
    }

    const fillColor = challengeData.color
    return Object.assign({ challengeUri, challengeType, challengeData, fillColor }, props)
  }

  return Object.assign({ fillColor: props.theme.colors.secondary }, props)
}

function getPageData({ showGameManual, gameState }) {
  return showGameManual ? pages.GAME_MANUAL : pages[gameState]
}

function updateTheme(theme, winWidth, winHeight, challenge, showHeader) {
  const [cardWidth, cardHeight] = calculateCardSize(winWidth, winHeight, showHeader)
  const cardWidthRatio = cardWidth / 100

  const newTheme = cloneDeep(theme)
  newTheme.font.headline.size *= cardWidthRatio
  newTheme.font.button.size *= cardWidthRatio
  newTheme.font.text.size *= cardWidthRatio
  newTheme.colors.area = challenge ? challenge.color : theme.colors.secondary
  newTheme.layout.smallSpacing *= cardWidthRatio
  newTheme.layout.mediumSpacing *= cardWidthRatio
  newTheme.layout.largeSpacing *= cardWidthRatio
  newTheme.layout.buttonBorder *= cardWidthRatio
  newTheme.layout.iconBorder *= cardWidthRatio
  newTheme.layout.cardPadding *= cardWidthRatio
  newTheme.layout.cardWidth = cardWidth
  newTheme.layout.cardHeight = cardHeight
  return newTheme
}

function calculateCardSize(winWidth, winHeight, showHeader) {
  const innerHeight = showHeader ? winHeight * 0.9 : winHeight
  const winRatio = winWidth / innerHeight
  const maxWidth = 98 // maximal relative width
  const maxRatio = 0.46 // maximal expected display ratio (1:2)
  const cardRatio = 2 / 3

  return [(1 + maxRatio - winRatio) * maxWidth, (1 + maxRatio - winRatio) * maxWidth / cardRatio]
}

export default withTheme(connect((state) => state)(Application))

function inGameSetup(gamestate) {
  switch (gamestate) {
    case "NEW_GAME_AVATAR_SELECTION":
      return "true"
    case "NEW_GAME_AVATAR_CONFIRMATION":
      return "true"
    case "NEW_GAME_NAME_SELECTION":
      return "true"
    default:
      return "false"
  }
}
