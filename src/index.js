// Импорт полифиллов
import './polyfills.js';

// Импорт mermaid
import mermaid from 'mermaid';

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

