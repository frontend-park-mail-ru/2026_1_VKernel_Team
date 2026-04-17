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
        devServer: {
            port: 8080,
            historyApiFallback: true,
            static: {
                directory: path.resolve(__dirname, 'public'),
            },
            proxy: [
                {
                    context: ['/api'],
                    target: 'http://clover-go.ru:8000',
                    changeOrigin: true,
                },
            ],
        },

        module: {
            rules: [
                { test: /\.tsx?$/, use: 'ts-loader', exclude: /node_modules/ },
                { test: /\.css$/i, use: ['style-loader', 'css-loader'] },
                {
                    test: /\.(png|jpe?g|gif|svg|webp)$/i,
                    type: 'asset/resource',
                    generator: { filename: 'images/[hash][ext][query]' },
                },
                { test: /\.hbs$/i, resourceQuery: /raw/, type: 'asset/source' },
                {
                    test: /\.hbs$/i,
                    resourceQuery: { not: [/raw/] },
                    loader: 'handlebars-loader',
                    options: {
                        precompile: true,
                        esModule: true,
                        runtime: 'handlebars/dist/handlebars.runtime.js',
                        knownHelpers: [
                            'if',
                            'unless',
                            'each',
                            'with',
                            'log',
                            'lookup',
                            'formatPrice',
                            'formatDate',
                            'eq',
                            'gt',
                            'concat',
                            'array',
                            'iconForTab',
                            'labelForTab',
                            'ifAuthenticated',
                            'avatarUrl',
                        ],
                        partialDirs: [
                            path.resolve(__dirname, 'src'),
                            path.resolve(__dirname, 'src/modules'),
                            path.resolve(__dirname, 'src/templates'),
                        ],
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
                    { from: 'public/sw.js', to: 'sw.js' },
                ],
            }),
        ],
        resolve: {
            extensions: ['.ts', '.tsx', '.js', '.hbs'],
            alias: {
                '@': path.resolve(__dirname, 'src/js'),
                '@css': path.resolve(__dirname, 'public/css'),
                '@core': path.resolve(__dirname, 'src/js/core'),
                '@api': path.resolve(__dirname, 'src/js/api'),
                '@services': path.resolve(__dirname, 'src/js/services'),
                '@controllers': path.resolve(__dirname, 'src/js/controllers'),
                '@validators': path.resolve(__dirname, 'src/js/validators'),
                '@utils': path.resolve(__dirname, 'src/js/utils'),
                '@types': path.resolve(__dirname, 'src/js/types'),
                '@templates': path.resolve(__dirname, 'src/templates'),
                '@modules': path.resolve(__dirname, 'src/modules'),
                handlebars$: 'handlebars/dist/handlebars.js',
            },
        },
    };
};
