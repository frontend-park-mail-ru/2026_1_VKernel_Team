import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';
import dotenv from 'dotenv';
dotenv.config();
const PORT = process.env.PORT || 3000;
const publicDirPath = process.env.PUBLIC_DIR || './public';
const PUBLIC_DIR = path.resolve(process.cwd(), publicDirPath);
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
if (!fs.existsSync(PUBLIC_DIR)) {
    console.warn(` Внимание: Папка ${PUBLIC_DIR} не существует!`);
    console.warn(`   Создай её командой: mkdir ${publicDirPath}`);
}
console.log('Конфигурация сервера:');
console.log(`   Порт: ${PORT}`);
console.log(`   Папка со статикой: ${PUBLIC_DIR}`);
console.log(`   Файл .env ${fs.existsSync('.env') ? 'найден' : 'не найден (используются значения по умолчанию)'}`);
const server = http.createServer(async (req, res) => {
    try {
        const parsedUrl = url.parse(req.url);
        let pathname = parsedUrl.pathname;
        if (pathname === '/') {
            pathname = '/index.html';
        }
        const filePath = path.join(PUBLIC_DIR, pathname);
        if (!filePath.startsWith(PUBLIC_DIR)) {
            console.warn(`Заблокирована попытка доступа к: ${filePath}`);
            res.writeHead(403, { 'Content-Type': 'text/plain' });
            return res.end('403 Forbidden');
        }
        const data = await fs.promises.readFile(filePath);
        const ext = path.extname(filePath);
        const contentType = MIME_TYPES[ext] || 'application/octet-stream';
        
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(data);
        console.log(`${req.method} ${req.url}`);
    } catch (error) {
        if (error.code === 'ENOENT') {
            console.log(`404 ${req.url} - файл не найден`);
            res.writeHead(404, { 'Content-Type': 'text/html; charset=UTF-8' });
            res.end('<h1>404 - Файл не найден</h1>');
        } else {
            console.error(`Ошибка сервера:`, error);
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Internal Server Error');
        }
    }
});
server.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
    console.log(`Отдаю файлы из папки: ${PUBLIC_DIR}`);
});

