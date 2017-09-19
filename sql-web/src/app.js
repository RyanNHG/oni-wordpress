// Express
const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
// Sequelize
const Sequelize = require('sequelize')

// GraphQL
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express')
const { makeExecutableSchema } = require('graphql-tools')

const PORT = process.env.PORT || 5000

const { username, password, host, port, database } = {
  username: 'root',
  password: 'password',
  host: 'db',
  port: 3306,
  database: 'wordpress'
}

const runApp = (sequelize) => {
  const { Post, PostMeta, Options } = require('./models')(sequelize)

  const app = express()
  app.use(morgan('tiny'))
  app.use(bodyParser.json())

  const mysteryFields =
    { exclude: [ 'createdAt', 'updatedAt', 'wpPostmetumMetaId', 'guid' ] }

  const postMetaInclude = [{
    model: PostMeta,
    where: { 'ID': Sequelize.col('post_id'), 'metaKey': { $notLike: `\\_%` } },
    attributes: mysteryFields
  }]

  const metaListToObject = (list) =>
    list.reduce((obj, { metaKey, metaValue }) => {
      obj[metaKey] = metaValue
      return obj
    }, {})

  const undottify = (obj) => Object.keys(obj).reduce((_obj, key) => {
    const value = obj[key]
    const pieces = key.split('.')
    const firstPart = pieces.slice(0,1).join('.')
    const secondPart = pieces.slice(1,2).join('.')
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

  const transformPost = (post) => undottify(
    metaListToObject([
      { metaKey: 'id', metaValue: post.id },
      { metaKey: 'slug', metaValue: post.postName },
      ...post['wp_postmeta']
    ])
  )

  const transformPosts = posts =>
    posts.map(transformPost)

  const transformTypeString = (types) => types.optionValue
    .split('rest_base";')
    .filter(str => str.indexOf('s') === 0)
    .map(str => str.substring(str.indexOf('"') + 1, str.length))
    .map(str => str.substring(0, str.indexOf('"')))

  const lazyMansPlural = (word) => [
    word,
    word + 's',
    word ? word.substring(0, word.length - 1) : ''
  ]

  const getDistinctPostTypes = () =>
    Options.findOne({
      where: { 'option_name': 'cptui_post_types' },
      attributes: mysteryFields
    })
      .then(transformTypeString)

  const getPosts = (postType) =>
    Post.findAll({
      where: { 'post_type': lazyMansPlural(postType) },
      attributes: mysteryFields,
      include: postMetaInclude
    })

  const getPost = (postType, postId) =>
    Post.findOne({
      where: { 'post_type': lazyMansPlural(postType), 'id': postId },
      attributes: mysteryFields,
      include: postMetaInclude
    })

  const schema = makeExecutableSchema({
    typeDefs: require('./graphql/schema'),
    resolvers: require('./graphql/resolvers')({
      getPosts,
      getPost
    })
  })

  const respondWithError = (res) => (reason) =>
    res.json({
      error: true,
      message: reason instanceof String ? reason : 'No results found.',
      data: []
    })

  app.use('/graphql', graphqlExpress({
    schema: schema
  }))

  app.use('/', graphiqlExpress({
    endpointURL: '/graphql'
  }))

  // Types
  app.get('/api', (req, res) => {
    getDistinctPostTypes()
      .then(types =>
        res.json({
          error: false,
          message: `Found ${types.length} custom type${types.length === 1 ? '' : 's'}.`,
          data: types
        })
      )
      .catch(respondWithError(res))
  })

  app.get('/api/:type', (req, res) => {
    const type = req.params.type
    getPosts(type)
      .then(transformPosts)
      .then(posts =>
        res.json({
          error: false,
          message: `Found ${posts.length} result${posts.length === 1 ? '' : 's'}.`,
          data: posts
        })
      )
      .catch(respondWithError(res))
  })

  app.get('/api/:type/:slug', (req, res) => {
    const type = req.params.type
    const slug = req.params.slug
    getPost(type, slug)
      .then(transformPost)
      .then(post =>
        res.json({
          error: false,
          message: post ? `Found 1 result.` : `Found 0 results.`,
          data: post ? [ post ] : []
        })
      )
      .catch(respondWithError(res))
  })

  app.listen(PORT, () => console.log(`Ready at http://localhost:${PORT}`))
}

const start = () => {
  const sequelize = new Sequelize(`mysql://${username}:${password}@${host}:${port}/${database}`)
  let error = false

  return sequelize
    .authenticate()
    .catch((reason) => {
      error = true
      return Promise.reject(reason)
    })
    .then(() => {
      if (error === false) {
        runApp(sequelize)
      }
    })
}

const attemptFunction = (fn, attemptsLeft) => {
  if (attemptsLeft > 0) {
    fn().catch(() => {
      const timeout = 3000
      attemptsLeft--
      console.info(`Attempting ${attemptsLeft} more time${attemptsLeft === 1 ? '' : 's'}`)
      setTimeout(() => attemptFunction(fn, attemptsLeft), timeout)
    })
  }
}

attemptFunction(start, 5)
