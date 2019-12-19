const path = require('path');
const HWP = require('html-webpack-plugin');
const {HotModuleReplacementPlugin} = require('webpack');
const GHPagesSPAWebpackPlugin = require('ghpages-spa-webpack-plugin');

module.exports = {
   entry: path.join(__dirname, '/src/index.js'),
   output: {
       filename: 'build.js',
       path: path.join(__dirname, '/dist')},
   module:{
       rules:[
            {
              test: /\.(js|jsx)$/,
              exclude: /node_modules/,
              loader: 'babel-loader',
              options: {
                    presets: ['@babel/preset-env', '@babel/preset-react']
                }
            },
            {
                test: /\.(scss|sass)$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'sass-loader'
                ]  
            }
        ]
   },
   plugins:[
      new HotModuleReplacementPlugin(),
      new HWP(
          {template: path.join(__dirname,'/src/index.html')}
       )
   ]
}

