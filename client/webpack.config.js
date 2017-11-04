const path = require('path');

module.exports= {
  entry: './src/index.js',
  devServer: {
    contentBase: path.join(__dirname, "dist"),
    compress: true,
    host: '0.0.0.0',
    port: 3000
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
	test: /\.js$/,
	exclude: /(node_modules)/,
	use: {
	  loader: 'babel-loader',
	  options: {
	    presets: ['env']
	  }
	}
      }
    ]
  }
}
