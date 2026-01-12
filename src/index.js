// Импорт полифиллов
import './polyfills.js';

// Импорт mermaid
import mermaid from 'mermaid';

// КРИТИЧЕСКИ ВАЖНО: Импорт и регистрация ELK для поддержки прямоугольных соединительных линий
// ELK (Eclipse Layout Kernel) необходим для отрисовки диаграмм с прямоугольными стрелками
// В Mermaid v11 ELK был вынесен в отдельный пакет и загружается динамически,
// но для старых браузеров (WebKit 1С) нужно встроить его в бандл
import elkLayouts from '@mermaid-js/layout-elk';

// Регистрация ELK layout loaders ДО инициализации mermaid
if (mermaid.registerLayoutLoaders && typeof mermaid.registerLayoutLoaders === 'function') {
  mermaid.registerLayoutLoaders(elkLayouts);
}

// Инициализация mermaid с настройками для старых браузеров
// startOnLoad: true - включаем автоматическую обработку элементов с классом .mermaid
mermaid.initialize({
  startOnLoad: true,
  theme: 'default',
  securityLevel: 'loose',
  // Дополнительные настройки для совместимости со старыми браузерами
  flowchart: {
    useMaxWidth: true,
    htmlLabels: true
    // Можно включить ELK по умолчанию для всех flowchart:
    // defaultRenderer: 'elk'
  },
  logLevel: 'error'
});

// Экспорт в глобальную область видимости для использования в HTML
if (typeof window !== 'undefined') {
  window.mermaid = mermaid;
  // Также экспортируем mermaidAPI, если доступен
  if (mermaid.mermaidAPI) {
    window.mermaidAPI = mermaid.mermaidAPI;
  }
}

// Также экспортируем для совместимости с различными форматами модулей
export default mermaid;

