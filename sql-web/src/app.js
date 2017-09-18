const express = require('express')
const morgan = require('morgan')
const Sequelize = require('sequelize')

const { username, password, host, port, database } = {
  username: 'root',
  password: 'password',
  host: 'db',
  port: 3306,
  database: 'wordpress'
}

const runApp = (sequelize) => {
  const { Post, PostMeta } = require('./models')(sequelize)

  const app = express()
  app.use(morgan('tiny'))

  const debug = (label) => (thing) => {
    console.log(label, thing)
    return thing
  }

  const mysteryFields =
    { exclude: [ 'createdAt', 'updatedAt', 'wpPostmetumMetaId', 'guid' ] }

  const postMetaInclude = [{
    model: PostMeta,
    where: { 'ID': Sequelize.col('post_id'), 'metaKey': { $notLike: `\\_%` } },
    attributes: mysteryFields
  }]

  const getDistinctPostTypes = ({ Post }) =>
    Post.aggregate('post_type', 'DISTINCT', { plain: false })
      .then(types => types.map(obj => obj.DISTINCT))

  const getPostsOfType = ({ Post, PostMeta }, postType) =>
    Post.findAll({
      where: { 'post_type': postType },
      attributes: mysteryFields,
      include: postMetaInclude
    })

  const getPost = ({ Post, PostMeta }, postType, postId) =>
    Post.findOne({
      where: { 'post_type': postType, 'id': postId },
      attributes: mysteryFields,
      include: postMetaInclude
    })

  const respondWithError = (res) => (reason) =>
    res.json({
      error: true,
      message: reason,
      data: []
    })

  // Types
  app.get('/types', (req, res) => {
    getDistinctPostTypes({ Post })
      .then(types =>
        res.json({
          error: false,
          message: `Found ${types.length} type${types.length === 1 ? '' : 's'}.`,
          data: types
        })
      )
      .catch(respondWithError(res))
  })

  app.get('/:type', (req, res) => {
    const type = req.params.type
    getPostsOfType({ Post, PostMeta }, type)
      .then(posts =>
        res.json({
          error: false,
          message: `Found ${posts.length} ${type}${posts.length === 1 ? '' : 's'}.`,
          data: posts
        })
      )
      .catch(respondWithError(res))
  })

  app.get('/:type/:slug', (req, res) => {
    const type = req.params.type
    const slug = req.params.slug
    getPost({ Post, PostMeta }, type, slug)
      .then(post =>
        res.json({
          error: false,
          message: post ? `Found 1 ${type}.` : `Found 0 ${type}s.`,
          data: post ? [ post ] : []
        })
      )
      .catch(respondWithError(res))
  })

  app.listen(5000, () => console.log(`Ready at http://localhost:5000`))
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
