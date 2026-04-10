import path from 'path';
import { fileURLToPath } from 'url';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default (env, argv) => {
  const isDevelopment = argv?.mode === 'development';
  
  return {
    entry: './src/js/main.ts',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'js/[name].[contenthash].js',
      clean: true,
      publicPath: '/',
    },
    devtool: isDevelopment ? 'source-map' : false,
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
        {
          test: /\.css$/i,
          use: ['style-loader', 'css-loader'],
        },
        {
          test: /\.(png|jpe?g|gif|svg|webp)$/i,
          type: 'asset/resource',
          generator: { filename: 'images/[hash][ext][query]' },
        },
        {
          test: /\.hbs$/i,
          loader: 'handlebars-loader',
          options: {
            precompile: true,           
            esModule: true,           
            runtime: 'handlebars/dist/handlebars.runtime.js', 
            knownHelpers: ['if', 'unless', 'each', 'with', 'log', 'formatPrice'], 
          },
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './public/index.html',
        filename: 'index.html',
        inject: 'body',
      }),
      new CopyWebpackPlugin({
        patterns: [
          { from: 'public/images', to: 'images', noErrorOnMissing: true },
          { from: 'public/site', to: 'site', noErrorOnMissing: true },
          { from: 'public/css', to: 'css', noErrorOnMissing: true },
        ],
      }),
    ],
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.hbs'],
      alias: {
        '@': path.resolve(__dirname, 'src/js'),
        '@templates': path.resolve(__dirname, 'src/templates'), 
        '@css': path.resolve(__dirname, 'public/css'),
        'handlebars': 'handlebars/dist/handlebars.runtime.js',
      },
    },
  };

};
