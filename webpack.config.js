const path = require('path');
const slsw = require('serverless-webpack');
const nodeExternals = require('webpack-node-externals');

module.exports = {
    mode: slsw.lib.webpack.isLocal ? 'development' : 'production',
    target: 'node',
    entry: slsw.lib.entries,
    externals: [nodeExternals()],
    output: {
        path: path.resolve(__dirname, '.webpack'),
        libraryTarget: 'commonjs2',
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /\.spec\.js$/,
                use: {
                    loader: 'babel-loader',
                },
            },
        ],
    },
};
