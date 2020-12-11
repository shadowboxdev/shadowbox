// eslint-disable-next-line @typescript-eslint/no-var-requires
const { resolve } = require('path');

const config = {
  mode: 'production',
  entry: resolve(__dirname, 'devops/src/app/workbox', 'swtemplate.ts'),
  output: {
    path: resolve(__dirname, '.'),
    filename: 'swtemplate.js',
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'ts-loader',
      },
    ],
  },
  resolve: { extensions: ['.js', '.ts'] },
};

module.exports = config;
