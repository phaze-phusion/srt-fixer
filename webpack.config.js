/* global __dirname */

const path = require('path');
const pathRoot = __dirname;
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const npmPackage = require(path.resolve(pathRoot, './package.json'));

const packageName = npmPackage.name;

/**
 * @param {null} env
 * @param {{ mode: 'none' | 'development' | 'production' }} argv
 */
module.exports = (env, argv) => {

  const indexPackageName = argv.mode === 'development' ? 'index' : `${packageName}`;

  // Common configurations
  // ------------------------------------------------------
  const config = {
    name: packageName,
    mode: argv.mode,
    entry: './src/index.js',
    output: {
      filename: `js/${indexPackageName}.js`,
    },
    target: 'browserslist',
    resolve: {extensions: ['.js']},
    stats: {
      // errorDetails: true,
      children: true,
    },
    module: {
      rules: [
        {
          test: /\.(s?css)$/,
          use: [
            argv.mode === 'development' ? 'style-loader' : MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1,
                sourceMap: true,
              },
            },
            'postcss-loader', // options loaded from postcss.config.js
            {
              loader: 'sass-loader',
              options: {
                sourceMap: true,
                sassOptions: {
                  outputStyle: 'expanded',
                  includePaths: [
                    './src/scss/'
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
                ['@babel/preset-env'],
              ],
              plugins: [
                [
                  "@babel/plugin-transform-runtime",
                  {
                    regenerator: true
                  }
                ]
              ]
            },
          },
        },
      ],
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: (argv.mode === 'development' ? '[name].css' : `${packageName}.min.css`),
        chunkFilename: '[id].css',
      }),
      new HtmlWebpackPlugin({
        favicon: './src/favicon.ico',
        filename: `${indexPackageName}.html`,
        inject: true,
        hash: false,
        minify: false,
        template: './src/index.html',
      }),
    ],
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
      hot: true,
      watchFiles: ['src/**/*'],
      // static: 'local',
      host: 'localhost',
      port: 4780,

      // client: false, // Bug on Webpack 5: https://github.com/webpack/webpack-dev-server/issues/2484
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

  } // IF mode === 'development'


  // Production build
  // ------------------------------------------------------
  if (argv.mode === 'production') {
    config.output = {
      filename: `${packageName}.min.js`,
      path: path.resolve(__dirname, './dist/'),
    };

    // https://webpack.js.org/configuration/performance/
    config.performance = {
      // values are in bytes
      maxEntrypointSize: (5e4), // 48.8 KiB
      maxAssetSize: (5e4),      // 48.8 KiB
    };

    config.optimization = {
      minimize: true,
      minimizer: [
        // https://webpack.js.org/plugins/terser-webpack-plugin/
        new TerserPlugin({
          test: /\.js$/i,
          include: /\/src/,
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
            format: {
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

    config.plugins = [
      new CleanWebpackPlugin({
        dry: false,
        verbose: false,
        cleanOnceBeforeBuildPatterns: ['./**/*'], // clean out dist directory
      }),
      new StyleLintPlugin({
        context: './src/scss/',
        extensions: ['scss'],
        files: ['**/*.scss'],
      }),
      new ESLintPlugin({
        extensions: ['.js'],
        exclude: 'node_modules'
      }),
      ...(config.plugins),
    ];

  } // IF mode === 'production'

  return config;
};
