module.exports = ({
  getTypes,
  getPost,
  getPosts,
  getProfessional,
  getProfessionals,
  getJobTitle,
  getFruit,
  getFruits,
  getFruitsWithFavoriteColor,
  getFruitsWithFirstName,
  getFruitsWithFirstNameAndColor
}) => ({
  Query: {
    postTypes (_, args) {
      return getTypes()
    },
    posts (_, args) {
      return args.id
        ? [ getPost(args.type, args.id, args.fetchMeta) ]
        : getPosts(args.type, args.fetchMeta)
    },
    professionals (_, args) {
      return args.id ? [ getProfessional(args.id) ] : getProfessionals(args.type)
    },
    fruits (_, args) {
      if (args.favoriteColor && args.firstName) {
        return getFruitsWithFirstNameAndColor(args.favoriteColor, args.firstName)
      } else if (args.favoriteColor) {
        return getFruitsWithFavoriteColor(args.favoriteColor)
      } else if (args.firstName) {
        return getFruitsWithFirstName(args.firstName)
      } else {
        return args.id ? [ getFruit(args.id) ] : getFruits()
      }
    }
  },
  Professional: {
    friend (professional) {
      return getProfessional(professional.friend)
    },
    jobTitle (professional) {
      return getJobTitle(professional.jobTitle)
    }
  },
  Name: {
    full (name) {
      return name.first + ' ' + name.last
    }
  }
})
