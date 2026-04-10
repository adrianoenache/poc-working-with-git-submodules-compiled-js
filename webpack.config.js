require('dotenv').config()

const path = require('node:path')
const glob = require('glob')

const _env = process.env

const config = {
  env: _env.ENV || _env.npm_package_config_env,
  js: {
    source: `${path.resolve(__dirname, _env.npm_package_config_js_source)}/`,
    publicPath: `${path.resolve(__dirname, _env.npm_package_config_js_public_path)}/`,
    output: `${path.resolve(__dirname, _env.npm_package_config_js_output)}/`
  }
}

module.exports = {
  stats: 'errors-only',
  mode: config.env === 'prod' ? 'production' : 'none',
  entry: entries({}),
  resolve: {
    alias: {
      components: path.join(config.js.source, '../app/components'),
      modules: path.join(config.js.source, '../app/modules'),
      functions: path.join(config.js.source, '../app/functions'),
    }
  },
  output: {
    path: config.js.output,
    publicPath: config.js.publicPath,
    filename: '[name].js'
  },
}

function entries( main ){
  return glob.sync(config.js.source + '/*.js').reduce(function(x, file) {
    const name = path.basename(file, '.js')
    x[name] = path.resolve(config.js.source, name)
    return x
  }, main)
}
