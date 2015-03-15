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