/* global __dirname */

const path = require('path');
const pathRoot = __dirname;
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const npmPackage = require(path.resolve(pathRoot, './package.json'));

const packageName = npmPackage.name;

module.exports = (env, argv) => {

  // Common configurations
  // ------------------------------------------------------
  const config = {
    name: packageName,
    mode: env,
    entry: path.resolve(pathRoot, './src/index.js'),
    // https://webpack.js.org/configuration/output/
    output: {
      filename: `js/${packageName}.js`,
    },
    target: ['browserslist'],
    resolve: {extensions: ['.js']},
    module: {
      rules: [
        {
          test: /\.css$/,
          exclude: /local/,
          use: [
            'style-loader',
            {loader: 'css-loader', options: {importLoaders: 1}},
            'postcss-loader', // options loaded from postcss.config.js
          ],
        },
        {
          test: /\.scss$/,
          use: [
            argv.mode === 'development' ? 'style-loader' : MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1,
                sourceMap: true,
              },
            },
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: true,
              },
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: true,
                sassOptions: {
                  outputStyle: 'expanded',
                  includePaths: [
                    path.join(pathRoot, 'src/scss/'),
                  ],
                },
              },
            },
          ],
        },
        {
          // This loader is the one that auto-refreshes the browsers after an edit
          test: /\.html$/,
          use: [{
            loader: 'html-loader',
            options: {
              // attrs: [':data-src'],
              minimize: argv.mode === 'development',
            },
          }],
        },
        {
          test: /\.(svg|jpg|png|ico)$/i,
          type: 'asset/resource',
          generator: {
            filename: '[name][ext]',
          },
        },
        {
          test: /\.js$/,
          exclude: /(node_modules|local)/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                [
                  '@babel/preset-env',
                  {
                    useBuiltIns: 'usage',
                    corejs: 3,
                    modules: 'commonjs', // 'amd' | 'umd' | 'systemjs' | 'commonjs' | 'auto' | false, defaults to 'auto'
                  },
                ],
              ],
            },
          },
        },
      ],
    },
  }; // Common configurations

  // Development build
  // ------------------------------------------------------
  if (argv.mode === 'development') {
    config.watchOptions = {
      aggregateTimeout: 300,
      poll: 1000,
      ignored: ['node_modules'],
    };

    // https://webpack.js.org/configuration/dev-server/
    config.devServer = {
      host: 'localhost',
      port: 4780,
      static: {
        directory: path.join(pathRoot, 'static'),
        staticOptions: {},
        publicPath: path.join(pathRoot, 'static'), // ['/static-public-path-one/', '/static-public-path-two/']
        serveIndex: true, // options for the `serveIndex` option you can find https://github.com/expressjs/serve-index
        watch: true, // options for the `watch` option you can find https://github.com/paulmillr/chokidar
      },
      client: false, // Bug on Webpack 5: https://github.com/webpack/webpack-dev-server/issues/2484
      // client: {
      //   logging: "info",
      //   // Can be used only for `errors`/`warnings`
      //   //
      //   // overlay: {
      //   //   errors: true,
      //   //   warnings: true,
      //   // }
      //   overlay: true,
      //   progress: true,
      // },
      devMiddleware: {
        stats: 'errors-warnings', // 'minimal,  'errors-only', // 'normal'
      },
    };

    config.performance = false;
    config.devtool = 'source-map';
    config.plugins = [
      new HtmlWebpackPlugin({
        inject: true,
        hash: false,
        minify: false,
        template: path.resolve(pathRoot, './src/index.html'),
        filename: 'index.html',
      }),
    ];

  } // IF mode === 'development'


  // Production build
  // ------------------------------------------------------
  if (argv.mode === 'production') {
    config.output.path = path.resolve(pathRoot, './dist/');
    config.output.filename = `${packageName}.min.js`;
    config.optimization = {
      minimize: true,
      minimizer: [
        // https://webpack.js.org/plugins/terser-webpack-plugin/
        new TerserPlugin({
          test: /\.js($|\?)/i,
          parallel: true,
          extractComments: false,
          terserOptions: {
            // ecma: undefined,
            // warnings: false,
            // parse: {},
            // compress: {},
            // module: false,

            // Mangle advanced options see:
            // https://lihautan.com/reduce-minified-code-size-by-property-mangling/
            mangle: {
              // module: true,
              // properties: false // default value is false
              properties: {
                // specify a list of names to be mangled with a regex
                // regex: /(^_)|(^(internalMessage|classNames|highlight|keepOpen|hidden|invalid|serviceError|outOfService|disclaimer|cacheKey|i18n|dataBank)$)/,
                regex: /^_/,
              },
            },
            output: {
              comments: false, // /(?:^!|@(?:license|preserve))/i,
            },
          },
        }),
        new CssMinimizerPlugin({
          include: /\.css$/g,
          // minify: require('cssnano'),
          minimizerOptions: {
            // map: {
            //   inline: false,
            //   annotation: true,
            // },
            sourcemap: false,
            preset: ['default', {discardComments: {removeAll: true}}],
          },
          parallel: true,
        }),
      ],
    };

    // https://webpack.js.org/configuration/performance/
    config.performance = {
      // values are in bytes, Default = 250000 (250KB or 244KiB)
      // KiB = KB * 0.976563
      maxEntrypointSize: (3.6e4), // 35.2 KiB
      maxAssetSize: (3.3e4),      // 32.2 KiB
    };

    config.plugins = [
      new CleanWebpackPlugin({
        dry: false,
        verbose: false,
        cleanOnceBeforeBuildPatterns: ['./**/*'], // clean out dist directory
      }),
      new MiniCssExtractPlugin({
        filename: `${packageName}.min.css`,
        chunkFilename: '[id].css',
      }),
      new HtmlWebpackPlugin({
        inject: true,
        hash: false,
        template: path.resolve(pathRoot, './src/index.html'),
        filename: `${packageName}.html`,
      }),
    ];

  } // IF mode === 'production'

  return config;
};
