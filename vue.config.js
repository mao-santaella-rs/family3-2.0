module.exports = {
  css: {
    loaderOptions: {
      sass: {
        prependData: `@import "@/styles/prepend-data.sass";`
      }
    }
  }
}
