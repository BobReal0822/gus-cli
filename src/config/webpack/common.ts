const Path = require('path');

export const config = () => ({
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
        loader: 'babel-loader!ts-loader'
      }
    ]
  },
  plugins: [
  ],
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.less'],
    alias: {
      moment$: 'moment/moment.js'
    }
  }
});
