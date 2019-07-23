// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"node_modules/cs-engine/src/parts/Loop.js":[function(require,module,exports) {
class Loop {
   constructor(cs) {
      this.cs = cs
      this.run = false
      this.endSteps = []
      this.beforeSteps = []
      this.speed = 1000 / 60
      this.last = Date.now()
      this.id = 0
      this.timeout = undefined
   }

   step() {
      this.id += 1

      // delta fixing
      var now = Date.now()
      this.delta = (now - this.last) / this.speed
      this.last = now

      if (!this.run && !once) return
      this.timeout = setTimeout(this.step.bind(this), this.speed)

      console.log('meow')
      // this.cs.fps.update()
      // this.cs.key.execute()
      // this.cs.draw.debugReset()
      //
      // // network
      // this.cs.network.read()
      //
      // // move camera before clear
      // this.cs.camera.update()
      // this.cs.surface.clearAll()
      // this.cs.object.addNewObjects()
      //
      // // touch / mouse events
      // this.cs.touch.batchDownMove()
      //
      // // Execute before steps
      // // disconnect to allow adding within a beforestep
      // var temporaryBeforeSteps = []
      // while(this.beforeSteps.length){ temporaryBeforeSteps.push(this.beforeSteps.pop()) }
      // while (temporaryBeforeSteps.length) { temporaryBeforeSteps.pop()() }
      //
      // this.cs.userStep && cs.userStep()
      //
      // this.cs.object.loop(function(object) {
      //    if (!object.core.active || !object.core.live) return
      //    var stepEvent = cs.objects[object.core.type].step
      //    cs.draw.setSurface(object.core.surface)
      //    stepEvent && stepEvent.call(object  , object);
      // })
      //
      // this.cs.userDraw && cs.userDraw()
      // this.cs.object.loop(function(object) {
      //    if (!object.core.active || !object.core.live) return
      //    var objectType = this.cs.objects[object.core.type]
      //    var drawEvent = objectType.draw
      //    var drawOnceEvent = objectType.drawOnce
      //
      //    this.cs.draw.setSurface(object.core.surface)
      //    if (drawOnceEvent) {
      //       if (this.cs.surface.list[object.core.surface].clear || !object.core.drawn) {
      //          object.core.drawn = true
      //          drawOnceEvent.call(object, object)
      //       }
      //    }
      //
      //    drawEvent && drawEvent.call(object, object)
      // })
      //
      // // timers
      // this.cs.timer.loop()
      //
      // // Touch / Keyboard
      // this.cs.key.reset()
      // this.cs.touch.reset()
      // this.cs.touch.batchUp()
      //
      // // Resize Canvas
      // this.cs.surface.displayAll()
      // if (this.cs.room.restarting === true)
      //    this.cs.room.reset()
      //
      // // Execute next steps
      // while (this.endSteps.length) {
      //    this.endSteps.pop()()
      // }
      //
      // // could clearup !live objects here
      // this.cs.object.clean()
      //
      // // network metrics
      // if (this.cs.network.status) {
      //    this.cs.network.updateMetrics()
      // }
   }

   beforeStep(func) {
      this.beforeSteps.push(func)
   }

   endStep(func) {
      this.endSteps.push(func)
   }

   start() {
      this.run = true
      this.step()
   }

   stop() {
      this.run = false
      clearTimeout(this.timeout)
   }
}

// export node
if (module) module.exports = Loop

},{}],"node_modules/cs-engine/src/parts/Draw.js":[function(require,module,exports) {
class Draw {
   constructor(cs) {
      this.cs = cs
      this.debug = {}
      this.surface = {}
      this.config = {
         defaults: {
            alpha: 1,
            width: 1,
            font: { size: 12, family: 'Arial' },
            textAlign: 'start',
            textBaseline: 'top',
            color: '#000',
            lineHeight: 10,
            lineDash: [],
            operation: 'source-over'
         },
         current: {} // will clone on settingsDefault()
      }
   }

   setSurface(surface) {
      this.surface = surface
      this.scale = 1
      this.cameraX = 0
      this.cameraY = 0
      this.cameraWidth = this.surface.width
      this.cameraHeight = this.surface.height
      this.zScaleHack = 0

      if (this.surface.useCamera && this.surface.oneToOne) {
         var camera = this.cs.camera.info()

         this.scale = camera.zScale
         this.cameraX = camera.x
         this.cameraY = camera.y
         this.cameraWidth = camera.width
         this.cameraHeight = camera.height

         // helps sync up scaled surfaces with unscaled
         if (this.surface.oneToOne && camera.scale > 1) {
            this.zScaleHack = 1
         }
      }

      this.settingsDefault()
   }

   debugReset() {
      this.debug = {
         spritesSkipped: this.debug.spritesSkippedCount,
         spritesDrawn: this.debug.spritesDrawnCount,
         rectanglesSkipped: this.debug.rectanglesSkippedCount,
         rectanglesDrawn: this.debug.rectanglesDrawnCount,
         shapesSkipped: this.debug.shapesSkippedCount,
         shapesDrawn: this.debug.shapesDrawnCount,
         circlesSkipped: this.debug.circlesSkippedCount,
         circlesDrawn: this.debug.circlesDrawnCount,
         spritesSkippedCount: 0,
         spritesDrawnCount: 0,
         rectanglesSkippedCount: 0,
         rectanglesDrawnCount: 0,
         shapesSkippedCount: 0,
         shapesDrawnCount: 0,
         circlesSkippedCount: 0,
         circlesDrawnCount: 0,
      }
   }

   outside(o) {
      return (
         o.x + o.width < this.cameraX ||
         o.x > this.cameraX + this.cameraWidth ||
         o.y + o.height < this.cameraY ||
         o.y > this.cameraY + this.cameraHeight
      )
   }

   sprite(options) {
      var scale = this.scale
      var info = this.this.cs.sprite.info(options)
      var frame = info.frame
      var xOff = info.xoff
      var yOff = info.yoff

      // dest
      var dx = options.x - this.cameraX
      var dy = options.y - this.cameraY
      var dWidth = info.width
      var dHeight = info.height

      // source
      var sx = 0
      var sy = 0
      var sWidth = info.fWidth
      var sHeight = info.fHeight

      // trimming
      if (options.hTrim) {
         sHeight -= options.hTrim
         dHeight -= options.hTrim
      }

      // when flipping match the pixel
      if (info.scaleX < 0 && xOff) dx++
      if (info.scaleY < 0 && yOff) dy++

      var rotateOrSomething = (info.scaleX < 0 || info.scaleY < 0 || info.angle)
      if (rotateOrSomething) {
         this.surface.ctx.save()
         this.surface.ctx.translate((dx * scale), (dy * scale))
         this.surface.ctx.rotate(options.angle * Math.PI / 180)
         this.surface.ctx.scale(info.scaleX, info.scaleY)

         this.surface.ctx.drawImage(
            frame,
            sx, sy, sWidth, sHeight,
            (-xOff * scale),
            (-yOff * scale + this.zScaleHack),
            (dWidth * scale),
            (dHeight * scale)
         )

         this.surface.ctx.restore()
      } else {
         this.surface.ctx.drawImage(
            frame,
            sx, sy, sWidth, sHeight,
            ((dx - xOff) * scale),
            ((dy - yOff) * scale) + this.zScaleHack,
            (dWidth * scale),
            (dHeight * scale)
         )
      }

      this.debug.spritesDrawnCount += 1
      this.cs.draw.settingsDefault()
      return
   }

   textInfo(options) {
      // Guessing the size
      var lines = []
      var curLine = []
      var y = 0
      var x = 0
      var textArr = (options.text.toString()).split('')

      // Setup the lines
      for (var pos in textArr) {
         curLine.push(textArr[pos])

         if (this.surface.ctx.measureText(curLine.join('')).width > options.width) {
            // Try to find a space
            for (var o = curLine.length; o > 0; o--)
               if (curLine[o] == ' ') break

            // If no space add a dash
            if (!o) {
               o = curLine.length - 2
               curLine.splice(o - 1, 0, '-')
            }

            // Draw and reset
            lines.push(curLine.slice(0, o).join('').trim())
            curLine = curLine.slice(o, curLine.length)
            y += options.lineHeight
         }
         if (pos == textArr.length - 1) {
            lines.push(curLine.join('').trim())
         }
      }

      return {
         lines: lines,
         lineHeight: options.lineHeight,
         width: options.width,
         height: lines.length * options.lineHeight,
      }
   }

   text(options) {
      var x = options.x - this.cameraX
      var y = options.y - this.cameraY
      var scale = this.scale

      options.center && this.cs.draw.setTextCenter()

      if (options.lines) {
         for (var line in options.lines) {
            var lineYOffset = (line * (options.lineHeight || this.surface.ctx.lineHeight))
            this.surface.ctx.fillText(
               options.lines[line],
               x * scale,
               (y + lineYOffset) * scale
            )
         }
      } else {
         this.surface.ctx.fillText(
            options.text,
            Math.floor(x * scale),
            Math.floor(y * scale)
         )
      }
      this.settingsDefault()
   }

   textWidth(str) {
      return this.surface.ctx.measureText(str).width
   }

   line(options) {
      var lineWidth = this.surface.ctx.lineWidth
      var lineWidthAdjust = lineWidth / 2 / this.scale
      var scale = this.scale

      var x1 = options.points[0].x + lineWidthAdjust - this.cameraX
      var x2 = options.points[1].x + lineWidthAdjust - this.cameraX
      var y1 = options.points[0].y - lineWidthAdjust - this.cameraY
      var y2 = options.points[1].y - lineWidthAdjust - this.cameraY

      this.surface.ctx.beginPath();
      this.surface.ctx.moveTo(x1 * scale, y1 * scale);
      this.surface.ctx.lineTo(x2 * scale, y2 * scale);
      this.surface.ctx.stroke()
      this.settingsDefault()
   }

   fillRect(args) {
      var scale = this.scale
      var x = args.x
      var y = args.y
      var width = this.cs.default(args.width, args.size)
      var height = this.cs.default(args.height, args.size)

      if (args.center) {
         x -= width / 2
         y -= height / 2
      }

      if (this.outside({ x: x, y: y, width: width, height: height })) {
         this.debug.rectanglesSkippedCount += 1
         this.settingsDefault()
         return
      } else {
         this.debug.rectanglesDrawnCount += 1
      }

      this.surface.ctx.fillRect(
         (x - this.cameraX) * scale,
         (y - this.cameraY) * scale,
         width * scale,
         height * scale,
      )
      this.settingsDefault()
   }

   strokeRect(args) {
      var scale = this.scale
      var lineWidth = this.surface.ctx.lineWidth
      var lineWidthAdjust = lineWidth / 2 / scale

      var x = args.x + lineWidthAdjust
      var y = args.y + lineWidthAdjust
      var width = this.cs.default(args.width, args.size) - lineWidthAdjust * 2
      var height = this.cs.default(args.height, args.size) - lineWidthAdjust * 2

      if (args.center) {
         x -= width / 2
         y -= height / 2
      }

      if (this.outside({ x: x, y: y, width: width, height: height })) {
         this.debug.rectanglesSkippedCount += 1
         this.settingsDefault()
         return
      } else {
         this.debug.rectanglesDrawnCount += 1
      }

      this.surface.ctx.strokeRect(
         (x - this.cameraX) * scale,
         (y - this.cameraY) * scale,
         width * scale,
         height * scale,
      )

      this.settingsDefault()
   }

   circle(options) {
      var scale = this.scale
      var x = options.pos ? options.pos.x : options.x
      var y = options.pos ? options.pos.y : options.y
      var radius = options.radius

      if (this.outside({
         x: x - radius,
         y: y - radius,
         width: radius * 2,
         height: radius * 2,
      })) {
         this.debug.circlesSkippedCount += 1
         this.settingsDefault()
         return
      } else {
         this.debug.circleDrawnCount += 1
      }

      var fill = this.cs.default(options.fill, false)
      this.surface.ctx.beginPath()
      this.surface.ctx.arc(
         (x - this.cameraX) * scale,
         (y - this.cameraY) * scale,
         radius * scale,
         0, Math.PI * 2, true
      )
      this.surface.ctx.closePath()
      fill ? this.surface.ctx.fill() : this.surface.ctx.stroke()
      this.settingsDefault()
   }

   circleGradient(options) {
      var scale = this.scale
      var x = options.x - this.cameraX
      var y = options.y - this.cameraY
      var radius = options.radius
      var colorStart = options.colorStart
      var colorEnd = options.colorEnd

      var g = this.surface.ctx.createRadialGradient(
         x * scale,
         y * scale,
         0,
         x * scale,
         y * scale,
         radius * scale
      )
      g.addColorStop(1, colorEnd)
      g.addColorStop(0, colorStart)
      this.surface.ctx.fillStyle = g
      this.surface.ctx.beginPath()
      this.surface.ctx.arc(
         x * scale,
         y * scale,
         radius * scale,
         0, Math.PI * 2, true
      )
      this.surface.ctx.closePath()
      this.surface.ctx.fill()
      this.settingsDefault()
   }

   shape(options) {
      var scale = this.scale
      var vertices = options.vertices
      var relative = this.cs.default(options.relative, { x: 0, y: 0 })

      var bounds = { xmin: 0, ymin: 0, xmax: 0, ymax: 0 }
      for (var i = 0; i < vertices.length; i++) {
         bounds.xmin = Math.min(relative.x + vertices[i].x, bounds.xmin)
         bounds.ymin = Math.min(relative.y + vertices[i].y, bounds.ymin)
         bounds.xmax = Math.max(relative.x + vertices[i].x, bounds.xmax)
         bounds.ymax = Math.max(relative.y + vertices[i].y, bounds.ymax)
      }

      if (this.outside({
         x: bounds.xmin,
         y: bounds.ymin,
         width: bounds.xmax - bounds.xmin,
         height: bounds.ymax - bounds.ymin
      })) {
         this.debug.shapesSkippedCount += 1
         this.settingsDefault()
         return
      } else {
         this.debug.shapesDrawnCount += 1
      }


      this.surface.ctx.beginPath()
      this.surface.ctx.moveTo(
         (relative.x + vertices[0].x - this.cameraX) * scale,
         (relative.y + vertices[0].y - this.cameraY) * scale
      )

      for (var i = 1; i < vertices.length; i++) {
         this.surface.ctx.lineTo(
            (relative.x + vertices[i].x - this.cameraX) * scale,
            (relative.y + vertices[i].y - this.cameraY) * scale
         )
      }

      this.surface.ctx.closePath(
         (relative.x + vertices[0].x - this.cameraX) * scale,
         (relative.y + vertices[0].y - this.cameraY) * scale
      )

      !options.fill && this.surface.ctx.stroke()
      options.fill && this.surface.ctx.fill()
      this.settingsDefault()
   }

   setColor(color) {
      if(this.surface.ctx.fillStyle === color && this.surface.ctx.strokeStyle === color) return
      this.surface.ctx.fillStyle = color;
      this.surface.ctx.strokeStyle = color;
   }

   setAlpha(alpha) {
      if(this.surface.ctx.globalAlpha === alpha) return
      this.surface.ctx.globalAlpha = alpha;
   }

   setWidth(width) {
      if(this.surface.ctx.lineWidth === width * this.scale) return
      this.surface.ctx.lineWidth = width * this.scale;
   }

   setFont(options) {
      if(this.surface.ctx.fontSize === options.size * this.scale && this.surface.ctx.fontFamily === options.family) return
      this.surface.ctx.fontSize = options.size * this.scale
      this.surface.ctx.fontFamily = options.family
      this.surface.ctx.font = (options.effect ? options.effect + ' ' : '') + options.size * this.scale + 'px ' + options.family;
   }

   setLineHeight(height) {
      if(this.surface.ctx.lineHeight === height) return
      this.surface.ctx.lineHeight = height
   }

   setLineDash(lineDash) {
      this.surface.ctx.setLineDash(lineDash)
   }

   setTextAlign(alignment) {
      if(this.surface.ctx.textAlign === alignment) return
      this.surface.ctx.textAlign = alignment;
   }

   setTextBaseline(alignment) {
      if(this.surface.ctx.textBaseline === alignment) return
      this.surface.ctx.textBaseline = alignment;
   }

   setTextCenter() {
      this.setTextAlign('center');
      this.setTextBaseline('middle');
   }

   setOperation(operation) {
      if(this.surface.ctx.globalCompositeOperation === operation) return
      this.surface.ctx.globalCompositeOperation = operation;
   }

   settings(settings) {
      for (var setting in settings) {
         this.config.current[setting] = settings[setting]
      }
      this.settingsUpdate()
   }

   default(settings) {
      for (var setting in settings) {
         this.config.defaults[setting] = settings[setting]
      }
      this.settingsDefault()
   }

   settingsUpdate() {
      this.cs.draw.setAlpha(this.config.current.alpha)
      this.cs.draw.setWidth(this.config.current.width)
      this.cs.draw.setFont(this.config.current.font)
      this.cs.draw.setTextAlign(this.config.current.textAlign)
      this.cs.draw.setLineHeight(this.config.current.lineHeight)
      this.cs.draw.setTextBaseline(this.config.current.textBaseline)
      this.cs.draw.setColor(this.config.current.color)
      this.cs.draw.setOperation(this.config.current.operation)
      this.cs.draw.setLineDash(this.config.current.lineDash)
   }

   settingsDefault() {
      for (var setting in this.config.defaults) {
         this.config.current[setting] = this.config.defaults[setting]
      }

      this.settingsUpdate()
   }
}

if (module) module.exports = Draw

},{}],"node_modules/cs-engine/src/main.node.js":[function(require,module,exports) {
const Loop = require('./parts/Loop')
const Draw = require('./parts/Draw')

module.exports = class cs {
   constructor() {
      this.loop = new Loop(this)
      this.draw = new Draw(this)

      this.loop.start()
   }
}

},{"./parts/Loop":"node_modules/cs-engine/src/parts/Loop.js","./parts/Draw":"node_modules/cs-engine/src/parts/Draw.js"}],"index.js":[function(require,module,exports) {
// exmaple of a server side engine!
var CS = require('cs-engine');

var cs = new CS({
  canvas: canvas,
  objects: [],
  start: function start() {
    console.log('meow');
  }
});
console.log(cs);
},{"cs-engine":"node_modules/cs-engine/src/main.node.js"}],"node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "53517" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else {
        window.location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js","index.js"], null)
//# sourceMappingURL=/parcel.e31bb0bc.js.map