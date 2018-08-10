const path = require('path')
const webpack = require('webpack')

module.exports = (storybookBaseConfig, configType, defaultConfig) => {
  defaultConfig.module.rules.push({
    test: [/\.stories\.js$/, /index\.js$/],
    loaders: [require.resolve('@storybook/addon-storysource/loader')],
    include: [path.resolve(__dirname, '../src')],
    enforce: 'pre',
  })

  defaultConfig.module.rules.push({
    test: /\.js$/,
    exclude: /node_modules/,
    loader: 'eslint-loader',
    enforce: 'pre',
    options: {
      fix: true,
      formatter: require('eslint-friendly-formatter'),
    },
  })

  defaultConfig.module.rules.push({
    test: /\.scss$/,
    use: [
      "vue-style-loader",
      "css-loader",
      {
        loader: "sass-loader",
        options: {
          includePaths: [path.resolve(__dirname, '../node_modules')],
        }
      }
    ]
  })

  defaultConfig.resolve = {
    alias: {
      '@': path.join(__dirname, '../src/renderer'),
      vue$: 'vue/dist/vue.esm.js',
    },
    extensions: ['.js', '.vue', '.json', '.css', '.node'],
  }

  return defaultConfig
}
