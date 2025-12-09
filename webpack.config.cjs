const path = require('path');
const webpack = require('webpack');

module.exports = {
  mode: 'production',
  cache: false,
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'mermaid_all_in_one.js',
    library: 'mermaid',
    libraryTarget: 'var',
    globalObject: 'this',
    chunkLoading: false,
    wasmLoading: false
  },
  resolve: {
    extensions: ['.js', '.mjs', '.json'],
    fallback: {
      "fs": false,
      "path": false,
      "crypto": false
    },
    alias: {
      'regenerator-runtime/runtime': 'regenerator-runtime/runtime.js'
    }
  },
  module: {
    rules: [
      {
        test: /\.(js|mjs)$/,
        exclude: /node_modules\/core-js/,
        use: {
          loader: 'babel-loader',
          options: {
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
                  forceAllTransforms: true,
                  shippedProposals: false,
                  // Дополнительные настройки для более агрессивной транспиляции
                  include: [
                    '@babel/plugin-transform-regenerator',
                    '@babel/plugin-transform-arrow-functions',
                    '@babel/plugin-transform-template-literals'
                  ]
                }
              ]
            ],
            plugins: [
              ['@babel/plugin-transform-template-literals', { loose: true }]
            ]
          }
        }
      }
    ]
  },
  plugins: [
    new webpack.BannerPlugin({
      banner: `/*!
 * Mermaid.js транспилировано для 1С
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
})();

// Убеждаемся, что Object.hasOwn установлен глобально
if (typeof Object.hasOwn === 'undefined') {
  Object.hasOwn = function(obj, prop) {
    return Object.prototype.hasOwnProperty.call(obj, prop);
  };
}`,
      raw: true
    })
  ],
  optimization: {
    minimize: false,
    splitChunks: false,
    runtimeChunk: false
  },
  performance: {
    hints: false
  }
};

