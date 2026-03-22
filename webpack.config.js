import path from 'path';
import { fileURLToPath } from 'url';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default (env, argv) => {
    const isDevelopment = argv.mode === 'development';

    return {
        entry: './src/js/main.ts',
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: 'js/[name].[contenthash].js',
            clean: true,
            publicPath: '/'
        },
        devtool: isDevelopment ? 'source-map' : false,
        devServer: {
            static: [
                {
                    directory: path.join(__dirname, 'public'),
                    publicPath: '/',
                },
                {
                    directory: path.join(__dirname, 'src/templates'),
                    publicPath: '/templates',
                }
            ],
            port: 3000,
            hot: true,
            open: true,
            historyApiFallback: true,
            proxy: [
                {
                    context: ['/api'],
                    target: 'http://clover-go.ru:8000',
                    changeOrigin: true,
                    secure: false
                }
            ]
        },
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    use: 'ts-loader',
                    exclude: /node_modules/,
                },
                {
                    test: /\.css$/i,
                    use: ['style-loader', 'css-loader']
                },
                {
                    test: /\.(png|jpe?g|gif|svg|webp)$/i,
                    type: 'asset/resource',
                    generator: {
                        filename: 'images/[hash][ext][query]'
                    }
                },
                {
                    test: /\.hbs$/i,
                    loader: 'handlebars-loader'
                }
            ]
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: './public/index.html',
                filename: 'index.html',
                inject: 'body'
            }),
            new CopyWebpackPlugin({
                patterns: [
                    {
                        from: 'public/images',
                        to: 'images',
                        noErrorOnMissing: true
                    },
                    {
                        from: 'src/templates',
                        to: 'templates',
                        noErrorOnMissing: true
                    }
                ]
            })
        ],
        resolve: {
            extensions: ['.ts', '.tsx', '.js', '.hbs'],
            alias: {
                '@': path.resolve(__dirname, 'src/js'),
                'handlebars': 'handlebars/dist/handlebars.js'
            }
        }
    };
};