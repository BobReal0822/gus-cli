"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable-next-line
const Path = require('path');
// tslint:disable-next-line
const webpack = require('webpack');
exports.config = (options) => {
    const res = {
        module: {
            loaders: [
                {
                    test: /\.css$/,
                    loader: 'style-loader!css-loader'
                },
                {
                    test: /\.less$/,
                    loader: 'style-loader!css-loader!less-loader'
                },
                {
                    test: /\.png$/,
                    loader: 'url-loader',
                    query: {
                        mimetype: 'image/png'
                    }
                },
                {
                    test: /\.ts(x)?$/,
                    loader: [`babel-loader?presets[]=es2015,presets[]=stage-0,presets[]=react${options ? ',presets[]=react-hmre' : ''}`, 'ts-loader']
                }
            ]
        },
        plugins: [
            new webpack.optimize.OccurrenceOrderPlugin(),
            new webpack.HotModuleReplacementPlugin(),
            new webpack.NoEmitOnErrorsPlugin()
        ],
        resolve: {
            extensions: ['.ts', '.tsx', '.js', '.less'],
            alias: {
                moment$: 'moment/moment.js'
            }
        }
    };
    if (options) {
        res.entry = [
            'eventsource-polyfill',
            'webpack-hot-middleware/client?path=/__webpack_hmr',
            options.entry
        ];
        res.output = {
            filename: options.outputFilename,
            path: options.outputPath
        };
    }
    return res;
};
//# sourceMappingURL=common.js.map