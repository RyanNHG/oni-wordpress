const express = require('express')
const morgan = require('morgan')
const ryanApi = require('./ryan-api.js')

const { wordpress, port } = {
  port: process.env.PORT || 3000,
  wordpress: {
    host: process.env.WP_HOST || 'cms',
    port: process.env.WP_PORT || 80,
    endpoint () {
      return `http://${this.host}:${this.port}/wp-json/wp/v2`
    }
  }
}

const app = express()
app.use(morgan('tiny'))

const endpoint = wordpress.endpoint()

const urlForType = (req, type) =>
  req.protocol + '://' + req.get('host') + req.originalUrl + '/' + type

const attemptToConnect = (attemptsLeft) => {
  if (attemptsLeft > 0) {
    ryanApi({ endpoint })
      .then(wp => {
        app.get('/api', (req, res) =>
          res.json({
            endpoints: Object.keys(wp).map(type => urlForType(req, type))
          })
        )

        app.get('/api/:type', (req, res) => {
          console.log(wp)
          console.log(req.params.type)
          wp[req.params.type]
            .get({
              sort: req.query ? req.query.sort : undefined
            })
            .then((data) => res.json(data))
            .catch(reason => res.json({ error: true, message: reason }))
        })

        app.get('/api/:type/:id', (req, res) => {
          wp[req.params.type]
            .get({ id: req.params.id })
            .then((data) => res.json(data))
            .catch(reason => res.json({ error: true, message: reason }))
        })

        app.listen(port, () => console.log(`Ready at http://localhost:${port}`))
      })
      .catch(() => {
        const timeout = 3000
        attemptsLeft--
        console.info(`Could not connect... attempting ${attemptsLeft} more time${attemptsLeft === 1 ? '' : 's' } in ${parseInt(timeout / 1000)} seconds...`)
        setTimeout(() => attemptToConnect(attemptsLeft), timeout)
      })
  }
}

attemptToConnect(5)
