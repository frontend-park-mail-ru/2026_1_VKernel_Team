import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Читаем .env без dotenv, чтобы не загрязнять stdout (ломает pipe в dep-gen)
const envPath = path.resolve(__dirname, '.env');
const envVars = {};
if (fs.existsSync(envPath)) {
    fs.readFileSync(envPath, 'utf-8')
        .split('\n')
        .forEach((line) => {
            const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
            if (match) envVars[match[1]] = (match[2] || '').replace(/^['"]|['"]$/g, '');
        });
}

export default (env, argv) => {
    const isDevelopment = argv?.mode === 'development';

    return {
        entry: {
            app: './src/js/main.ts',
            'support-widget': './src/js/support-widget.ts',
        },
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
                { test: /\.s?css$/i, use: ['style-loader', 'css-loader', 'sass-loader'] },
                { test: /\.svg$/i, resourceQuery: /raw/, type: 'asset/source' },
                {
                    test: /\.(png|jpe?g|gif|svg|webp)$/i,
                    resourceQuery: { not: [/raw/] },
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
                            'icon',
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
            new webpack.DefinePlugin({
                'process.env.BASE_URL': JSON.stringify(
                    envVars.BASE_URL || 'http://clover-go.ru:8000',
                ),
                'process.env.YANDEX_JSAPI_KEY': JSON.stringify(envVars.YANDEX_JSAPI_KEY || ''),
                'process.env.YANDEX_SUGGEST_KEY': JSON.stringify(envVars.YANDEX_SUGGEST_KEY || ''),
                'process.env.YANDEX_GEOCODER_KEY': JSON.stringify(
                    envVars.YANDEX_GEOCODER_KEY || '',
                ),
            }),
            new HtmlWebpackPlugin({
                template: './public/index.html',
                filename: 'index.html',
                inject: 'body',
                chunks: ['app'],
            }),
            new HtmlWebpackPlugin({
                template: './public/support-widget.html',
                filename: 'support-widget.html',
                inject: 'body',
                chunks: ['support-widget'],
            }),
            new CopyWebpackPlugin({
                patterns: [
                    { from: 'public/images', to: 'images', noErrorOnMissing: true },
                    { from: 'public/site', to: 'site', noErrorOnMissing: true },
                    { from: 'public/sw.js', to: 'sw.js' },
                ],
            }),
        ],
        resolve: {
            extensions: ['.ts', '.tsx', '.js', '.hbs', '.scss', '.css'],
            alias: {
                '@': path.resolve(__dirname, 'src/js'),
                '@css': path.resolve(__dirname, 'src/styles'),
                '@styles': path.resolve(__dirname, 'src/styles'),
                '@core': path.resolve(__dirname, 'src/js/core'),
                '@api': path.resolve(__dirname, 'src/js/api'),
                '@services': path.resolve(__dirname, 'src/js/services'),
                '@controllers': path.resolve(__dirname, 'src/js/controllers'),
                '@validators': path.resolve(__dirname, 'src/js/validators'),
                '@utils': path.resolve(__dirname, 'src/js/utils'),
                '@types': path.resolve(__dirname, 'src/js/types'),
                '@templates': path.resolve(__dirname, 'src/templates'),
                '@modules': path.resolve(__dirname, 'src/modules'),
                '@assets': path.resolve(__dirname, 'src/assets'),
                handlebars$: 'handlebars/dist/handlebars.js',
            },
        },
    };
};
