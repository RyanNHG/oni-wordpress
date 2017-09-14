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
  const modelFunctions = require('./models')
  const { Post, PostMeta } = Object.keys(modelFunctions).reduce((obj, key) => {
    obj[key] = modelFunctions[key](sequelize)
    return obj
  }, {})

  const app = express()
  app.use(morgan('tiny'))

  const debug = (label) => (thing) => {
    console.log(label, thing)
    return thing
  }

  const getDistinctPostTypes = ({ Post }) =>
    Post.aggregate('post_type', 'DISTINCT', { plain: false })
      .then(types => types.map(obj => obj.DISTINCT))

  const getPostsOfType = ({ Post, PostMeta }, postType) =>
    Post.findAll({
      where: { 'post_type': postType },
      attributes: { exclude: [ 'createdAt', 'updatedAt', 'wpPostmetumMetaId' ] }
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
