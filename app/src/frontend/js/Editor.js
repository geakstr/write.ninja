var Selection = require('./Selection');
var Block = require('./Block');

var Editor = (function() {
  function Editor() {
    this._dom = $('#editor');
    this._model = [];

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

  Editor.prototype._onmouseup = function _editorOnmouseup() {
    var selInfo = Selection.getInfo();
    console.log(Selection.toString());
  };

  Editor.prototype._eventsHandlers = function _editorEventsHandlers() {
    this._dom.on({
      mouseup: this._onmouseup
    });
  };

  return Editor;
})();

module.exports = Editor;