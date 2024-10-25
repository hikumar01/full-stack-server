const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production'; // Check if the mode is production

  return {
    mode: isProduction ? 'production' : 'development',
    entry: './src/index.jsx', // Entry file
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: '[name].bundle.js',
      chunkFilename: '[name].chunk.js',
      publicPath: '/',
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/, // Transpile JS and JSX files
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
          },
        },
        {
          test: /\.css$/, // Load CSS files
          use: ['style-loader', 'css-loader'],
        },
      ],
    },
    resolve: {
      extensions: ['.js', '.jsx'],
    },
    optimization: {
      splitChunks: {
        chunks: 'all', // Split all chunks
      },
      minimize: isProduction, // Enable minimization only in production
      minimizer: isProduction ?
        [
          new TerserPlugin({
            terserOptions: {
              compress: {
                drop_console: true, // Drop console.log statements in production
              },
            },
          }),
        ] :
        [],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './index.html', // Input HTML file
        filename: 'index.html', // Output HTML file
      }),
    ],
    devServer: {
      contentBase: path.join(__dirname, 'dist'),
      compress: true,
      port: 8080,
      hot: true,
      historyApiFallback: true,
    },
  };
};
