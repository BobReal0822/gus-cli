import * as Path from 'path';

export interface WebpackConfigInfo {
  entry: {
    [key: string]: string | string[];
  };
  viewDir: string;
  staticDir: string;
  distDir: string;
  dev?: boolean;
  preDeploy?: boolean;
}

/**
 * Return webpack config according to options.
 *
 * @param {WebpackConfigInfo} options
 * @param {boolean} useOss
 * @returns
 */
export const webpackConfig = (options: WebpackConfigInfo, useOss: boolean) => {
  const { entry, viewDir, staticDir, distDir, dev } = options;
  const ossPath = 'https://ni-web.oss-cn-beijing.aliyuncs.com/static/';
  const env = dev
    ? 'development'
    : options.preDeploy
    ? 'pre-deploy'
    : 'production';

  process.env.NODE_ENV = env;
  const res = `
    const Process = require('process'),
      Path = require('path'),
      webpack = require('webpack'),
      yargs = require('yargs'),
      childProcess = require('child_process'),
      WriteFilePlugin = require('write-file-webpack-plugin'),
      // DefinePlugin = webpack.DefinePlugin,

      ManifestPlugin = require('webpack-manifest-plugin'),
      CopyWebpackPlugin = require('copy-webpack-plugin'),
      UglifyJsPlugin = require('uglifyjs-webpack-plugin'),

      manifestPath = Path.resolve('dist/manifest.json'),
      options = yargs
        .alias('p', 'optimize-minimize')
        .argv;

    const config = {
      bail: true,
      entry: ${JSON.stringify(entry)},
      output: {
        publicPath: '${
          dev
            ? `http://localhost:8080/${Path.join(distDir, staticDir)}/`
            : useOss
            ? ossPath
            : '/'
        }',
        path: Path.resolve('${distDir}', '${staticDir}'),
        filename: '[name]${dev ? '' : '.[hash:8]'}.js',
        chunkFilename: '[id].[hash:8].js'
      },
      module: {
        rules: [{
            test: /\\.ts(x)?$/,
            include: Path.resolve(__dirname, '../src'),
            // loader: 'babel-loader!ts-loader'
            use: [{
              loader: 'babel-loader',
              options: {
                presets: [
                  'react'
                ],
                plugins: [
                  'syntax-dynamic-import'
                ],
                comments: true
              }
            }, {
              loader: 'ts-loader'
            }, {
              loader: 'tslint-loader',
              options: {
                // typeCheck: true
              }
            }]
          },
          {
            test: /\\.jsx$/,
            loader: 'babel-loader?presets[]=es2015,presets[]=stage-0,presets[]=react'
          },
          {
            test: /\\.js(x)$/,
            exclude: /node_modules/,
            include: Path.resolve(__dirname, '../src'),
            use: [{
              loader: 'babel-loader',
              options: {
                presets: [
                  'es2015',
                  'stage-0',
                  'react'
                ],
                plugins: [
                  'syntax-dynamic-import'
                ],
                comments: true
              }
            },
            // {
            //   loader: 'eslint-loader',
            //   options: {
            //     // configFile:  Path.resolve(__dirname, './../eslint.js')
            //   }
            // }
          ]

          },
          {
            test: /\\.css$/,
            include: Path.resolve(__dirname, '../src/style'),
            loader: 'style-loader!css-loader'
          }, {
            test: /\\.scss$/,
            include: Path.resolve(__dirname, '../src/style'),
            loader: 'style-loader!css-loader!sass-loader'
          }, {
            test: /\\.less$/,
            include: Path.resolve(__dirname, '../src/style'),
            loader: 'style-loader!css-loader!less-loader'
          }, {
            test: /\\.(png|jpe?g|gif|svg)(\\?.*)?$/,
            include: Path.resolve(__dirname, '../static'),
            use: {
              loader: 'file-loader',
              options: {
                name: 'image/[name].[hash:8].[ext]'
              }
            }
          }, {
            test: /\\.(mp4|webm|ogv)(\\?.*)?$/,
            include: Path.resolve(__dirname, '../static'),
            use: {
              loader: 'file-loader',
              options: {
                name: 'video/[name].[hash:8].[ext]'
              }
            }
          }
        ]
      },
      plugins: [
        new ManifestPlugin({
          publicPath: '${
            dev
              ? `http://localhost:8080/${Path.join(distDir, staticDir)}/`
              : useOss
              ? ossPath
              : '/'
          }'
        }),
        new webpack.HashedModuleIdsPlugin(),
        new WriteFilePlugin(),
        new CopyWebpackPlugin([{
          from: Path.resolve('${viewDir}'),
          to: Path.resolve('${distDir}', '${viewDir}'),
          force: true
        }, {
          from: Path.resolve('${staticDir}/*.ico'),
          to: Path.resolve('${distDir}'),
          force: true
        }, {
          from: Path.resolve('${staticDir}/js/**/*.js'),
          to: Path.resolve('${distDir}'),
          force: true
        }, {
          from: Path.resolve('${staticDir}/css/**/*.css'),
          to: Path.resolve('${distDir}'),
          force: true
        }]),
        new webpack.DefinePlugin({
          'process.env.NODE_ENV':  JSON.stringify('${env}')
        })
      ],
      resolve: {
        extensions: ['.tsx', '.ts', '.jsx', '.js', ".scss"]
      },
      devServer: {
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
        hot: true,
        progress: true,
        disableHostCheck: false
      },
      optimization: {
        splitChunks: {
          chunks: 'all',
          name: 'common',
          cacheGroups: {
            chunks: 'initial',
            commons: {
              name: 'common',
              test: /react|lodash|antd|moment|history|axios|react-dom|react-router-dom/,
              chunks: 'initial',
              minChunks: 2
            }
          }
        },
        minimizer: []
      }
    };

    config.devtool = '${dev ? 'source-map' : ''}';
    if (!${dev}) {
      config.optimization.minimizer.push(
        new UglifyJsPlugin({
          parallel: true,
          cache: true,
          uglifyOptions: {
            warnings: false
          }
        })
      );
    }
    module.exports = config;
  `;

  return res;
};
