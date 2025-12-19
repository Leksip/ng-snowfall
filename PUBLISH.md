# Инструкция по публикации библиотеки

## Подготовка

1. Обновите информацию в `package.json`:
   - `name`: имя пакета (например, `ng-snowfall`)
   - `version`: версия (например, `1.0.0`)
   - `author`: ваше имя
   - `repository.url`: URL вашего GitHub репозитория

2. Установите зависимости:
```bash
cd ng-snowfall
npm install
```

## Сборка

```bash
npm run build
```

Это создаст папку `dist/ng-snowfall` с собранной библиотекой.

## Публикация на npm

### 1. Создайте аккаунт на npm (если еще нет)
```bash
npm adduser
```

### 2. Войдите в npm
```bash
npm login
```

### 3. Проверьте что вы вошли
```bash
npm whoami
```

### 4. Опубликуйте пакет
```bash
npm publish
```

Для публикации в scope (например, `@yourusername/ng-snowfall`):
```bash
npm publish --access public
```

## Публикация на GitHub

1. Создайте репозиторий на GitHub

2. Инициализируйте git (если еще не сделано):
```bash
git init
git add .
git commit -m "Initial commit"
```

3. Добавьте remote:
```bash
git remote add origin https://github.com/yourusername/ng-snowfall.git
```

4. Запушьте код:
```bash
git push -u origin main
```

5. Создайте релиз на GitHub:
   - Перейдите в раздел Releases
   - Нажмите "Create a new release"
   - Укажите версию (например, v1.0.0)
   - Добавьте описание изменений

## Обновление версии

После изменений обновите версию в `package.json`:
- `1.0.0` → `1.0.1` (patch)
- `1.0.0` → `1.1.0` (minor)
- `1.0.0` → `2.0.0` (major)

Затем:
```bash
npm run build
npm publish
```

## Использование в других проектах

После публикации установите:
```bash
npm install ng-snowfall
```

Используйте как описано в README.md
