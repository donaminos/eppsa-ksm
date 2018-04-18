import React from "react"

import {
  acceptMateRequest,
  rejectMateRequest,
  requestMate,
  cancelRequestMate,
  leaveChallengeLobby
} from "../../actionCreators"
import * as requestedMateStates from "../../requestedMateStates"

export default function ChallengeLobby(props) {
  if (props.requestedMate.gameId) {
    return renderRequestedMate(props)
  }

  if (props.mateRequests.size > 0) {
    return renderMateRequest(props)
  }

  return renderLobby(props)
}

function renderRequestedMate({ requestedMate, gameServer, dispatch }) {
  const text = requestedMateText(requestedMate.requestState)

  return (
    <div>
      { text }
      <button onClick={ () => dispatch(cancelRequestMate(gameServer)) }>
        Zurück
      </button>
    </div>
  )
}

function requestedMateText(state) {
  switch (state) {
    case requestedMateStates.REJECTED: return "Der Spieler hat abgelehnt"
    case requestedMateStates.NOT_AVAILABLE: return "Der Spieler hat die Lobby verlassen"
    default: return "Warte auf Spieler"
  }
}

function renderMateRequest({ mateRequests, gameServer, dispatch }) {
  const mateRequest = mateRequests.values().next().value

  return (
    <div>
      { "Jemand möchte mit dir spielen." }
      <button onClick={ () => dispatch(rejectMateRequest(mateRequest, gameServer)) }>
        Ablehnen
      </button>
      <button onClick={ () => dispatch(acceptMateRequest(mateRequest, gameServer)) }>
        Annehmen
      </button>
    </div>
  )
}

function renderLobby({ challengeNumber, connectedGames, dispatch, gameId, gameServer }) {
  const gamesInLobby = findGamesInLobby(challengeNumber, connectedGames, gameId)

  return (
    <div>
      <div>ChallengeLobby</div>
      <div>
        {
          gamesInLobby.map((game) =>
            <button
              key={ game.gameId }
              onClick={ () => dispatch(requestMate(game.gameId, gameServer)) }>
              { game.name }
            </button>
          )
        }
      </div>
      <button onClick={ () => dispatch(leaveChallengeLobby(gameServer)) }>
        Zurück
      </button>
    </div>
  )
}

function findGamesInLobby(challengeNumber, connectedGames, gameId) {
  return connectedGames.filter((game) =>
    gameId !== game.gameId && challengeNumber === game.challengeNumber && game.inLobby
  )
}
