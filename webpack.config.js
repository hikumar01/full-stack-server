const path = require('path');

module.exports = {
  mode: 'development', // Switch to 'production' for production builds
  entry: './src/index.jsx', // Entry point for the React app
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: 'bundle.js', // Output bundle file in the public folder
  },
  module: {
    rules: [
      {
        test: /\.jsx$/, // Transpile all .jsx files
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'], // Resolve JS and JSX files
  },
};
