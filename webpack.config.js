const {
  sentryWebpackPlugin
} = require("@sentry/webpack-plugin");

require('dotenv').config()

const path = require('path');
const webpack = require('webpack')
const VueI18nPlugin = require('@intlify/unplugin-vue-i18n/webpack')
//const sentryVitePlugin = require("@sentry/vite-plugin");
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin')

module.exports = {
  mode: 'development',
  entry: './src/index.ts',

  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  devtool: "source-map", // Source map generation must be turned on
  plugins: [new NodePolyfillPlugin(), new webpack.DefinePlugin({
    'process.env': {
      HELLO: JSON.stringify(process.env.HELLO)
    }
  }), VueI18nPlugin({
    /* options */
    // locale messages resource pre-compile option
    include: path.resolve(__dirname, './i18n/**'),
  }), // Put the Sentry vite plugin after all other plugins
  sentryWebpackPlugin({
    authToken: process.env.SENTRY_AUTH_TOKEN,
    org: "pogi",
    project: "plugn-ionic-frontend"
  })],

  devtool: "source-map"
};