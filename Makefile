# Переменные
APP_NAME=clover-frontend
PORT=80

.PHONY: restart build clean check-port

# Главная команда для перезапуска
restart: clean build
	@echo "🚀 Starting app with PM2..."
	pm2 start server.js --name $(APP_NAME)
	@echo "✅ Restarted successfully!"

# Очистка: убиваем старый процесс PM2 и освобождаем порт
clean:
	@echo "🧹 Cleaning up..."
	-pm2 delete $(APP_NAME)
	-sudo fuser -k $(PORT)/tcp
	@echo "✨ Port $(PORT) is free."

# Сборка проекта
build:
	@echo "📦 Building project..."
	npm install
	npm run build

# Вспомогательная команда: проверить, что на порту
check-port:
	sudo lsof -i :$(PORT)
