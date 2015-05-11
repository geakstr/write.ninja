// This file was automatically generated from "app.lmd.json"
(function (global, main, modules, modules_options, options) {
    var initialized_modules = {},
        global_eval = function (code) {
            return global.Function('return ' + code)();
        },
        
        global_document = global.document,
        local_undefined,
        /**
         * @param {String} moduleName module name or path to file
         * @param {*}      module module content
         *
         * @returns {*}
         */
        register_module = function (moduleName, module) {
            lmd_trigger('lmd-register:before-register', moduleName, module);
            // Predefine in case of recursive require
            var output = {'exports': {}};
            initialized_modules[moduleName] = 1;
            modules[moduleName] = output.exports;

            if (!module) {
                // if undefined - try to pick up module from globals (like jQuery)
                // or load modules from nodejs/worker environment
                module = lmd_trigger('js:request-environment-module', moduleName, module)[1] || global[moduleName];
            } else if (typeof module === 'function') {
                // Ex-Lazy LMD module or unpacked module ("pack": false)
                var module_require = lmd_trigger('lmd-register:decorate-require', moduleName, lmd_require)[1];

                // Make sure that sandboxed modules cant require
                if (modules_options[moduleName] &&
                    modules_options[moduleName].sandbox &&
                    typeof module_require === 'function') {

                    module_require = local_undefined;
                }

                module = module(module_require, output.exports, output) || output.exports;
            }

            module = lmd_trigger('lmd-register:after-register', moduleName, module)[1];
            return modules[moduleName] = module;
        },
        /**
         * List of All lmd Events
         *
         * @important Do not rename it!
         */
        lmd_events = {},
        /**
         * LMD event trigger function
         *
         * @important Do not rename it!
         */
        lmd_trigger = function (event, data, data2, data3) {
            var list = lmd_events[event],
                result;

            if (list) {
                for (var i = 0, c = list.length; i < c; i++) {
                    result = list[i](data, data2, data3) || result;
                    if (result) {
                        // enable decoration
                        data = result[0] || data;
                        data2 = result[1] || data2;
                        data3 = result[2] || data3;
                    }
                }
            }
            return result || [data, data2, data3];
        },
        /**
         * LMD event register function
         *
         * @important Do not rename it!
         */
        lmd_on = function (event, callback) {
            if (!lmd_events[event]) {
                lmd_events[event] = [];
            }
            lmd_events[event].push(callback);
        },
        /**
         * @param {String} moduleName module name or path to file
         *
         * @returns {*}
         */
        lmd_require = function (moduleName) {
            var module = modules[moduleName];

            var replacement = lmd_trigger('*:rewrite-shortcut', moduleName, module);
            if (replacement) {
                moduleName = replacement[0];
                module = replacement[1];
            }

            lmd_trigger('*:before-check', moduleName, module);
            // Already inited - return as is
            if (initialized_modules[moduleName] && module) {
                return module;
            }

            lmd_trigger('*:before-init', moduleName, module);

            // Lazy LMD module not a string
            if (typeof module === 'string' && module.indexOf('(function(') === 0) {
                module = global_eval(module);
            }

            return register_module(moduleName, module);
        },
        output = {'exports': {}},

        /**
         * Sandbox object for plugins
         *
         * @important Do not rename it!
         */
        sandbox = {
            'global': global,
            'modules': modules,
            'modules_options': modules_options,
            'options': options,

            'eval': global_eval,
            'register': register_module,
            'require': lmd_require,
            'initialized': initialized_modules,

            
            'document': global_document,
            
            

            'on': lmd_on,
            'trigger': lmd_trigger,
            'undefined': local_undefined
        };

    for (var moduleName in modules) {
        // reset module init flag in case of overwriting
        initialized_modules[moduleName] = 0;
    }

/**
 * @name sandbox
 */
(function (sb) {

// Simple JSON stringify
function stringify(object) {
    var properties = [];
    for (var key in object) {
        if (object.hasOwnProperty(key)) {
            properties.push(quote(key) + ':' + getValue(object[key]));
        }
    }
    return "{" + properties.join(",") + "}";
}

function getValue(value) {
    if (typeof value === "string") {
        return quote(value);
    } else if (typeof value === "boolean") {
        return "" + value;
    } else if (value.join) {
        if (value.length == 0) {
            return "[]";
        } else {
            var flat = [];
            for (var i = 0, len = value.length; i < len; i += 1) {
                flat.push(getValue(value[i]));
            }
            return '[' + flat.join(",") + ']';
        }
    } else if (typeof value === "number") {
        return value;
    } else {
        return stringify(value);
    }
}

function pad(s) {
    return '0000'.substr(s.length) + s;
}

function replacer(c) {
    switch (c) {
        case '\b': return '\\b';
        case '\f': return '\\f';
        case '\n': return '\\n';
        case '\r': return '\\r';
        case '\t': return '\\t';
        case '"': return '\\"';
        case '\\': return '\\\\';
        default: return '\\u' + pad(c.charCodeAt(0).toString(16));
    }
}

function quote(s) {
    return '"' + s.replace(/[\u0000-\u001f"\\\u007f-\uffff]/g, replacer) + '"';
}

function indexOf(item) {
    for (var i = this.length; i --> 0;) {
        if (this[i] === item) {
            return i;
        }
    }
    return -1;
}

    /**
     * @event *:request-json requests JSON polifill with only stringify function!
     *
     * @param {Object|undefined} JSON default JSON value
     *
     * @retuns yes
     */
sb.on('*:request-json', function (JSON) {
    if (typeof JSON === "object") {
        return [JSON];
    }

    return [{stringify: stringify}];
});

    /**
     * @event *:request-indexof requests indexOf polifill
     *
     * @param {Function|undefined} arrayIndexOf default indexOf value
     *
     * @retuns yes
     */
sb.on('*:request-indexof', function (arrayIndexOf) {
    if (typeof arrayIndexOf === "function") {
        return [arrayIndexOf];
    }

    return [indexOf];
});

}(sandbox));

/**
 * This plugin enables shortcuts
 *
 * Flag "shortcuts"
 *
 * This plugin provides private "is_shortcut" function
 */

/**
 * @name sandbox
 */
(function (sb) {

function is_shortcut(moduleName, moduleContent) {
    return !sb.initialized[moduleName] &&
           typeof moduleContent === "string" &&
           moduleContent.charAt(0) == '@';
}

function rewrite_shortcut(moduleName, module) {
    if (is_shortcut(moduleName, module)) {
        sb.trigger('shortcuts:before-resolve', moduleName, module);

        moduleName = module.replace('@', '');
        // #66 Shortcut self reference should be resolved as undefined->global name
        var newModule = sb.modules[moduleName];
        module = newModule === module ? sb.undefined : newModule;
    }
    return [moduleName, module];
}

    /**
     * @event *:rewrite-shortcut request for shortcut rewrite
     *
     * @param {String} moduleName race for module name
     * @param {String} module     this callback will be called when module inited
     *
     * @retuns yes returns modified moduleName and module itself
     */
sb.on('*:rewrite-shortcut', rewrite_shortcut);

    /**
     * @event *:rewrite-shortcut fires before stats plugin counts require same as *:rewrite-shortcut
     *        but without triggering shortcuts:before-resolve event
     *
     * @param {String} moduleName race for module name
     * @param {String} module     this callback will be called when module inited
     *
     * @retuns yes returns modified moduleName and module itself
     */
sb.on('stats:before-require-count', function (moduleName, module) {
    if (is_shortcut(moduleName, module)) {
        moduleName = module.replace('@', '');
        module = sb.modules[moduleName];

        return [moduleName, module];
    }
});

}(sandbox));



    main(lmd_trigger('lmd-register:decorate-require', 'main', lmd_require)[1], output.exports, output);
})/*DO NOT ADD ; !*/
(this,(function (require, exports, module) { /* wrapped by builder */
$(document).ready(function() {
  var $ = require('jquery');
  var Utils = require('./Utils');
  var Selection = require('./Selection');
  var Editor = require('./Editor');
  var Block = require('./Block');

  var editor = new Editor();

  editor.pushBlock('- Это            первая строка');
  editor.pushBlock().pushBlock();
  editor.pushBlock('Это вторая строка');

  editor.insertBlock(1, 'Вставка');

  // editor.removeBlocks([0, 3]);
});
}),{
"./Block": (function (require, exports, module) { /* wrapped by builder */
var $ = require('jquery');

var Block = (function() {
  function Block(text) {
    this._idx = 0;
    this._text = text;
    this._type = this.detectType(text);
    this._dom = this.format();
  }

  Object.defineProperty(Block.prototype, 'idx', {
    get: function() {
      return this._idx;
    },
    set: function(idx) {
      this._idx = idx;
      this._dom.attr('data-idx', idx);
    },
    enumerable: true
  });

  Object.defineProperty(Block.prototype, 'text', {
    get: function() {
      return this._text;
    },
    set: function(text) {
      this._text = text;
      var newType = this.detectType(text);

      if (this.type !== newType) {
        this.dom.removeClass('-' + this.type);

        this.type = newType;
        this.dom.addClass('-' + this.type);
      }

      if (this.type === 'empty') {
        this._dom.html('<br />');
      } else {
        this._dom.text(text);
      }
    },
    enumerable: true
  });

  Object.defineProperty(Block.prototype, 'type', {
    get: function() {
      return this._type;
    },
    set: function(type) {
      this._type = type;
    },
    enumerable: true
  });

  Object.defineProperty(Block.prototype, 'dom', {
    get: function() {
      return this._dom;
    },
    set: function(dom) {
      this._dom = dom;
    },
    enumerable: true
  });

  Block.prototype.syncModel = function blockSyncModel() {
    this.text = this.dom.text();
  };

  Block.prototype.detectType = function blockDetectType(text) {
    var trimmedText = text.trim();

    var type = 'note';
    if (trimmedText.length === 0) {
      type = 'empty';
    } else if (trimmedText[0] === '-' || trimmedText[0] === '—') {
      type = 'task';
    }

    return type;
  };

  Block.prototype.format = function blockFormat() {
    var el = $(document.createElement('p'));

    el.addClass('edtr-blck');
    el.addClass('-' + this.type);
    el.prop('data-idx', this.idx);

    var text = this.text;
    if (text.length === 0) {
      text = '<br/>';
    }
    el.html(text);

    return el;
  };

  return Block;
})();

module.exports = Block;
}),
"./Editor": (function (require, exports, module) { /* wrapped by builder */
var Selection = require('./Selection');
var Block = require('./Block');

var Editor = (function() {
  function Editor() {
    this._dom = $('#editor');
    this._dom.attr('spellcheck', false);
    this._model = [];

    this._wasKeypress = false;

    this._eventsHandlers();
  }

  Editor.prototype.pushBlock = function editorPushBlock(block) {
    if (typeof block === 'string') {
      block = new Block(block);
    } else if (typeof block === 'undefined') {
      block = new Block('');
    }

    block.idx = this._model.length;
    this._push(block);

    return this;
  };

  Editor.prototype.insertBlock = function editorInsertBlock(idx, block) {
    if (typeof block === 'string') {
      block = new Block(block);
    } else if (typeof block === 'undefined') {
      block = new Block('');
    }

    block.idx = idx;
    this._splice(idx, 0, block);
    this._updateBlockIndicesFrom(idx + 1);

    return this;
  };

  Editor.prototype.removeBlock = function editorRemoveBlock(idx) {
    this._splice(idx, 1);
    this._updateBlockIndicesFrom(idx);
    return this;
  };

  Editor.prototype.removeBlocksRange = function editorRemoveBlocksRange(from, to) {
    this._splice(from, to - from + 1);
    this._updateBlockIndicesFrom(from);

    return this;
  };

  Editor.prototype.removeBlocks = function editorRemoveBlocks(indices) {
    indices.sort(function(a, b) {
      return a - b;
    });

    var from = indices[0];
    var subtractor = 0;

    if (indices.length === 2 && indices[1] - 1 === from) {
      this._splice(from, indices[1] - from + 1);
    } else {
      indices.forEach(function(el, idx) {
        this._splice(el - subtractor++, 1);
      }.bind(this));
    }

    this._updateBlockIndicesFrom(from);

    return this;
  };

  Editor.prototype.insertText = function editorInsertText(sel, newText) {
    var isCarriageReturn = (typeof newText === 'undefined');

    sel.leftText = sel.leftText.substring(0, sel.startPos);
    sel.rightText = sel.rightText.substring(sel.endPos);

    sel.startBlock.text = sel.leftText;
    if (!isCarriageReturn) {
      sel.startBlock.text += newText + sel.rightText;
    }

    if (sel.isRange) {
      this.removeBlocksRange(sel.startIdx + 1, sel.endIdx);
    }

    if (isCarriageReturn) {
      this.insertBlock(sel.startIdx + 1, sel.rightText);
    }

    return sel;
  };

  Editor.prototype.removeText = function editorRemoveText(sel, keyCode) {
    if (typeof keyCode === 'undefined') keyCode = 8;

    var backspaceOffset = (keyCode === 8) ? -1 : 0;
    var deleteOffset = (keyCode === 46) ? 1 : 0;

    var caretInfo = {
      idx: sel.startIdx,
      pos: sel.startPos
    };

    if (sel.isCaret && keyCode === 8 && sel.startPos === 0) {
      if (sel.startIdx === 0) {
        return caretInfo;
      }

      sel.startBlock = this._model[--sel.startIdx];
      sel.leftText = sel.startBlock.text;

      backspaceOffset = 0;

      caretInfo.idx = sel.startIdx;
      caretInfo.pos = sel.leftText.length;

      this.removeBlock(sel.endIdx);
    } else if (sel.isCaret && keyCode === 46 && sel.rightText.length === sel.endPos) {
      if (sel.endIdx === this._model.length - 1) {
        return caretInfo;
      }

      sel.rightText = this._model[++sel.endIdx].text;

      this.removeBlock(sel.endIdx);
    } else {
      if (sel.isRange) {
        backspaceOffset = 0;
        deleteOffset = 0;

        this.removeBlocksRange(sel.startIdx + 1, sel.endIdx);
      }
      sel.leftText = sel.leftText.substring(0, sel.startPos + backspaceOffset);
      sel.rightText = sel.rightText.substring(sel.endPos + deleteOffset);
    }

    sel.startBlock.text = sel.leftText + sel.rightText;

    caretInfo.pos += backspaceOffset;

    return caretInfo;
  };

  Editor.prototype._updateBlockIndicesFrom = function _editorUpdateBlockIndicesFrom(from) {
    for (var i = from; i < this._model.length; i++) {
      this._model[i].idx = i;
    }
  };

  Editor.prototype._updateBlockIndices = function _editorUpdateBlockIndices() {
    this._updateBlockIndicesFrom(0);
  };

  Editor.prototype._splice = function _editorSplice(idx, n, block) {
    var removed = [];
    if (typeof block === 'undefined') {
      removed = this._model.splice(idx, n);
      removed.forEach(function(removedBlock) {
        removedBlock.dom.remove();
      });
    } else {
      this._model.splice(idx, n, block);
      this._dom.insertAt(idx, block.dom);
    }
    return removed;
  };

  Editor.prototype._push = function _editorOush(block) {
    this._model.push(block);
    this._dom.append(block.dom);
  };

  Editor.prototype._onkeydown = function _editorOnkeydown(event) {
    var keyCode = event.keyCode;
    var keyChar = String.fromCharCode(keyCode).toLowerCase();

    this._wasKeypress = [37, 38, 39, 40].indexOf(event.keyCode) === -1;
    if (this._wasKeypress) {
      this._wasKeypress = !event.metaKey;
    }
    if (!this._wasKeypress) {
      return true;
    }

    var sel = Selection.getInfo(this._model);
    if (sel === null) {
      return true;
    }

    // Carriage return
    if (keyCode === 13 || (keyChar === 'm' && event.ctrlKey)) {
      event.preventDefault();

      var sel = this.insertText(sel);
      Selection.setCaret(this._model[sel.startIdx + 1].dom[0], 0);

      if (sel.startIdx !== 0) {
        this._model[sel.startIdx].syncModel();
      }

      this._wasKeypress = false;

      return false;
    } else if (keyCode === 8 || keyCode === 46) { // Backspace
      event.preventDefault();

      var caretInfo = this.removeText(sel, keyCode);
      Selection.setCaret(this._model[caretInfo.idx].dom[0], caretInfo.pos);

      this._wasKeypress = false;

      return false;
    }
  };

  Editor.prototype._onkeyup = function _editorOnkeyup(event) {
    var sel = Selection.getInfo(this._model);

    if (sel !== null && this._wasKeypress) {
      this._model[sel.startIdx].syncModel();
      if (sel.startIdx !== sel.endIdx) {
        this._model[sel.endIdx].syncModel();
      }
      Selection.setCaret(this._model[sel.endIdx].dom[0], sel.endPos);
    }

    return true;
  };

  Editor.prototype._eventsHandlers = function _editorEventsHandlers() {
    this._dom.on({
      keydown: this._onkeydown.bind(this),
      keyup: this._onkeyup.bind(this)
    });
  };

  return Editor;
})();

module.exports = Editor;
}),
"./Selection": (function (require, exports, module) { /* wrapped by builder */
var Selection = (function() {
  function Selection() {}

  Selection.getInfo = function selectionGetInfo(model) {
    var sel = window.getSelection();
    if (sel.anchorNode === null && sel.focusNode === null) {
      return null;
    }

    var $anchorNode = $(sel.anchorNode);
    var $focusNode = $(sel.focusNode);

    if ($anchorNode.hasClass('edtr-blck') === false) {
      $anchorNode = $anchorNode.parents('.edtr-blck');
    }
    if ($focusNode.hasClass('edtr-blck') === false) {
      $focusNode = $focusNode.parents('.edtr-blck');
    }

    var startIdx = $anchorNode.attr('data-idx');
    var endIdx = $focusNode.attr('data-idx');

    if (isNaN(startIdx) || isNaN(endIdx)) {
      return null;
    }

    if (startIdx > endIdx) {
      var tmpStartIdx = startIdx;
      startIdx = endIdx;
      endIdx = tmpStartIdx;

      var $tmpAnchorNode = $anchorNode;
      $anchorNode = $focusNode;
      $focusNode = $tmpAnchorNode;
    }

    var startPos = this.getPos($anchorNode[0]).start;
    var endPos = this.getPos($focusNode[0]).end;

    var startBlock = model[startIdx];
    var endBlock = model[endIdx];

    var leftText = startBlock.text;
    var rightText = endBlock.text;

    var isCaret = startIdx === endIdx && startPos === endPos;
    var isRange = !isCaret;

    return {
      isCaret: isCaret,
      isRange: isRange,
      startPos: +startPos,
      endPos: +endPos,
      startIdx: +startIdx,
      endIdx: +endIdx,
      startBlock: startBlock,
      endBlock: endBlock,
      leftText: leftText,
      rightText: rightText
    }
  };

  Selection.getPos = function selectionSetPos(el) {
    var sel = el.ownerDocument.defaultView.getSelection();
    var start = 0;
    var end = 0;

    if (sel.rangeCount > 0) {
      var range = sel.getRangeAt(0);
      var cloneRange = range.cloneRange();

      cloneRange.selectNodeContents(el);
      cloneRange.setStart(range.startContainer, range.startOffset);
      start = el.textContent.length - cloneRange.toString().length;

      cloneRange = range.cloneRange();
      cloneRange.selectNodeContents(el);
      cloneRange.setEnd(range.endContainer, range.endOffset);
      end = cloneRange.toString().length;
    }

    return {
      start: start,
      end: end
    };
  };

  Selection.setCaret = function selectionSetCaret(node, offset) {
    var sel = window.getSelection();

    var tw = document.createTreeWalker(node, NodeFilter.SHOW_TEXT, null, null);
    var range = document.createRange();
    var curNode = null;
    var curOffset = 0;
    var wasRngSet = false;

    while (curNode = tw.nextNode()) {
      curOffset += curNode.nodeValue.length;
      if (curOffset >= offset) {
        offset = curNode.nodeValue.length + offset - curOffset;
        range.setStart(curNode, offset);
        range.setEnd(curNode, offset);
        wasRngSet = true;
        break;
      }
    }

    if (!wasRngSet) {
      range.selectNodeContents(node);
      range.collapse(false);
    }

    sel.removeAllRanges();
    sel.addRange(range);
  }

  Selection.toString = function toString(model) {
    var selInfo = this.getInfo(model);

    var ret = selInfo.isCaret + ' ' + selInfo.startIdx + ' ';
    ret += selInfo.endIdx + ' ' + selInfo.startPos + ' ' + selInfo.endPos;
    return ret;
  }

  return Selection;
})();

module.exports = Selection;
}),
"./Utils": (function (require, exports, module) { /* wrapped by builder */
var $ = require('jquery');

var Utils = (function() {
  function Utils() {}

  $.fn.insertAt = function(index, elements) {
    var children = this.children();
    if (index >= children.size()) {
      this.append(elements);
      return this;
    }
    var before = children.eq(index);
    $(elements).insertBefore(before);
    return this;
  };

  return Utils;
})();

module.exports = Utils;
}),
"jquery": "@jQuery"
},{},{});
