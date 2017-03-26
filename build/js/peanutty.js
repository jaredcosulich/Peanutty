// Generated by CoffeeScript 1.9.3
(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  (function($) {
    var Peanutty, Screen, b2d;
    b2d = require('coffeebox2d');
    Screen = require('Screen');
    CoffeeScript.require = require;
    CoffeeScript["eval"] = function(code, options) {
      return eval(CoffeeScript.compile(code, options));
    };
    CoffeeScript.run = function(code, options) {
      if (options == null) {
        options = {};
      }
      options.bare = true;
      return Function(CoffeeScript.compile(code, options))();
    };
    b2d.Dynamics.b2Fixture.prototype.Create2 = b2d.Dynamics.b2Fixture.prototype.Create;
    b2d.Dynamics.b2Fixture.prototype.Create = function(body, xf, def) {
      this.drawData = def.drawData;
      return this.Create2(body, xf, def);
    };
    b2d.Dynamics.b2Fixture.prototype.GetDrawData = function() {
      return this.drawData || {};
    };
    b2d.Dynamics.b2Fixture.prototype.SetDrawData = function(drawData) {
      var attr, results;
      this.drawData || (this.drawData = {});
      results = [];
      for (attr in drawData) {
        results.push(this.drawData[attr] = drawData[attr]);
      }
      return results;
    };
    b2d.Dynamics.b2DebugDraw.prototype.m_centerAdjustment = new b2d.Common.Math.b2Vec2(0, 0);
    b2d.Dynamics.b2DebugDraw.prototype.SetCenterAdjustment = function(centerAdjustment) {
      return this.m_centerAdjustment = centerAdjustment;
    };
    b2d.Dynamics.b2DebugDraw.prototype.AdjustCenterX = function(adjustment) {
      return this.m_centerAdjustment.Add(new b2d.Common.Math.b2Vec2(adjustment, 0));
    };
    b2d.Dynamics.b2DebugDraw.prototype.AdjustCenterY = function(adjustment) {
      return this.m_centerAdjustment.Add(new b2d.Common.Math.b2Vec2(0, adjustment));
    };
    b2d.Dynamics.b2DebugDraw.prototype.GetCenterAdjustment = function() {
      return this.m_centerAdjustment;
    };
    b2d.Dynamics.b2DebugDraw.prototype.DrawSolidCircle = function(center, radius, axis, color) {
      var centerAdjustment, cx, cy, drawScale, s;
      if (radius == null) {
        return;
      }
      s = this.m_ctx;
      drawScale = this.m_drawScale;
      centerAdjustment = this.m_centerAdjustment.Copy();
      centerAdjustment.Multiply(1 / this.m_drawScale);
      center = center.Copy();
      center.Add(centerAdjustment);
      cx = center.x * drawScale;
      cy = center.y * drawScale;
      s.moveTo(0, 0);
      s.beginPath();
      s.strokeStyle = this._color(color.color, this.m_alpha);
      s.fillStyle = this._color(color.color, this.m_fillAlpha);
      s.arc(cx, cy, radius * drawScale, 0, Math.PI * 2, true);
      s.moveTo(cx, cy);
      s.lineTo((center.x + axis.x * radius) * drawScale, (center.y + axis.y * radius) * drawScale);
      s.closePath();
      s.fill();
      return s.stroke();
    };
    b2d.Dynamics.b2DebugDraw.prototype.DrawSolidPolygon = function(vertices, vertexCount, color) {
      var centerAdjustment, drawScale, i, j, ref, s;
      if (!vertexCount) {
        return;
      }
      s = this.m_ctx;
      drawScale = this.m_drawScale;
      centerAdjustment = this.m_centerAdjustment.Copy();
      centerAdjustment.Multiply(1 / this.m_drawScale);
      s.beginPath();
      s.strokeStyle = this._color(color.color, this.m_alpha);
      s.fillStyle = this._color(color.color, this.m_fillAlpha);
      s.moveTo((vertices[0].x + centerAdjustment.x) * drawScale, (vertices[0].y + centerAdjustment.y) * drawScale);
      for (i = j = 1, ref = vertexCount; 1 <= ref ? j < ref : j > ref; i = 1 <= ref ? ++j : --j) {
        s.lineTo((vertices[i].x + centerAdjustment.x) * drawScale, (vertices[i].y + centerAdjustment.y) * drawScale);
      }
      s.lineTo((vertices[0].x + centerAdjustment.x) * drawScale, (vertices[0].y + centerAdjustment.y) * drawScale);
      s.closePath();
      s.fill();
      return s.stroke();
    };
    Peanutty = (function() {
      function Peanutty(arg) {
        var gravity, scale;
        this.canvas = arg.canvas, this.scriptEditor = arg.scriptEditor, this.levelEditor = arg.levelEditor, this.environmentEditor = arg.environmentEditor, scale = arg.scale, gravity = arg.gravity;
        this.destroyWorld = bind(this.destroyWorld, this);
        this.destroyDynamicObjects = bind(this.destroyDynamicObjects, this);
        this.sign = bind(this.sign, this);
        this.endShape = bind(this.endShape, this);
        this.getFreeformShape = bind(this.getFreeformShape, this);
        this.endFreeformShape = bind(this.endFreeformShape, this);
        this.continueFreeformShape = bind(this.continueFreeformShape, this);
        this.startShape = bind(this.startShape, this);
        this.startFreeformShape = bind(this.startFreeformShape, this);
        this.initFreeformShape = bind(this.initFreeformShape, this);
        this.drawFreeformShape = bind(this.drawFreeformShape, this);
        this.addTempToFreeformShape = bind(this.addTempToFreeformShape, this);
        this.addToFreeformShape = bind(this.addToFreeformShape, this);
        this.redrawTempShapes = bind(this.redrawTempShapes, this);
        this.addTempShape = bind(this.addTempShape, this);
        this.redrawCurrentShape = bind(this.redrawCurrentShape, this);
        this.createRandomObjects = bind(this.createRandomObjects, this);
        this.createFixtureDef = bind(this.createFixtureDef, this);
        this._direction = bind(this._direction, this);
        this._counterClockWise = bind(this._counterClockWise, this);
        this.createPoly = bind(this.createPoly, this);
        this.polyFixtureDef = bind(this.polyFixtureDef, this);
        this.createBall = bind(this.createBall, this);
        this.createBox = bind(this.createBox, this);
        this.createGround = bind(this.createGround, this);
        this.setBodyDefPosition = bind(this.setBodyDefPosition, this);
        this.sendCodeMessage = bind(this.sendCodeMessage, this);
        this.searchObjectList = bind(this.searchObjectList, this);
        this.addToScript = bind(this.addToScript, this);
        this.initScreen = bind(this.initScreen, this);
        this.removeContactListeners = bind(this.removeContactListeners, this);
        this.addContactListener = bind(this.addContactListener, this);
        this.initContactListeners = bind(this.initContactListeners, this);
        this.clearStorage = bind(this.clearStorage, this);
        this.runSimulation = bind(this.runSimulation, this);
        this.world = new b2d.Dynamics.b2World(gravity || new b2d.Common.Math.b2Vec2(0, 10), true);
        this.clearStorage();
        this.initScreen(scale);
        this.initContactListeners();
      }

      Peanutty.prototype.runSimulation = function() {
        var requestAnimFrame, update;
        requestAnimFrame = ((function(_this) {
          return function() {
            return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(callback, element) {
              return $.timeout(1000 / 60, callback);
            };
          };
        })(this))();
        update = (function(_this) {
          return function() {
            if (_this.world == null) {
              return;
            }
            _this.world.Step(1 / 60, 10, 10);
            _this.screen.render(_this.world);
            _this.redrawCurrentShape();
            _this.redrawTempShapes();
            _this.world.ClearForces();
            return requestAnimFrame(update);
          };
        })(this);
        return requestAnimFrame(update);
      };

      Peanutty.prototype.clearStorage = function() {
        this.tempShapes = [];
        this.beginContactListeners = [];
        return this.endContactListeners = [];
      };

      Peanutty.prototype.beginContactListeners = [];

      Peanutty.prototype.endContactListeners = [];

      Peanutty.prototype.initContactListeners = function() {
        var PeanuttyContactListener, beginContact;
        beginContact = (function(_this) {
          return function(contact) {
            var j, len, listener, ref, results;
            ref = _this.beginContactListeners;
            results = [];
            for (j = 0, len = ref.length; j < len; j++) {
              listener = ref[j];
              results.push(listener(contact));
            }
            return results;
          };
        })(this);
        PeanuttyContactListener = (function(superClass) {
          extend(PeanuttyContactListener, superClass);

          function PeanuttyContactListener() {
            return PeanuttyContactListener.__super__.constructor.apply(this, arguments);
          }

          PeanuttyContactListener.prototype.BeginContact = beginContact;

          return PeanuttyContactListener;

        })(b2d.Dynamics.b2ContactListener);
        return this.world.SetContactListener(new PeanuttyContactListener);
      };

      Peanutty.prototype.addContactListener = function(arg) {
        var listener, type;
        listener = arg.listener, type = arg.type;
        type || (type = 'begin');
        return this[type + "ContactListeners"].push(listener);
      };

      Peanutty.prototype.removeContactListeners = function() {
        this.beginContactListeners = [];
        return this.endContactListeners = [];
      };

      Peanutty.prototype.initScreen = function(scale) {
        this.screen = new Screen({
          canvas: this.canvas,
          scale: scale
        });
        return this.world.SetDebugDraw(this.screen.getDraw());
      };

      Peanutty.prototype.addToScript = function(arg) {
        var command, commandLength, endLine, scriptCode, time;
        command = arg.command, time = arg.time;
        CoffeeScript.run(command);
        commandLength = command.split("\n").length;
        scriptCode = view.getScriptCode();
        endLine = scriptCode.split("\n").length + 1;
        if (scriptCode.length > 0 && time > 0) {
          scriptCode += "\npeanutty.wait(" + (parseInt(time)) + ")\n";
          commandLength += 1;
        }
        scriptCode += command + "\n\n";
        view.editorValues.script = scriptCode;
        if (view.activeTab === 'script') {
          this.scriptEditor.getSession().setValue(scriptCode);
          return $.timeout(10, (function(_this) {
            return function() {
              var commandElements, lines;
              lines = $(_this.scriptEditor.container).find(".ace_line");
              commandElements = $(lines.slice(lines.length - commandLength - 2, lines.length - 2));
              commandElements.addClass('highlight');
              return $.timeout(1000, function() {
                return $(_this.scriptEditor.container).find(".ace_line").removeClass('highlight');
              });
            };
          })(this));
        }
      };

      Peanutty.prototype.searchObjectList = function(arg) {
        var foundObjects, limit, object, searchFunction;
        object = arg.object, searchFunction = arg.searchFunction, limit = arg.limit;
        foundObjects = [];
        while (object != null) {
          if (searchFunction(object)) {
            foundObjects.push(object);
          }
          if ((limit != null) && foundObjects.length >= limit) {
            return foundObjects;
          }
          object = object.GetNext();
        }
        return foundObjects;
      };

      Peanutty.prototype.sendCodeMessage = function(arg) {
        var closeLink, message;
        message = arg.message;
        $('.code_message').remove();
        this.codeMessage = $(document.createElement('DIV'));
        this.codeMessage.addClass('code_message');
        $(document.body).append(this.codeMessage);
        closeLink = $(document.createElement('A'));
        closeLink.addClass('close_link');
        closeLink.html('x');
        closeLink.bind('click', (function(_this) {
          return function() {
            return _this.codeMessage.removeClass('expanded');
          };
        })(this));
        this.codeMessage.append(closeLink);
        this.codeMessage.append(document.createElement('DIV'));
        message = message.replace(/\</g, '&lt;').replace(/\>/g, '&gt;');
        this.codeMessage.find('div').html(message);
        this.codeMessage.css({
          top: this.scriptEditor.container.offsetTop,
          right: $(document.body).width() - this.scriptEditor.container.offsetLeft + (parseInt($(document.body).css('paddingRight')) * 2)
        });
        return this.codeMessage.addClass('expanded');
      };

      Peanutty.prototype.setBodyDefPosition = function(arg) {
        var bodyDef, screenPosition, screenX, screenY, worldPosition;
        bodyDef = arg.bodyDef, screenX = arg.screenX, screenY = arg.screenY;
        screenPosition = new b2d.Common.Math.b2Vec2(screenX, screenY);
        worldPosition = this.screen.screenToWorld(screenPosition);
        bodyDef.position.x = worldPosition.x;
        return bodyDef.position.y = worldPosition.y;
      };

      Peanutty.prototype.createGround = function(options) {
        var bodyDef, fixDef;
        if (options == null) {
          options = {};
        }
        fixDef = fixDef = this.createFixtureDef();
        fixDef.drawData = options.drawData;
        fixDef.shape = new b2d.Collision.Shapes.b2PolygonShape;
        fixDef.shape.SetAsBox((options.width / this.screen.defaultScale) / 2, (options.height / this.screen.defaultScale) / 2);
        bodyDef = new b2d.Dynamics.b2BodyDef;
        bodyDef.type = b2d.Dynamics.b2Body.b2_staticBody;
        this.setBodyDefPosition({
          bodyDef: bodyDef,
          screenX: options.x,
          screenY: options.y
        });
        return this.world.CreateBody(bodyDef).CreateFixture(fixDef);
      };

      Peanutty.prototype.createBox = function(options) {
        var body, bodyDef, fixDef;
        if (options == null) {
          options = {};
        }
        options.x || (options.x = 0);
        options.y || (options.y = 0);
        options.width || (options.width = 20);
        options.height || (options.height = 20);
        bodyDef = new b2d.Dynamics.b2BodyDef;
        bodyDef.userData = options.userData;
        bodyDef.type = b2d.Dynamics.b2Body[options.fixed ? "b2_staticBody" : "b2_dynamicBody"];
        fixDef = this.createFixtureDef(options);
        fixDef.drawData = options.drawData;
        fixDef.shape = new b2d.Collision.Shapes.b2PolygonShape;
        fixDef.shape.SetAsBox(options.width / this.screen.defaultScale, options.height / this.screen.defaultScale);
        this.setBodyDefPosition({
          bodyDef: bodyDef,
          screenX: options.x,
          screenY: options.y
        });
        body = this.world.CreateBody(bodyDef);
        body.CreateFixture(fixDef);
        return body;
      };

      Peanutty.prototype.createBall = function(options) {
        var body, bodyDef, fixDef;
        if (options == null) {
          options = {};
        }
        options.x || (options.x = 0);
        options.y || (options.y = 0);
        options.radius || (options.radius = 20);
        bodyDef = new b2d.Dynamics.b2BodyDef;
        bodyDef.userData = options.userData;
        bodyDef.type = b2d.Dynamics.b2Body[options.fixed ? "b2_staticBody" : "b2_dynamicBody"];
        fixDef = this.createFixtureDef(options);
        fixDef.drawData = options.drawData;
        fixDef.shape = new b2d.Collision.Shapes.b2CircleShape;
        fixDef.shape.SetRadius(options.radius / this.screen.defaultScale);
        this.setBodyDefPosition({
          bodyDef: bodyDef,
          screenX: options.x,
          screenY: options.y
        });
        body = this.world.CreateBody(bodyDef);
        body.CreateFixture(fixDef);
        return body;
      };

      Peanutty.prototype.polyFixtureDef = function(arg) {
        var drawData, fixDef, path, point, scaledPath, userData;
        path = arg.path, drawData = arg.drawData, userData = arg.userData;
        fixDef = this.createFixtureDef({
          path: path,
          drawData: drawData,
          userData: userData
        });
        fixDef.userData = userData;
        fixDef.drawData = drawData;
        fixDef.shape = new b2d.Collision.Shapes.b2PolygonShape;
        if (this._counterClockWise(path)) {
          path = path.reverse();
        }
        scaledPath = (function() {
          var j, len, results;
          results = [];
          for (j = 0, len = path.length; j < len; j++) {
            point = path[j];
            results.push(this.screen.screenToWorld(point));
          }
          return results;
        }).call(this);
        fixDef.shape.SetAsArray(scaledPath, scaledPath.length);
        return fixDef;
      };

      Peanutty.prototype.createPoly = function(arg) {
        var body, bodyDef, drawData, fixed, fixtureDef, fixtureDefs, j, len, path, userData;
        fixtureDefs = arg.fixtureDefs, fixed = arg.fixed, path = arg.path, drawData = arg.drawData, userData = arg.userData;
        if (path != null) {
          fixtureDefs = [
            this.polyFixtureDef({
              path: path,
              drawData: drawData
            })
          ];
        }
        bodyDef = new b2d.Dynamics.b2BodyDef;
        bodyDef.userData = userData;
        bodyDef.type = b2d.Dynamics.b2Body[fixed ? "b2_staticBody" : "b2_dynamicBody"];
        body = this.world.CreateBody(bodyDef);
        for (j = 0, len = fixtureDefs.length; j < len; j++) {
          fixtureDef = fixtureDefs[j];
          if (fixtureDef.userData == null) {
            fixtureDef.userData = userData;
          }
          if (fixtureDef.drawData == null) {
            fixtureDef.drawData = drawData;
          }
          body.CreateFixture(fixtureDef);
        }
        bodyDef.position.x = body.GetWorldCenter().x;
        bodyDef.position.y = body.GetWorldCenter().y;
        return body;
      };

      Peanutty.prototype._counterClockWise = function(path) {
        var dir, index, j, len, nextPoint, point, rotation;
        rotation = [];
        for (index = j = 0, len = path.length; j < len; index = ++j) {
          point = path[index];
          nextPoint = path[index + 1];
          if (nextPoint == null) {
            nextPoint = path[0];
          }
          dir = this._direction(point, nextPoint);
          if ((dir != null) && rotation[rotation.length - 1] !== dir) {
            rotation.push(dir);
          }
          if (rotation.length === 2) {
            return rotation[0] > rotation[1] || rotation[0] - rotation[1] === 3;
          }
        }
      };

      Peanutty.prototype._direction = function(point, nextPoint) {
        var dir;
        if (point.y < nextPoint.y) {
          dir = 1;
        }
        if (point.y > nextPoint.y) {
          dir = 2;
        }
        if (point.x > nextPoint.x) {
          dir = (dir === 2 ? 3 : 4);
        }
        return dir;
      };

      Peanutty.prototype.createFixtureDef = function(options) {
        var fixDef;
        if (options == null) {
          options = {};
        }
        fixDef = new b2d.Dynamics.b2FixtureDef;
        fixDef.density = options.density || 1.0;
        fixDef.friction = options.friction || 0.5;
        fixDef.restitution = options.restitution || 0.2;
        return fixDef;
      };

      Peanutty.prototype.createRandomObjects = function() {
        var bodyDef, fixDef, i, j, results;
        fixDef = this.createFixtureDef();
        bodyDef = new b2d.Dynamics.b2BodyDef;
        bodyDef.type = b2d.Dynamics.b2Body.b2_dynamicBody;
        results = [];
        for (i = j = 0; j < 150; i = ++j) {
          if (Math.random() > 0.5) {
            fixDef.shape = new b2d.Collision.Shapes.b2PolygonShape;
            fixDef.shape.SetAsBox(Math.random() + 0.1, Math.random() + 0.1);
          } else {
            fixDef.shape = new b2d.Collision.Shapes.b2CircleShape(Math.random() + 0.1);
          }
          bodyDef.position.x = Math.random() * 25;
          bodyDef.position.y = Math.random() * 10;
          results.push(this.world.CreateBody(bodyDef).CreateFixture(fixDef));
        }
        return results;
      };

      Peanutty.prototype.currentShape = null;

      Peanutty.prototype.tempPoint = null;

      Peanutty.prototype.redrawCurrentShape = function() {
        var j, len, point, ref;
        if (!((this.currentShape != null) && (this.currentShape.path.length > 0 || (this.tempPoint != null)))) {
          return;
        }
        this.startFreeformShape(this.currentShape.start);
        ref = this.currentShape.path;
        for (j = 0, len = ref.length; j < len; j++) {
          point = ref[j];
          this.drawFreeformShape(point);
        }
        if (this.tempPoint != null) {
          this.drawFreeformShape(this.tempPoint);
        }
      };

      Peanutty.prototype.tempShapes = [];

      Peanutty.prototype.addTempShape = function(shape) {
        this.tempShapes.push(shape);
        return shape;
      };

      Peanutty.prototype.redrawTempShapes = function() {
        var index, j, k, len, len1, point, ref, ref1, shape;
        ref = this.tempShapes;
        for (j = 0, len = ref.length; j < len; j++) {
          shape = ref[j];
          if (shape instanceof Function) {
            shape();
          } else {
            this.startFreeformShape(shape.start);
            ref1 = shape.path;
            for (index = k = 0, len1 = ref1.length; k < len1; index = ++k) {
              point = ref1[index];
              this.drawFreeformShape(point);
            }
          }
        }
      };

      Peanutty.prototype.addToFreeformShape = function(arg) {
        var x, y;
        x = arg.x, y = arg.y;
        if (this.currentShape != null) {
          return this.continueFreeformShape({
            x: x,
            y: y
          });
        } else {
          return this.initFreeformShape({
            x: x,
            y: y
          });
        }
      };

      Peanutty.prototype.addTempToFreeformShape = function(arg) {
        var x, y;
        x = arg.x, y = arg.y;
        return this.tempPoint = new b2d.Common.Math.b2Vec2(x, y);
      };

      Peanutty.prototype.drawFreeformShape = function(arg) {
        var screenPoint, x, y;
        x = arg.x, y = arg.y;
        this.screen.getContext().lineWidth = 0.25;
        screenPoint = this.screen.screenToCanvas(new b2d.Common.Math.b2Vec2(x, y));
        this.screen.getContext().lineTo(screenPoint.x, screenPoint.y);
        return this.screen.getContext().stroke();
      };

      Peanutty.prototype.initFreeformShape = function(arg) {
        var point, x, y;
        x = arg.x, y = arg.y;
        point = new b2d.Common.Math.b2Vec2(x, y);
        this.currentShape = {
          start: point,
          path: [point]
        };
        return this.startFreeformShape({
          x: x,
          y: y
        });
      };

      Peanutty.prototype.startFreeformShape = function(arg) {
        var screenPoint, x, y;
        x = arg.x, y = arg.y;
        this.startShape();
        this.screen.getContext().strokeStyle = '#000000';
        screenPoint = this.screen.screenToCanvas(new b2d.Common.Math.b2Vec2(x, y));
        return this.screen.getContext().moveTo(screenPoint.x, screenPoint.y);
      };

      Peanutty.prototype.startShape = function() {
        this.screen.getContext().strokeStyle = '#ffffff';
        this.screen.getContext().fillStyle = "black";
        this.screen.getContext().beginPath();
      };

      Peanutty.prototype.continueFreeformShape = function(arg) {
        var x, y;
        x = arg.x, y = arg.y;
        if (this.currentShape == null) {
          return;
        }
        this.tempPoint = null;
        this.currentShape.path.push(new b2d.Common.Math.b2Vec2(x, y));
      };

      Peanutty.prototype.endFreeformShape = function(options) {
        var path, point;
        if (options == null) {
          options = {};
        }
        path = (function() {
          var j, len, ref, ref1, results;
          ref1 = this.currentShape.path;
          ref = Math.ceil(this.currentShape.path.length / 10);
          results = [];
          for ((ref > 0 ? (j = 0, len = ref1.length) : j = ref1.length - 1); ref > 0 ? j < len : j >= 0; j += ref) {
            point = ref1[j];
            results.push("{x: " + point.x + ", y: " + point.y + "}");
          }
          return results;
        }).call(this);
        this.addToScript({
          command: "peanutty.createPoly\n    path: [" + path + "]\n    fixed: " + options.fixed,
          time: options.time
        });
        this.endShape();
        this.tempPoint = null;
        return this.currentShape = null;
      };

      Peanutty.prototype.getFreeformShape = function() {
        if (this.currentShape != null) {
          return this.currentShape.path;
        } else {
          return [];
        }
      };

      Peanutty.prototype.endShape = function() {
        this.screen.getContext().fill();
        this.screen.getContext().stroke();
      };

      Peanutty.prototype.sign = function(name, twitterHandle) {
        var signature, signatureLink;
        if (twitterHandle == null) {
          twitterHandle = '';
        }
        signature = level.elements.signature = $(document.createElement("DIV"));
        signature.addClass('signature');
        signature.html('This level created by: ');
        signatureLink = $(document.createElement("A"));
        signatureLink.html(name);
        signatureLink.attr('href', "http://twitter.com/#" + twitterHandle);
        signatureLink.attr('target', '_blank');
        signature.append(signatureLink);
        return $(this.canvas[0].parentNode).append(signature);
      };

      Peanutty.prototype.destroyDynamicObjects = function() {
        var b, body;
        body = this.world.m_bodyList;
        while (body != null) {
          b = body;
          body = body.m_next;
          if (b.m_type === b2d.Dynamics.b2Body.b2_dynamicBody) {
            this.world.DestroyBody(b);
          }
        }
        return this.tempShapes = [];
      };

      Peanutty.prototype.destroyWorld = function() {
        var b, body, error;
        try {
          body = this.world.m_bodyList;
          while (body != null) {
            b = body;
            body = body.m_next;
            this.world.DestroyBody(b);
          }
          this.tempShapes = [];
          this.removeContactListeners();
          return this.world = null;
        } catch (_error) {
          error = _error;
        }
      };

      return Peanutty;

    })();
    Peanutty.executingCode = [];
    Peanutty.runCode = (function(_this) {
      return function(code) {
        var active, catchCode, catches, complete, error, indent, index, j, len, segment, segments, tab, time;
        complete = [];
        complete = ["try"];
        active = [];
        tab = "    ";
        indent = "";
        catchCode = function() {
          return "catch error\n" + indent + tab + "Peanutty.sendCodeMessage(message: 'Code Error: ' + error.message)\n" + indent + tab + "throw error";
        };
        catches = [catchCode()];
        indent = tab;
        segments = code.split(/\n/);
        for (index = j = 0, len = segments.length; j < len; index = ++j) {
          segment = segments[index];
          if (segment.indexOf("peanutty.wait") > -1) {
            complete.push(active.join("\n"));
            active = [];
            if (index < segments.length - 1) {
              time = parseInt(segment.replace(/peanutty.wait\(/, "").replace(/\)/, ""));
              complete.push(indent + ("Peanutty.executingCode.push $.timeout " + time + ", () =>\n"));
              indent += tab;
              complete.push(indent + "try\n");
              catches.push(indent + catchCode());
              indent += tab;
            }
          } else {
            active.push(indent + segment);
          }
        }
        complete.push(active.join("\n"));
        complete.push(catches.reverse().join("\n"));
        try {
          return CoffeeScript.run(complete.join("\n"));
        } catch (_error) {
          error = _error;
          Peanutty.sendCodeMessage({
            message: 'Code Error: ' + error.message.replace(/on line \d+/, '')
          });
          throw error;
        }
      };
    })(this);
    Peanutty.sendCodeMessage = (function(_this) {
      return function(arg) {
        var message;
        message = arg.message;
        if (window.peanutty != null) {
          return peanutty.sendCodeMessage({
            message: message
          });
        } else {
          return alert(message);
        }
      };
    })(this);
    Peanutty.runScript = (function(_this) {
      return function(scriptCode) {
        if (scriptCode == null) {
          scriptCode = view.getScriptCode();
        }
        return Peanutty.runCode(scriptCode);
      };
    })(this);
    Peanutty.loadLevel = (function(_this) {
      return function(levelCode) {
        if (levelCode == null) {
          levelCode = view.getLevelCode();
        }
        return Peanutty.runCode(levelCode);
      };
    })(this);
    Peanutty.createEnvironment = (function(_this) {
      return function(environmentCode) {
        if (environmentCode == null) {
          environmentCode = view.getEnvironmentCode();
        }
        return Peanutty.runCode(environmentCode);
      };
    })(this);
    Peanutty.b2d = b2d;
    return provide('Peanutty', Peanutty);
  })(ender);

}).call(this);
