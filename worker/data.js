const undottify = (obj) => Object.keys(obj).reduce((_obj, key) => {
  const value = obj[key]
  const pieces = key.split('.')
  const firstPart = pieces.slice(0, 1).join('.')
  const secondPart = pieces.slice(1, 2).join('.')
  if (secondPart === '') {
    _obj[firstPart] = value
    return _obj
  } else {
    const theRest = pieces.slice(1).join('.')
    const innerObj = {}
    innerObj[theRest] = value
    _obj[firstPart] = _obj[firstPart] || {}
    _obj[firstPart][secondPart] = (theRest.indexOf('.') === -1)
      ? value
      : undottify(innerObj)[secondPart]
    return _obj
  }
}, {})

const transformPost = ({ id, slug, status, type, acf }) => ({
  id,
  slug,
  status,
  type,
  acf: undottify(acf)
})

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

const storeDocument = (data) =>
  storeBasedOnStatus(transformPost(data))

const storeInLiveDatabase = (doc) =>
  Promise.resolve(`Stored ${doc.id} in the live database.`)

const removeFromLiveDatabase = (doc) =>
  Promise.resolve(`Removed ${doc.id} from the live database.`)

const storeInPreviewDatabase = (doc) =>
  Promise.resolve(`Stored ${doc.id} in the preview database.`)

const removeFromPreviewDatabase = (doc) =>
  Promise.resolve(`Removed ${doc.id} from the preview database.`)

const storeInBothDatabases = (doc) =>
  Promise.all([
    storeInLiveDatabase(doc),
    storeInPreviewDatabase(doc)
  ])
    .then(_msgs => `Stored ${doc.id} in both databases.`)

const removeFromBothDatabases = (doc) =>
  Promise.all([
    removeFromLiveDatabase(doc),
    removeFromPreviewDatabase(doc)
  ])
    .then(_msgs => `Removed ${doc.id} from both databases.`)

const removeFromLiveAndStoreInPreviewDatabase = (doc) =>
  Promise.all([
    storeInPreviewDatabase(doc),
    removeFromLiveDatabase(doc)
  ])
    .then(_msgs => `Removed ${doc.id} from live, and stored it in preview.`)

module.exports = {
  storeDocument
}
