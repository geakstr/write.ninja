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
jQuery.fn.insertAt = function(index, element) {
  var lastIndex = this.children().size()
  if (index < 0) {
    index = Math.max(0, lastIndex + 1 + index)
  }
  this.append(element)
  if (index < lastIndex) {
    this.children().eq(index).before(this.children().last())
  }
  return this;
}

$(document).ready(function() {
  var $ = require('jquery'),
    Selection = require('./Selection'),
    Editor = require('./Editor'),
    Block = require('./Block');

  var editor = new Editor();

  editor.push_block('Это первая строка');
  editor.push_block();
  editor.push_block();
  editor.push_block('Это вторая строка');

  editor.insert_block(2, 'Вставка');

  editor.remove_blocks_range(3, 4);
});
}),{
"./Block": (function (require, exports, module) { /* wrapped by builder */
var $ = require('jquery'),
  Editor = require('./Editor');

var Block = (function() {
  function Block(text) {
    this._idx = 0;
    this._text = text;
    this._type = this.detect_type(text);
    this._dom = $(this.format());
  }

  Object.defineProperty(Block.prototype, 'idx', {
    get: function() {
      return this._idx;
    },
    set: function(idx) {
      this._idx = idx;
      this._dom = $(this.format());
    },
    enumerable: true
  });

  Object.defineProperty(Block.prototype, 'text', {
    get: function() {
      return this._text;
    },
    set: function(text) {
      this._text = text;
      this._dom = $(this.format());
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

  Block.prototype.detect_type = function(text) {
    text = text.trim();

    var type = 'note';
    if (text.length === 0) type = 'empty';
    else if (text[0] === '-') type = 'task';

    return type;
  };

  Block.prototype.format = function block_format() {
    var css = Editor.tag,
      attr = 'class="' + css + '" data-idx="' + this._idx + '"';

    return '<p ' + attr + '>' + this._text + '</p>';
  };


  return Block;
})();

module.exports = Block;
}),
"./Editor": (function (require, exports, module) { /* wrapped by builder */
var Selection = require('./Selection'),
  Block = require('./Block');

var Editor = (function() {
  function Editor() {
    this._$el = $('#editor');

    this._dom = [];
    this._model = [];

    this._events_handlers();
  }

  Editor.tag = "edtr-blck";

  Editor.prototype.push_block = function editor_push_block(block) {
    if (typeof block === 'string') {
      block = new Block(block);
    } else if (typeof block === 'undefined') {
      block = new Block('');
    }

    block.idx = this._model.length;
    this._push(block);
  };

  Editor.prototype.insert_block = function editor_insert_block(idx, block) {
    if (typeof block === 'string') {
      block = new Block(block);
    } else if (typeof block === 'undefined') {
      block = new Block('');
    }

    block.idx = idx;
    this._splice(idx, 0, block);
    this._update_block_indices_from(idx + 1);
  };

  Editor.prototype.remove_block = function editor_remove_block(idx) {
    this._splice(idx, 1);
    this._update_block_indices_from(idx);
  };

  Editor.prototype.remove_blocks_range = function editor_remove_blocks_range(from, to) {
    this._splice(from, to - from + 1);
    this._update_block_indices_from(from);
  };

  Editor.prototype.remove_blocks = function editor_remove_blocks(indices) {
    indices.sort(function(a, b) {
      return a - b;
    });

    var from = indices[0],
      subtractor = 0;

    if (indices.length === 2 && indices[1] - 1 === from) {
      this._splice(from, indices[1] - from + 1);
    } else {
      indices.forEach(function(el, idx) {
        this._splice(el - subtractor++, 1);
      }.bind(this));
    }

    this._update_block_indices_from(from);
  };

  Editor.prototype._update_block_indices_from = function _editor_update_block_indices_from(from) {
    for (var i = from; i < this._model.length; i++) {
      this._model[i].idx = i;
      this._dom[i].attr('data-idx', i);
    }
  };

  Editor.prototype._update_block_indices = function _editor_update_block_indices() {
    this._update_block_indices_from(0);
  };

  Editor.prototype._splice = function _editor_splice(idx, n, block) {
    var removed_dom = [];
    if (typeof block === 'undefined') {
      this._model.splice(idx, n);
      removed_dom = this._dom.splice(idx, n);
      removed_dom.forEach(function(element) {
        element.remove();
      });
    } else {
      this._model.splice(idx, n, block);
      this._dom.splice(idx, n, block.dom);
      this._$el.insertAt(idx, block.dom);
    }
    return removed_dom;
  };

  Editor.prototype._push = function _editor_push(block) {
    this._model.push(block);
    this._dom.push(block.dom);
    this._$el.append(block.dom);
  };

  Editor.prototype._onmouseup = function _editor_onmouseup() {
    var sel_info = Selection.get_info();
    console.log(Selection.toString());
  };

  Editor.prototype._events_handlers = function _editor_events_handlers() {
    this._$el.on({
      mouseup: this._onmouseup
    });
  };

  return Editor;
})();

module.exports = Editor;
}),
"./Selection": (function (require, exports, module) { /* wrapped by builder */
var Selection = (function() {
  function Selection() {}

  Selection.get_info = function selection_get_info() {
    var sel = window.getSelection();
    if (sel.anchorNode === null && sel.focusNode === null) return null;

    var $anchor_node = $(sel.anchorNode),
      $focus_node = $(sel.focusNode);

    if ($anchor_node.hasClass('edtr-blck') === false) {
      $anchor_node = $anchor_node.parents('.edtr-blck');
    }
    if ($focus_node.hasClass('edtr-blck') === false) {
      $focus_node = $focus_node.parents('.edtr-blck');
    }

    var start_idx = $anchor_node.attr('data-idx'),
      end_idx = $focus_node.attr('data-idx');

    if (isNaN(start_idx) || isNaN(end_idx)) return null;

    if (start_idx > end_idx) {
      var tmp_start_idx = start_idx;
      start_idx = end_idx;
      end_idx = tmp_start_idx;

      var $tmp_anchor_node = $anchor_node;
      $anchor_node = $focus_node;
      $focus_node = $tmp_anchor_node;
    }

    var start_pos = this.get_pos($anchor_node[0]).start,
      end_pos = this.get_pos($focus_node[0]).end,
      is_caret = start_idx === end_idx && start_pos === end_pos,
      is_range = !is_caret;

    return {
      is_caret: is_caret,
      start_idx: start_idx,
      end_idx: end_idx,
      start_pos: start_pos,
      end_pos: end_pos
    }
  };

  Selection.get_pos = function selection_get_pos(el) {
    var sel = el.ownerDocument.defaultView.getSelection(),
      start = 0,
      end = 0;

    if (sel.rangeCount > 0) {
      var range = sel.getRangeAt(0),
        clone_range = range.cloneRange();

      clone_range.selectNodeContents(el);
      clone_range.setStart(range.startContainer, range.startOffset);
      start = el.textContent.length - clone_range.toString().length;

      clone_range = range.cloneRange();
      clone_range.selectNodeContents(el);
      clone_range.setEnd(range.endContainer, range.endOffset);
      end = clone_range.toString().length;
    }

    return {
      start: start,
      end: end
    };
  };

  Selection.set_caret = function selection_set_caret(node, offset) {
    var sel = window.getSelection();

    var tw = document.createTreeWalker(node, NodeFilter.SHOW_TEXT, null, null),
      range = document.createRange(),
      cur_node = null,
      cur_offset = 0,
      was_rng_set = false;

    while (cur_node = tw.nextNode()) {
      cur_offset += cur_node.nodeValue.length;
      if (cur_offset >= offset) {
        offset = cur_node.nodeValue.length + offset - cur_offset;
        range.setStart(cur_node, offset);
        range.setEnd(cur_node, offset);
        was_rng_set = true;
        break;
      }
    }

    if (!was_rng_set) {
      range.selectNodeContents(node);
      range.collapse(false);
    }

    sel.removeAllRanges();
    sel.addRange(range);
  }

  Selection.toString = function toString() {
    var sel_info = this.get_info();
    return sel_info.is_caret + " " + sel_info.start_idx + " " +
      sel_info.end_idx + " " + sel_info.start_pos + " " + sel_info.end_pos;
  }

  return Selection;
})();

module.exports = Selection;
}),
"jquery": "@jQuery"
},{},{});
