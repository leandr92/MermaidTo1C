import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const packageJson = JSON.parse(
  readFileSync(resolve(__dirname, 'package.json'), 'utf-8')
);

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/mermaid_all_in_one.js',
    format: 'iife',
    name: 'mermaid',
    sourcemap: false,
    inlineDynamicImports: true,
    banner: `/*!
 * Mermaid.js ${packageJson.dependencies.mermaid} транспилировано для 1С
 * Собрано: ${new Date().toISOString()}
 */
// Полифиллы для старых браузеров (IE 11 и старые WebKit)
// КРИТИЧЕСКИ ВАЖНО: Полифиллы должны быть установлены ДО выполнения кода mermaid

// Полифилл для Object.hasOwn (ES2022) - устанавливается напрямую в глобальной области
if (typeof Object.hasOwn === 'undefined') {
  Object.hasOwn = function(obj, prop) {
    return Object.prototype.hasOwnProperty.call(obj, prop);
  };
}

(function() {
  'use strict';
  
  // Полифилл для Object.assign (ES6)
  if (typeof Object.assign !== 'function') {
    Object.assign = function(target) {
      if (target == null) {
        throw new TypeError('Cannot convert undefined or null to object');
      }
      var to = Object(target);
      for (var index = 1; index < arguments.length; index++) {
        var nextSource = arguments[index];
        if (nextSource != null) {
          for (var nextKey in nextSource) {
            if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
              to[nextKey] = nextSource[nextKey];
            }
          }
        }
      }
      return to;
    };
  }
  
  // Полифилл для Array.from (ES6)
  if (!Array.from) {
    Array.from = function(arrayLike, mapFn, thisArg) {
      var C = this;
      var items = Object(arrayLike);
      if (arrayLike == null) {
        throw new TypeError('Array.from requires an array-like object - not null or undefined');
      }
      var mapFunction = mapFn === undefined ? undefined : mapFn;
      var T;
      if (typeof mapFunction !== 'undefined') {
        if (typeof mapFunction !== 'function') {
          throw new TypeError('Array.from: when provided, the second argument must be a function');
        }
        if (arguments.length > 2) {
          T = thisArg;
        }
      }
      var len = parseInt(items.length, 10) || 0;
      var A = typeof C === 'function' ? Object(new C(len)) : new Array(len);
      var k = 0;
      var kValue;
      while (k < len) {
        kValue = items[k];
        if (mapFunction) {
          A[k] = typeof T === 'undefined' ? mapFunction(kValue, k) : mapFunction.call(T, kValue, k);
        } else {
          A[k] = kValue;
        }
        k += 1;
      }
      A.length = len;
      return A;
    };
  }
  
  // Полифилл для Array.includes (ES7)
  if (!Array.prototype.includes) {
    Array.prototype.includes = function(searchElement, fromIndex) {
      if (this == null) {
        throw new TypeError('"this" is null or not defined');
      }
      var o = Object(this);
      var len = parseInt(o.length, 10) || 0;
      if (len === 0) {
        return false;
      }
      var n = parseInt(fromIndex, 10) || 0;
      var k = n >= 0 ? n : Math.max(len + n, 0);
      function sameValueZero(x, y) {
        return x === y || (typeof x === 'number' && typeof y === 'number' && isNaN(x) && isNaN(y));
      }
      for (; k < len; k++) {
        if (sameValueZero(o[k], searchElement)) {
          return true;
        }
      }
      return false;
    };
  }
  
  // Полифилл для String.includes (ES6)
  if (!String.prototype.includes) {
    String.prototype.includes = function(search, start) {
      if (typeof start !== 'number') {
        start = 0;
      }
      if (start + search.length > this.length) {
        return false;
      } else {
        return this.indexOf(search, start) !== -1;
      }
    };
  }
  
  // Полифилл для structuredClone (не поддерживается в старых браузерах)
  if (typeof structuredClone === 'undefined') {
    window.structuredClone = function(obj) {
      if (obj === null || typeof obj !== 'object') {
        return obj;
      }
      if (obj instanceof Date) {
        return new Date(obj.getTime());
      }
      if (obj instanceof Array) {
        var result = [];
        for (var i = 0; i < obj.length; i++) {
          result[i] = window.structuredClone(obj[i]);
        }
        return result;
      }
      if (typeof obj === 'object') {
        var copy = {};
        for (var key in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, key)) {
            copy[key] = window.structuredClone(obj[key]);
          }
        }
        return copy;
      }
      return obj;
    };
  }
  
  // Полифилл для Array.prototype.at() (ES2022) - критически важен для Mermaid 11.x
  if (!Array.prototype.at) {
    Array.prototype.at = function(index) {
      var len = this.length;
      var relativeIndex = index >= 0 ? index : len + index;
      if (relativeIndex < 0 || relativeIndex >= len) {
        return undefined;
      }
      return this[relativeIndex];
    };
  }
  
  // Полифилл для SVGElement.getBBox() - критически важен для Mermaid в старых браузерах
  // Работает для всех SVG элементов, включая те, что возвращаются через D3 .node()
  (function() {
    function getBBoxPolyfill() {
      var element = this;
      
      // Если это D3 элемент с методом node(), получаем нативный элемент
      if (element && typeof element.node === 'function') {
        element = element.node();
      }
      
      // Если элемент null или undefined, возвращаем значения по умолчанию
      if (!element) {
        return { x: 0, y: 0, width: 100, height: 100 };
      }
      
      // Пробуем использовать нативный getBBox, если доступен
      if (element.getBBox && typeof element.getBBox === 'function') {
        try {
          return element.getBBox();
        } catch (e) {
          // Если getBBox выбросил ошибку, вычисляем вручную
        }
      }
      
      // Вычисляем bounding box вручную
      var bbox = {
        x: 0,
        y: 0,
        width: 0,
        height: 0
      };
      
      try {
        // Пробуем получить через getBoundingClientRect
        if (element.getBoundingClientRect) {
          var rect = element.getBoundingClientRect();
          bbox.width = rect.width || 0;
          bbox.height = rect.height || 0;
        }
        
        // Пробуем получить атрибуты width и height
        if (element.getAttribute) {
          var width = element.getAttribute('width');
          var height = element.getAttribute('height');
          if (width) {
            bbox.width = parseFloat(width) || bbox.width;
          }
          if (height) {
            bbox.height = parseFloat(height) || bbox.height;
          }
        }
        
        // Пробуем получить через style
        if (element.style) {
          var styleWidth = element.style.width;
          var styleHeight = element.style.height;
          if (styleWidth) {
            bbox.width = parseFloat(styleWidth) || bbox.width;
          }
          if (styleHeight) {
            bbox.height = parseFloat(styleHeight) || bbox.height;
          }
        }
        
        // Если ничего не получилось, возвращаем минимальные значения
        if (bbox.width === 0 && bbox.height === 0) {
          bbox.width = 100;
          bbox.height = 100;
        }
      } catch (e) {
        // В случае ошибки возвращаем значения по умолчанию
        bbox.width = 100;
        bbox.height = 100;
      }
      
      return bbox;
    }
    
    // Добавляем полифилл для всех SVG элементов
    var svgElementTypes = ['SVGElement', 'SVGTextElement', 'SVGRectElement', 'SVGPathElement', 
                          'SVGCircleElement', 'SVGEllipseElement', 'SVGLineElement', 'SVGPolygonElement',
                          'SVGPolylineElement', 'SVGGElement', 'SVGUseElement'];
    
    svgElementTypes.forEach(function(typeName) {
      if (typeof window[typeName] !== 'undefined' && window[typeName].prototype) {
        if (!window[typeName].prototype.getBBox || typeof window[typeName].prototype.getBBox !== 'function') {
          window[typeName].prototype.getBBox = getBBoxPolyfill;
        }
      }
    });
    
    // Также добавляем для всех элементов, которые могут быть SVG (на всякий случай)
    if (typeof Element !== 'undefined' && Element.prototype) {
      // Перехватываем getBBox на любых элементах, которые могут быть SVG
      var originalGetBBox = Element.prototype.getBBox;
      if (!originalGetBBox || typeof originalGetBBox !== 'function') {
        Element.prototype.getBBox = function() {
          // Проверяем, является ли элемент SVG элементом
          if (this.namespaceURI === 'http://www.w3.org/2000/svg' || this.tagName && this.tagName.toLowerCase().indexOf('svg') !== -1) {
            return getBBoxPolyfill.call(this);
          }
          // Если не SVG, возвращаем значения по умолчанию
          return { x: 0, y: 0, width: 100, height: 100 };
        };
      }
    }
  })();
})();

// Убеждаемся, что Object.hasOwn установлен глобально
if (typeof Object.hasOwn === 'undefined') {
  Object.hasOwn = function(obj, prop) {
    return Object.prototype.hasOwnProperty.call(obj, prop);
  };
}`
  },
  plugins: [
    nodeResolve({
      browser: true,
      preferBuiltins: false
    }),
    commonjs({
      include: /node_modules/
    }),
    babel({
      babelHelpers: 'bundled',
      // Обрабатываем все импортируемые модули для полной транспиляции
      exclude: /node_modules\/core-js/,
      extensions: ['.js', '.mjs'],
      presets: [
        [
          '@babel/preset-env',
          {
            targets: {
              ie: '11'
            },
            useBuiltIns: 'entry',
            corejs: {
              version: 3,
              proposals: false
            },
            modules: false,
            forceAllTransforms: true
          }
        ]
      ]
    })
  ],
  external: [],
  onwarn(warning, warn) {
    // Подавляем предупреждения о circular dependencies, которые часто встречаются в больших библиотеках
    if (warning.code === 'CIRCULAR_DEPENDENCY') {
      return;
    }
    warn(warning);
  }
};
