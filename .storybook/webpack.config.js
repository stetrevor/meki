const path = require('path')
const VueLoaderPlugin = require('vue-loader/lib/plugin')

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

  const svgRuleIndex = defaultConfig.module.rules.findIndex(rule => rule.test.test('.svg'))
  defaultConfig.module.rules.splice(svgRuleIndex, 1, {
    test: /\.(ico|jpg|jpeg|png|gif|eot|otf|webp|ttf|woff|woff2)(\?.*)?$/,
    loader: 'file-loader',
    query: { name: 'static/media/[name].[hash:8].[ext]'
  }})

  defaultConfig.module.rules.push({
    test: /\.svg$/,
    loader: ["svg-sprite-loader", "svgo-loader"],
  })

  defaultConfig.resolve = {
    alias: {
      '@': path.join(__dirname, '../src/renderer'),
      vue$: 'vue/dist/vue.esm.js',
    },
    extensions: ['.js', '.vue', '.json', '.css', '.node'],
  }

  defaultConfig.plugins.push(new VueLoaderPlugin())

  return defaultConfig
}
