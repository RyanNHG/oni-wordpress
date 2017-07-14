const express = require('express')
const morgan = require('morgan')
const WPAPI = require('wpapi')

const { wordpress, port } = {
  port: process.env.PORT || 3000,
  wordpress: {
    host: process.env.WP_HOST || 'localhost',
    port: process.env.WP_PORT || 8080,
    apiSuffix: '/wp/v2',
    endpoint: function () {
      return `http://${this.host}:${this.port}`
    }
  }
}

const app = express()
app.use(morgan('tiny'))

const endpoint = wordpress.endpoint()
console.log(`Discovering routes at ${endpoint}...`)

const transformData = (data) =>
  data.map(result => ({
    id: result.id,
    type: result.type,
    title: result.title ? result.title.rendered : undefined,
    acf: undottify(result.acf)
  }))

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

WPAPI.discover(endpoint).then(wp => {
  app.get('/', (req, res) =>
    wp.people()
      .then(transformData)
      .then((data) => res.json(data))
      .catch(reason => res.json({ error: true, message: reason }))
  )

  app.get('/:type', (req, res) =>
    wp[req.params.type]()
      .then(transformData)
      .then((data) => res.json(data))
      .catch(reason => res.json({ error: true, message: reason }))
  )

  app.listen(port, () => console.log(`Ready at http://localhost:${port}`))
}).catch(console.error)
