import React from "react"
import styled from "styled-components"
import BackgroundArc from "../assets/Background_Arc.svg"

import Banner from "./banner"

const Container = styled.div`
  position: relative;
  
  ${props => props.inGameSetup === "true" ? null : "padding-top: 5vw;"};
  
  box-sizing: border-box;

  width: 100%;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`

const StyledBackgroundArc = styled(BackgroundArc)`
  fill: ${props => props.theme.colors.area};
  margin-bottom: -1px;
  width: 100%;
  background-color: white;
`

const Background = styled.div`
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-grow: 1;

  background-color: ${props => props.theme.colors.area};
`

const BannerContainer = styled.div` 
  visibility: ${props => props.visible === "true" ? "visible" : "hidden"}; 
  display: flex; 
  position: absolute;
  transform: translateY(-3vw);
  width: 100%;
  justify-content: center;
  `

export default props =>
  <Container className={ props.className } addTopPadding={ props.inGameSetup }>
    <BannerContainer visible={ props.inGameSetup }>
      <Banner>{ props.bannerText }</Banner>
    </BannerContainer>
    <StyledBackgroundArc />
    <Background>
      { props.children }
    </Background>
  </Container>
