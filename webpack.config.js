const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
module.exports = {
  entry: ["./src/js/index.js"],
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "js/bundle.js"
  },
  devServer: {
    contentBase: "./dist",
  },
  plugins : [
      new HtmlWebpackPlugin({
          filename: 'index.html',
          template:  './src/index.html'
        })
    ],
    module: {
        rules:[
            {
               test: /\.js$/,
               exclude: /node_modules/,
               use: {
                   loader: 'babel-loader'
               }
           }
        ]
    }
};

/*
    {
        "presets": [
            ["@babel/env", {
                "useBuiltIns": "usage",
                "corejs": "3",
                "targets": {
                    "browsers": [
                        "last 5 versions",
                        "ie >= 8"
                    ]
                }
            }]
        ]
    }
*/
