const resolvers = {
  Query: {
    testString (_, args) {
      return 'It works!'
    }
  }
}

module.exports = resolvers
