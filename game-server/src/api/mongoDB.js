const MongoClient = require("mongodb").MongoClient
const EventEmitter = require("events")

const MONGODB_URI = `${process.env.MONGODB_URI}:27017`
const DATABASE_NAME = "EPPSA_KSM"
const GAMES_COLLECTION = "games"

module.exports = class MongoDB extends EventEmitter {
  contructor() {
    this.logger = logger
  }

  async connect() {
    const client = await MongoClient.connect(MONGODB_URI)
    this.database = client.db(DATABASE_NAME)
  }

  findGame(gameId) {
    return this.database.collection(GAMES_COLLECTION).find({ gameId }).limit(1).next()
  }

  findActiveGames() {
    const filter = { lastUpdate: { $gt: new Date( Date.now() - 60000 ) } }
    const projection = { "name": 1, "avatar": 1, "score": 1, "challengeNumber": 1, "_id": 0}
    return this.database.collection(GAMES_COLLECTION).find(filter).project(projection).toArray()
  }

  async newGame(game) {
    await this.database.collection(GAMES_COLLECTION).insertOne(game)
    this.emit("update")
  }

  async updateGame(game, emitUpdate = true) {
    await this.database.collection(GAMES_COLLECTION)
      .updateOne({ gameId: game.gameId }, { $set: game })
    
    if (emitUpdate) {
      this.emit("update")
    }
  }

  async startChallenge(number, challenge) {
    await this.database.collection(`challenge-${number}`).insertOne(challenge)
  }

  async finishChallenge(number, challenge) {
    const filter = await this.database.collection(`challenge-${number}`)
      .find({ gameId: challenge.gameId })
      .sort({ startTime: -1 })
      .limit(1).next()

    await this.database.collection(`challenge-${number}`).updateOne(filter, { $set: challenge })
  }
}