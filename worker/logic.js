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
  data: undottify(acf)
})

const error = (label) => (err) => {
  console.error(label, err)
  return err
}

module.exports = {
  transformPost,
  error
}
