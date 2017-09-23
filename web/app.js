const express = require('express')
const morgan = require('morgan')
const mongoose = require('mongoose')

// Configuration
const port = process.env.PORT || 80
mongoose.connect(process.env.MONGO_URI)

const Professional = mongoose.model('Professional', {
  id: Number,
  slug: String,
  data: {
    name: {
      first: String,
      middle: String,
      last: String
    },
    biography: {
      main: String,
      additional: String
    }
  }
})

// App initialization
const app = express()
app.use(morgan('tiny'))

// Routes
app.get('/', (req, res) =>
  getProfessionals()
    .then(professionals => res.json(professionals))
    .catch(reason => res.json({ error: reason }))
)

app.get('/professionals/:slug', (req, res) =>
  getProfessionalBySlug(req.params.slug)
    .then(professional => res.json(professional))
    .catch(reason => res.json({ error: reason }))
)

const getProfessionals = () =>
  Professional.find().lean().exec()

const getProfessionalBySlug = (slug) =>
  Professional.findOne({ slug }).lean().exec()

// Start app
app.listen(port, () =>
  console.info(`Worker ready at http://localhost:${port}`)
)
