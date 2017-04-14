var path = require('path');
var node_modules_dir = path.resolve(__dirname, 'node_modules');
var webpack = require('webpack');

var definePlugin = new webpack.DefinePlugin({
    __DEV__: process.env.NODE_ENV !== 'production'
});

module.exports = {
    entry: path.resolve(__dirname, 'index.js'),
    output: {
        path: path.resolve(__dirname, 'static'),
        filename: 'bundle.js'
    },
    plugins: [
        definePlugin,
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        }),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.optimize.LimitChunkCountPlugin({maxChunks: 15}),
        new webpack.optimize.MinChunkSizePlugin({minChunkSize: 10000})
    ],
    module: {
        loaders: [
            {
                test: /\.js$/,
                loaders: ['babel'],
                exclude: node_modules_dir,
                include: __dirname
            },
            {
                test: /\.scss$/,
                loader: 'style!css!sass'
            },
            {
                include: /\.json$/,
                loaders: ["json-loader"]
            }
        ]
    },
    resolve: {
        extensions: ['', '.json', '.jsx', '.js']
    }
};
