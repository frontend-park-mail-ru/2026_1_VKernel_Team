'use strict';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';
import dotenv from 'dotenv';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '..', '.env') });
const PORT = process.env.PORT || 80;
const PUBLIC_DIR = path.join(__dirname, '..', process.env.PUBLIC_DIR || 'dist');

const MIME_TYPES = {
    '.html': 'text/html; charset=UTF-8',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.webp': 'image/webp',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.txt': 'text/plain; charset=UTF-8',
};

if (!fs.existsSync(PUBLIC_DIR)) {
    console.warn(` Внимание: Папка ${PUBLIC_DIR} не существует!`);
}

console.log('Конфигурация сервера:');
console.log(`   Порт: ${PORT}`);
console.log(`   Папка со статикой: ${PUBLIC_DIR}`);
console.log(`   Файл .env ${fs.existsSync('.env') ? 'найден' : 'не найден'}`);

process.on('uncaughtException', (err) => {
    console.error('Неперехваченная ошибка:', err);
    console.log('Сервер продолжает работу...');
});

process.on('unhandledRejection', (reason) => {
    console.error('Необработанный reject:', reason);
});

//function handleApiProxy(req, res, pathname)
function handleApiProxy(req, res) {
    // Указываем адрес боевого бэкенда на сервере
    const targetUrl = new URL(req.url, 'http://clover-go.ru:8000');

    // Формируем настройки для внутреннего запроса от Node.js к бэкенду
    const options = {
        hostname: targetUrl.hostname,
        port: targetUrl.port,
        path: targetUrl.pathname + targetUrl.search, // Сохраняем пути и параметры (например, ?limit=10)
        method: req.method,                          // Сохраняем оригинальный метод (GET, POST и т.д.)
        headers: {
            ...req.headers,               // Пробрасываем все заголовки от браузера (включая куки!)
            host: targetUrl.host,         // Подменяем host, чтобы бэкенд не отклонил запрос
        },
    };

    // Создаем HTTP-запрос к бэкенду
    const proxyReq = http.request(options, (proxyRes) => {
        // Как только бэкенд ответил, пробрасываем его статус и заголовки обратно в браузер.
        res.writeHead(proxyRes.statusCode, proxyRes.headers);

        // Потоково передаем тело ответа от бэкенда клиенту (браузеру)
        proxyRes.pipe(res, { end: true });
    });

    // Обрабатываем ситуации, когда бэкенд недоступен
    proxyReq.on('error', (err) => {
        console.error('Ошибка проксирования на бэкенд:', err.message);
        if (!res.headersSent) {
            res.writeHead(502, { 'Content-Type': 'text/plain; charset=UTF-8' });
            res.end('502 Bad Gateway - Бэкенд недоступен');
        }
    });

    // Потоково передаем тело оригинального запроса на бэкенд
    req.pipe(proxyReq, { end: true });
}

const server = http.createServer(async (req, res) => {
    req.on('error', (err) => {
        console.error('Ошибка запроса:', err.message);
    });

    res.on('error', (err) => {
        console.error('Ошибка ответа:', err.message);
    });

    try {
        let pathname;
        try {
            pathname = decodeURIComponent(url.parse(req.url).pathname || '');
        } catch {
            console.warn('Некорректный URI:', req.url);
            if (!res.headersSent) {
                res.writeHead(400, { 'Content-Type': 'text/plain' });
                res.end('Bad Request');
            }
            return;
        }

        // Перехватываем все запросы, которые фронтенд отправляет на /api/v1
        if (pathname.startsWith('/api/v1')) {
            handleApiProxy(req, res, pathname);
            return;
        }

        if (pathname.startsWith('/src/')) {
            const srcFilePath = path.join(__dirname, '..', pathname);
            const SRC_DIR = path.join(__dirname, '..', 'src');

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

        if (!fileExists) {
            filePath = path.join(PUBLIC_DIR, 'index.html');
        }

        if (!filePath.startsWith(PUBLIC_DIR)) {
            console.warn(`Заблокирована попытка доступа к: ${filePath}`);
            if (!res.headersSent) {
                res.writeHead(403, { 'Content-Type': 'text/plain' });
                res.end('403 Forbidden');
            }
            return;
        }

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

server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`Ошибка: порт ${PORT} уже занят. Закройте процесс, использующий этот порт или задайте другой PORT в файле .env.`);
        process.exit(1);
    }
    console.error('Ошибка сервера:', err);
    process.exit(1);
});

server.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
    console.log(`Отдаю файлы из папки: ${PUBLIC_DIR}`);
});
