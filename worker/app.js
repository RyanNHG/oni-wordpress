const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')

const port = process.env.PORT || 80
const token = process.env.WP_SECRET_TOKEN || 'super-secret-token'

const app = express()
app.use(bodyParser.json())
app.use(morgan('tiny'))

app.post('/api', (req, res) =>
  (token === req.body.token)
    ? res.json({ error: false, message: `Action received: ${req.body.action}` })
    : res.json({ error: true, message: `Invalid token provided.`, body: req.body })
)

app.post('/api/raisins', (req, res) =>
  (token === req.body.token)
    ? res.json({ error: false, message: `Action received: ${req.body.action}` })
    : res.json({ error: true, message: `Invalid token provided.`, body: req.body })
)

app.listen(port, () =>
  console.info(`Worker ready at http://localhost:${port}`)
)
