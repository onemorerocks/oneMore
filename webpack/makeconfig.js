import ExtractTextPlugin from 'extract-text-webpack-plugin';
import autoprefixer from 'autoprefixer';
import constants from './constants';
import path from 'path';
import webpack from 'webpack';
import ip from 'ip';

const devtools = 'inline-source-map';

const serverIp = ip.address();

export default function makeConfig(isDevelopment) {

  const config = {
    hotPort: constants.HOT_RELOAD_PORT,
    cache: isDevelopment,
    debug: isDevelopment,
    devtool: isDevelopment ? devtools : '',
    entry: {
      app: isDevelopment ? [
        `webpack-hot-middleware/client?path=http://${serverIp}:${constants.HOT_RELOAD_PORT}/__webpack_hmr`,
        path.join(constants.SRC_DIR, 'client/main.js')
      ] : [
        path.join(constants.SRC_DIR, 'client/main.js')
      ]
    },
    module: {
      loaders: [{
        loader: 'url-loader?limit=100000',
        test: /\.(gif|jpg|png|woff|woff2|eot|ttf|svg)$/
      }, {
        loader: 'babel',
        exclude: /node_modules/,
        query: isDevelopment ? {
          "plugins": [
            ["react-transform", {
              "transforms": [{
                "transform": "react-transform-hmr",
                "imports": ["react"],
                "locals": ["module"]
              }]
            }]
          ]
        } : {
          "plugins": []
        },
        test: /\.(js|jsx)$/
      },{
        loader: isDevelopment
          ? `style-loader?sourceMap!css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss-loader!sass-loader`
          : ExtractTextPlugin.extract('style-loader', ''),
        exclude: /(global\.scss)/,
        test: /\.(scss|css)$/
      },{
        loader: isDevelopment
          ? `style-loader?sourceMap!css-loader!postcss-loader!sass-loader`
          : ExtractTextPlugin.extract('style-loader', ''),
        test: /\.global.scss$/
      }]
    },
    output: isDevelopment ? {
      path: constants.BUILD_DIR,
      filename: '[name].js',
      chunkFilename: '[name]-[chunkhash].js',
      publicPath: `http://${serverIp}:${constants.HOT_RELOAD_PORT}/build/`
    } : {
      path: constants.BUILD_DIR,
      filename: '[name]-[hash].js',
      chunkFilename: '[name]-[chunkhash].js'
    },
    plugins: (() => {
      const plugins = [
        new webpack.DefinePlugin({
          'process.env': {
            NODE_ENV: JSON.stringify(isDevelopment ? 'development' : 'production'),
            IS_BROWSER: true
          }
        })
      ];
      if (isDevelopment) plugins.push(
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin()
      );
      else plugins.push(
        // Render styles into separate cacheable file to prevent FOUC and
        // optimize for critical rendering path.
        new ExtractTextPlugin('app-[hash].css', {
          allChunks: true
        }),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.optimize.UglifyJsPlugin({
          compress: {
            screw_ie8: true, // eslint-disable-line camelcase
            warnings: false // Because uglify reports irrelevant warnings.
          }
        })
      );
      return plugins;
    })(),
    postcss: () => {
      return [autoprefixer({remove: false, browsers: 'last 2 version, ie > 8, > 1% in CA, iOS > 6'})];
    },
    resolve: {
      extensions: ['', '.js', '.jsx', '.json'],
      modulesDirectories: ['src', 'node_modules'],
      root: constants.ABSOLUTE_BASE,
      alias: {
        'react$': require.resolve(path.join(constants.NODE_MODULES_DIR, 'react'))
      }
    }
  };

  return config;

};
