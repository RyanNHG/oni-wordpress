const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')

// Configuration
const port = process.env.PORT || 80
const token = process.env.WP_SECRET_TOKEN || 'super-secret-token'

// App initialization
const app = express()
app.use(bodyParser.json())
app.use(morgan('tiny'))

const { storeDocument } = require('./data.js')

// Routes
app.post('/api', (req, res) =>
  (token === req.body.token)
    ? storeDocument(req.body.data)
        .then(({ message, data }) => res.json({
          error: false,
          message,
          data
        }))
        .catch(reason => res.json({
          error: true,
          message: reason,
          data: undefined
        }))
    : res.json({
      error: true,
      message: `Invalid token provided.`,
      data: undefined
    })
)

// Start app
app.listen(port, () =>
  console.info(`Worker ready at http://localhost:${port}`)
)