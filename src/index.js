// Импорт полифиллов
import './polyfills.js';

// Импорт mermaid
import mermaid from 'mermaid';

// КРИТИЧЕСКИ ВАЖНО: Импорт и регистрация ELK для поддержки прямоугольных соединительных линий
// ELK (Eclipse Layout Kernel) необходим для отрисовки диаграмм с прямоугольными стрелками
// В Mermaid v11 ELK был вынесен в отдельный пакет и загружается динамически,
// но для старых браузеров (WebKit 1С) нужно встроить его в бандл
import elkLayouts from '@mermaid-js/layout-elk';

// ========== РАСШИРЕННОЕ ЛОГИРОВАНИЕ ELK ==========
console.log('=== ELK DEBUG: Начало инициализации ===');
console.log('ELK DEBUG: elkLayouts импортирован:', elkLayouts);
console.log('ELK DEBUG: Тип elkLayouts:', typeof elkLayouts);
console.log('ELK DEBUG: elkLayouts является массивом?', Array.isArray(elkLayouts));
if (elkLayouts) {
  console.log('ELK DEBUG: Длина elkLayouts:', elkLayouts.length);
  if (elkLayouts.length > 0) {
    console.log('ELK DEBUG: Первый layout loader:', elkLayouts[0]);
    console.log('ELK DEBUG: Ключи первого loader:', elkLayouts[0] ? Object.keys(elkLayouts[0]) : 'N/A');
  }
}

// Проверка доступности методов mermaid для регистрации ELK
console.log('ELK DEBUG: mermaid объект:', mermaid);
console.log('ELK DEBUG: mermaid.registerLayoutLoaders существует?', typeof mermaid.registerLayoutLoaders);
console.log('ELK DEBUG: mermaid.registerLayoutLoaders является функцией?', typeof mermaid.registerLayoutLoaders === 'function');

// Регистрация ELK layout loaders ДО инициализации mermaid
if (mermaid.registerLayoutLoaders && typeof mermaid.registerLayoutLoaders === 'function') {
  console.log('ELK DEBUG: Регистрируем ELK layout loaders...');
  console.log('ELK DEBUG: Передаем в registerLayoutLoaders:', elkLayouts);
  
  try {
    mermaid.registerLayoutLoaders(elkLayouts);
    console.log('ELK DEBUG: ✅ registerLayoutLoaders вызван успешно');
    console.log('ELK DEBUG: Количество зарегистрированных layouts:', elkLayouts ? elkLayouts.length : 0);
    
    // Проверяем, что layouts действительно зарегистрированы
    if (mermaid.getConfig) {
      var config = mermaid.getConfig();
      console.log('ELK DEBUG: Текущая конфигурация mermaid:', config);
    }
    
    // Проверяем наличие методов для работы с layouts
    console.log('ELK DEBUG: Доступные методы mermaid:', Object.keys(mermaid).filter(function(key) {
      return typeof mermaid[key] === 'function';
    }));
  } catch (error) {
    console.error('ELK DEBUG: ❌ ОШИБКА при регистрации ELK layout loaders:', error);
    console.error('ELK DEBUG: Стек ошибки:', error.stack);
  }
} else {
  console.warn('ELK DEBUG: ⚠️ mermaid.registerLayoutLoaders не найден!');
  console.warn('ELK DEBUG: Доступные методы mermaid:', Object.keys(mermaid));
  
  // Пробуем альтернативные способы регистрации
  if (mermaid.mermaidAPI && mermaid.mermaidAPI.registerLayoutLoaders) {
    console.log('ELK DEBUG: Пробуем зарегистрировать через mermaidAPI...');
    try {
      mermaid.mermaidAPI.registerLayoutLoaders(elkLayouts);
      console.log('ELK DEBUG: ✅ Зарегистрировано через mermaidAPI');
    } catch (error) {
      console.error('ELK DEBUG: ❌ Ошибка при регистрации через mermaidAPI:', error);
    }
  }
}

// Инициализация mermaid с настройками для старых браузеров
// startOnLoad: true - включаем автоматическую обработку элементов с классом .mermaid
console.log('ELK DEBUG: Инициализируем mermaid с конфигурацией...');
var mermaidConfig = {
  startOnLoad: true,
  theme: 'default',
  securityLevel: 'loose',
  // Дополнительные настройки для совместимости со старыми браузерами
  flowchart: {
    useMaxWidth: true,
    htmlLabels: true,
    // Включаем ELK по умолчанию для всех flowchart для поддержки прямоугольных соединительных линий
    defaultRenderer: 'elk'
  },
  logLevel: 'debug' // Временно включаем debug для диагностики
};

console.log('ELK DEBUG: Конфигурация mermaid:', JSON.stringify(mermaidConfig, null, 2));
console.log('ELK DEBUG: flowchart.defaultRenderer:', mermaidConfig.flowchart.defaultRenderer);

try {
  mermaid.initialize(mermaidConfig);
  console.log('ELK DEBUG: ✅ mermaid.initialize вызван успешно');
  
  // Проверяем, что конфигурация применилась
  if (mermaid.getConfig) {
    var appliedConfig = mermaid.getConfig();
    console.log('ELK DEBUG: Примененная конфигурация:', JSON.stringify(appliedConfig, null, 2));
    if (appliedConfig.flowchart) {
      console.log('ELK DEBUG: Примененный flowchart.defaultRenderer:', appliedConfig.flowchart.defaultRenderer);
    }
  }
} catch (error) {
  console.error('ELK DEBUG: ❌ ОШИБКА при инициализации mermaid:', error);
  console.error('ELK DEBUG: Стек ошибки:', error.stack);
}

// Перехватываем вызовы run() для логирования процесса отрисовки
if (typeof window !== 'undefined' && mermaid.run) {
  var originalRun = mermaid.run;
  mermaid.run = function() {
    console.log('ELK DEBUG: === Вызван mermaid.run() ===');
    console.log('ELK DEBUG: Найдено элементов .mermaid:', document.querySelectorAll('.mermaid').length);
    
    var result = originalRun.apply(this, arguments);
    
    // Если run возвращает Promise, логируем его выполнение
    if (result && typeof result.then === 'function') {
      result.then(function() {
        console.log('ELK DEBUG: ✅ mermaid.run() завершен успешно');
        
        // Проверяем созданные SVG элементы
        var svgElements = document.querySelectorAll('.mermaid svg');
        console.log('ELK DEBUG: Создано SVG элементов:', svgElements.length);
        
        svgElements.forEach(function(svg, index) {
          console.log('ELK DEBUG: SVG #' + index + ':');
          console.log('  - Размеры:', svg.getAttribute('width'), 'x', svg.getAttribute('height'));
          
          // Проверяем пути (paths) - они должны быть угловатыми для ELK
          var paths = svg.querySelectorAll('path');
          console.log('  - Количество path элементов:', paths.length);
          
          paths.forEach(function(path, pathIndex) {
            var d = path.getAttribute('d');
            if (d) {
              // Проверяем наличие кривых (C, S, Q, T команды) - это скругленные линии
              var hasCurves = /[CSTQ]/.test(d);
              // Проверяем наличие прямых линий (L, H, V команды) - это угловатые линии
              var hasLines = /[LHV]/.test(d);
              
              console.log('  - Path #' + pathIndex + ':');
              console.log('    - Содержит кривые (скругленные)?', hasCurves);
              console.log('    - Содержит прямые линии (угловатые)?', hasLines);
              console.log('    - Первые 100 символов d:', d.substring(0, 100));
              
              if (hasCurves && !hasLines) {
                console.warn('ELK DEBUG: ⚠️ Path #' + pathIndex + ' содержит только кривые - возможно ELK не используется!');
              }
            }
          });
          
          // Проверяем классы и атрибуты, которые могут указывать на используемый renderer
          var classes = svg.getAttribute('class') || '';
          console.log('  - Классы SVG:', classes);
          if (classes.indexOf('elk') !== -1) {
            console.log('  - ✅ SVG использует ELK renderer (найдено в классах)');
          } else {
            console.warn('  - ⚠️ SVG не содержит признаков ELK renderer в классах');
          }
        });
      }).catch(function(error) {
        console.error('ELK DEBUG: ❌ Ошибка при выполнении mermaid.run():', error);
        console.error('ELK DEBUG: Стек ошибки:', error.stack);
      });
    }
    
    return result;
  };
  
  console.log('ELK DEBUG: ✅ Перехват mermaid.run() установлен');
}

console.log('=== ELK DEBUG: Инициализация завершена ===');

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

