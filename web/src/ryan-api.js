const axios = require('axios')

const defaultTypes = [
  'posts',
  'pages',
  'media',
  'types',
  'statuses',
  'taxonomies',
  'categories',
  'tags',
  'users',
  'comments',
  'settings'
]

const debug = (thing) => {
  console.log(thing)
  return thing
}

const contains = (list, item) =>
  list.indexOf(item) !== -1

const doesNotContain = (list, item) =>
  !contains(list, item)

const startsWith = (str, substrings) =>
  substrings.some(substring => str.indexOf(substring) === 0)

const getRelativePath = (path, data) =>
  path.substring(data.namespace.length + 2)

module.exports = ({ endpoint, username, password, keepDefaultTypes }) =>
  axios.get(endpoint)
    .then(response => response.data)
    .then(data => Object.keys(data.routes)
      .filter(path => (keepDefaultTypes === true) || doesNotContain(defaultTypes, getRelativePath(path, data)))
      .reduce((routes, path) => {
        const route = data.routes[path]
        const relativePath = getRelativePath(path, data)
        const fullPath = endpoint + '/' + relativePath
        if (relativePath.length > 0 && relativePath.indexOf('/') === -1) {
          routes[relativePath] = {}
          if (contains(route.methods, 'GET')) {
            routes[relativePath].get = getHandler({ fullPath })
          }
        }
        return routes
      }, {}))
    
const getHandler = ({ fullPath }) => (options) =>
  (options && options.id) ? getById({ fullPath, id: options.id }) :
  (options && options.sort) ? getSorted({
    fullPath,
    sortField: startsWith(options.sort, ['-', '+'])
      ? options.sort.substring(1)
      : options.sort
    ,
    ascending: startsWith(options.sort, ['-']) === false
  })
  : get({ fullPath })

const getById = ({ fullPath, id }) =>
  axios.get(`${fullPath}/${id}`).then(handleOne)

const get = ({ fullPath }) =>
  axios.get(fullPath).then(handleMany)

const getSorted = ({ fullPath, sortField, ascending }) =>
  axios.get(`${fullPath}?orderby=${sortField}&order=${ ascending ? 'asc' : 'desc' }`).then(handleMany)

const handleOne = (response) =>
  transformResult(response.data)

const handleMany = (response) =>
  transformResults(response.data)

const transformResults = (results) =>
  results.map(transformResult)

const isManyRelationship = (field) =>
  field instanceof Array && field[0] !== undefined && field[0].ID !== undefined

const isSingleRelationship = (field) =>
  field !== undefined && field.ID !== undefined

const transformRelationships = (fields) =>
  Object.keys(fields).reduce((newFields, fieldName) => {
    const field = fields[fieldName]

    if (isManyRelationship(field)) {
      newFields[fieldName] = field.map(item => transformRelationship(item))
    } else if (isSingleRelationship(field)) {
      newFields[fieldName] = transformRelationship(field)
    }else {
      newFields[fieldName] = field
    }

    return newFields
  }, {})

const transformRelationship = (field) => ({
  id: field.ID,
  title: field.post_title
})
  
const transformResult = (result) => ({
  id: result.id,
  //type: result.type,
  slug: result.slug,
  title: result.title ? result.title.rendered : undefined,
  content: result.content ? result.title.content : undefined,
  fields: undottify(transformRelationships(result.acf))
})

const undottify = (obj) => Object.keys(obj).reduce((_obj, key) => {
  const value = (typeof obj[key] === 'object') && !(obj[key] instanceof Array)
    ? undottify(obj[key])
    : obj[key]
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
    if (theRest.indexOf('.') === -1) {
      _obj[firstPart][secondPart] = value
    } else {
      const undottedInnerThing = undottify(innerObj)[secondPart]
      _obj[firstPart][secondPart] = Object.keys(undottedInnerThing)
        .reduce((__obj, key) => {
          __obj[key] = undottedInnerThing[key]
          return __obj
        }, _obj[firstPart][secondPart] || {})
    }
    return _obj
  }
}, {})
