const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  devServer: {
    allowedHosts: ['frontend-service-671231835192.europe-west1.run.app'],
    port: 8090, // Neuer Entwicklungsport
  },
  transpileDependencies: true
})
