// Express imports
const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')

// Sequelize imports
const Sequelize = require('sequelize')

// GraphQL imports
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express')
const { makeExecutableSchema } = require('graphql-tools')

const startApp = (sequelize) => {
  // Express app
  const app = express()
  app.use(morgan('tiny'))
  app.use(bodyParser.json())

  // GraphQL
  try {
    const models = require('./models')(sequelize)
    const connectors = require('./graphql/connectors')(models)

    const schema = makeExecutableSchema({
      typeDefs: require('./graphql/schema'),
      resolvers: require('./graphql/resolvers')(connectors)
    })

    app.use('/graphql', graphqlExpress({
      schema: schema
    }))

    app.use('/', graphiqlExpress({
      endpointURL: '/graphql'
    }))
  } catch (e) {
    console.error(e)
  }

  const PORT = process.env.PORT || 5000
  app.listen(PORT, () => console.log(`Ready at http://localhost:${PORT}`))
}

const connectToSql = (fn) => () => {
  // Sequelize configuration
  const { username, password, host, port, database } = {
    username: 'root',
    password: 'password',
    host: 'db',
    port: 3306,
    database: 'wordpress'
  }

  // Connect to SQL
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
        fn(sequelize)
      }
    })
}

const attemptFunction = (fn, attemptsLeft) => {
  if (attemptsLeft > 0) {
    fn().catch((reason) => {
      console.error('Attempt failed:', reason)
      const timeout = 3000
      attemptsLeft--
      console.info(`Attempting ${attemptsLeft} more time${attemptsLeft === 1 ? '' : 's'}`)
      setTimeout(() => attemptFunction(fn, attemptsLeft), timeout)
    })
  }
}

attemptFunction(connectToSql(startApp), 5)
