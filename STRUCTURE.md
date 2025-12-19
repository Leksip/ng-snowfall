# Структура библиотеки ng-snowfall

```
ng-snowfall/
├── src/
│   ├── lib/
│   │   ├── snowfall.component.ts    # Основной компонент
│   │   ├── snowfall.component.html  # Шаблон компонента
│   │   ├── snowfall.component.scss  # Стили компонента
│   │   └── snowfall.module.ts      # Angular модуль
│   └── public-api.ts                # Публичный API для экспорта
├── package.json                     # Конфигурация npm пакета
├── ng-package.json                  # Конфигурация ng-packagr
├── tsconfig.lib.json                # TypeScript конфигурация для библиотеки
├── README.md                        # Документация для пользователей
├── PUBLISH.md                       # Инструкции по публикации
├── .gitignore                       # Git ignore файл
└── .npmignore                       # NPM ignore файл
```

## Основные файлы

- **snowfall.component.ts** - основной компонент с логикой снегопада
- **snowfall.module.ts** - Angular модуль для импорта
- **public-api.ts** - экспортирует все публичные API библиотеки
- **package.json** - метаданные npm пакета
- **ng-package.json** - конфигурация для сборки библиотеки

## Сборка

После установки зависимостей (`npm install`), соберите библиотеку:

```bash
npm run build
```

Результат будет в папке `dist/ng-snowfall/`
