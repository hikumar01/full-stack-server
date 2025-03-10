import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import { fileURLToPath } from 'url';

// Get __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const config = (env, argv) => {
  const isProduction = argv.mode === 'production'; // Check if the mode is production

  return {
    mode: isProduction ? 'production' : 'development',
    entry: './react/main.jsx', // Entry file
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
    devtool: isProduction ? false : 'eval-source-map',
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
        template: './react/index.html', // Input HTML file
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

export default config;
