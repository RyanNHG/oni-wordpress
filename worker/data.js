const mongoose = require('mongoose')
const { transformPost, error } = require('./logic')

const connections = {
  live: mongoose.connect(process.env.LIVE_MONGO_URI),
  preview: mongoose.connect(process.env.PREVIEW_MONGO_URI)
}

const storeBasedOnStatus = (doc) => {
  switch (doc.status) {
    case 'publish':
      return storeInBothDatabases(doc)
    case 'trash':
      return removeFromBothDatabases(doc)
    default:
      return removeFromLiveAndStoreInPreviewDatabase(doc)
  }
}

const storeInDatabase = (conn) => (doc) =>
  Promise.resolve('Stored document')
    .catch(error('storeInDatabase'))

const removeFromDatabase = (conn) => (doc) =>
  Promise.resolve('Removed document')
    .catch(error('removeFromDatabase'))

const storeInLiveDatabase =
  storeInDatabase(connections.live)

const removeFromLiveDatabase =
  removeFromDatabase(connections.live)

const storeInPreviewDatabase =
  storeInDatabase(connections.preview)

const removeFromPreviewDatabase =
  removeFromDatabase(connections.preview)

const storeInBothDatabases = (doc) =>
  Promise.all([ storeInLiveDatabase(doc), storeInPreviewDatabase(doc) ])
    .then(_msgs => `Stored ${doc.id} in both databases.`)

const removeFromBothDatabases = (doc) =>
  Promise.all([ removeFromLiveDatabase(doc), removeFromPreviewDatabase(doc) ])
    .then(_msgs => `Removed ${doc.id} from both databases.`)

const removeFromLiveAndStoreInPreviewDatabase = (doc) =>
  Promise.all([ storeInPreviewDatabase(doc), removeFromLiveDatabase(doc) ])
    .then(_msgs => `Removed ${doc.id} from live, and stored it in preview.`)

module.exports = {
  storePost: (data) => storeBasedOnStatus(transformPost(data))
}
