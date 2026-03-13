'use strict';

/**
 * Импорт необходимых модулей Node.js
 */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';
import dotenv from 'dotenv';
import { fileURLToPath } from 'node:url';

/**
 * Получение пути к текущему файлу и директории
 * @type {string}
 */
const __filename = fileURLToPath(import.meta.url);

/**
 * Директория текущего файла
 * @type {string}
 */
const __dirname = path.dirname(__filename);

/**
 * Загрузка переменных окружения из файла .env
 */
dotenv.config({ path: path.join(__dirname, '..', '.env') });

/**
 * Порт сервера, по умолчанию 80
 * @type {number}
 */
const PORT = process.env.PORT || 80;

/**
 * Директория с публичными файлами
 * @type {string}
 */
const PUBLIC_DIR = path.join(__dirname, '..', process.env.PUBLIC_DIR || 'public');

/**
 * MIME-типы для различных расширений файлов
 * @type {Object.<string, string>}
 */
const MIME_TYPES = {
    '.html': 'text/html; charset=UTF-8',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.txt': 'text/plain; charset=UTF-8',
};

/**
 * Проверка существования директории с публичными файлами
 */
if (!fs.existsSync(PUBLIC_DIR)) {
    console.warn(` Внимание: Папка ${PUBLIC_DIR} не существует!`);
}

/**
 * Логирование конфигурации сервера
 */
console.log('Конфигурация сервера:');
console.log(`   Порт: ${PORT}`);
console.log(`   Папка со статикой: ${PUBLIC_DIR}`);
console.log(`   Файл .env ${fs.existsSync('.env') ? 'найден' : 'не найден'}`);

/**
 * Обработчик неперехваченных исключений
 */
process.on('uncaughtException', (err) => {
    console.error('Неперехваченная ошибка:', err);
    console.log('Сервер продолжает работу...');
});

/**
 * Обработчик необработанных отклонений промисов
 */
process.on('unhandledRejection', (reason, promise) => {
    console.error('Необработанный reject:', reason);
});

/**
 * Создание HTTP сервера
 * @param {http.IncomingMessage} req - Объект запроса
 * @param {http.ServerResponse} res - Объект ответа
 */
const server = http.createServer(async (req, res) => {
    /**
     * Обработчик ошибок запроса
     */
    req.on('error', (err) => {
        console.error('Ошибка запроса:', err.message);
    });

    /**
     * Обработчик ошибок ответа
     */
    res.on('error', (err) => {
        console.error('Ошибка ответа:', err.message);
    });

    try {
        /**
         * Декодирование пути из URL запроса
         */
        let pathname;
        try {
            pathname = decodeURIComponent(url.parse(req.url).pathname || '');
        } catch (e) {
            console.warn('Некорректный URI:', req.url);
            if (!res.headersSent) {
                res.writeHead(400, { 'Content-Type': 'text/plain' });
                res.end('Bad Request');
            }
            return;
        }

        /**
         * Обработка запросов к директории /src/
         */
        if (pathname.startsWith('/src/')) {
            const srcFilePath = path.join(__dirname, '..', pathname);
            const SRC_DIR = path.join(__dirname, '..', 'src');

            /**
             * Проверка безопасности: предотвращение доступа вне директории src
             */
            if (!srcFilePath.startsWith(SRC_DIR)) {
                console.warn(`Заблокирована попытка доступа к: ${srcFilePath}`);
                if (!res.headersSent) {
                    res.writeHead(403, { 'Content-Type': 'text/plain' });
                    res.end('403 Forbidden');
                }
                return;
            }

            try {
                const data = await fs.promises.readFile(srcFilePath);
                const ext = path.extname(srcFilePath);
                const contentType = MIME_TYPES[ext] || 'application/octet-stream';

                if (!res.headersSent) {
                    res.writeHead(200, { 'Content-Type': contentType });
                    res.end(data);
                    console.log(`${req.method} ${req.url}`);
                }
                return;
            } catch (srcError) {
                if (srcError.code === 'ENOENT') {
                    console.log(`404 ${req.url} - файл не найден в src`);
                    if (!res.headersSent) {
                        res.writeHead(404, { 'Content-Type': 'text/html; charset=UTF-8' });
                        res.end('<h1>404 - Файл не найден</h1>');
                    }
                    return;
                } else {
                    throw srcError;
                }
            }
        }

        /**
         * Определение пути к файлу для обслуживания
         */
        let filePath;
        let fileExists = false;

        if (pathname === '/' || pathname === '/index.html') {
            filePath = path.join(PUBLIC_DIR, 'index.html');
            fileExists = true;
        } else {
            const testPath = path.join(PUBLIC_DIR, pathname);
            try {
                await fs.promises.access(testPath, fs.constants.F_OK);
                filePath = testPath;
                fileExists = true;
            } catch {
                fileExists = false;
            }
        }

        /**
         * Fallback на index.html для SPA маршрутизации
         */
        if (!fileExists) {
            filePath = path.join(PUBLIC_DIR, 'index.html');
        }

        /**
         * Проверка безопасности: предотвращение доступа вне PUBLIC_DIR
         */
        if (!filePath.startsWith(PUBLIC_DIR)) {
            console.warn(`Заблокирована попытка доступа к: ${filePath}`);
            if (!res.headersSent) {
                res.writeHead(403, { 'Content-Type': 'text/plain' });
                res.end('403 Forbidden');
            }
            return;
        }

        /**
         * Чтение и отправка файла
         */
        const data = await fs.promises.readFile(filePath);
        const ext = path.extname(filePath);
        const contentType = MIME_TYPES[ext] || 'application/octet-stream';

        res.writeHead(200, { 'Content-Type': contentType });
        res.end(data);
        console.log(`${req.method} ${req.url}`);
    } catch (error) {
        console.error('Ошибка сервера:', error);

        if (!res.headersSent) {
            if (error.code === 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/html; charset=UTF-8' });
                res.end('<h1>404 - Файл не найден</h1>');
            } else {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Internal Server Error');
            }
        }
    }
});

/**
 * Запуск сервера на указанном порту
 */
server.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
    console.log(`Отдаю файлы из папки: ${PUBLIC_DIR}`);
});
