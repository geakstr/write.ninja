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
      return false;
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

  Editor.prototype._onpaste = function _editorOnpaste(event) {
    event.preventDefault();

    var sel = Selection.getInfo(this._model);
    if (sel === null) {
      return false;
    }

    var pasted = event.originalEvent.clipboardData.getData('text/plain');
    var blocks = pasted.split('\n');
    var blocksLen = blocks.length;
    var offset = sel.startPos + pasted.length;

    if (blocksLen === 0) {
      return false;
    } else if (blocksLen === 1) {
      this.insertText(sel, blocks[0]);
    } else {
      if (sel.isCaret && sel.startPos === 0 && sel.startIdx === 0) {
        for (var i = 0; i < blocksLen - 1; i++) {
          this.insertBlock(sel.startIdx++, blocks[i]);
        }

        this.insertText(sel, blocks[blocksLen - 1]);
      } else if (sel.isCaret && sel.endPos === sel.rightText.length && sel.endIdx === this._model.length - 1) {
        this.insertText(sel, blocks[0]);

        for (var i = 1; i < blocksLen; i++) {
          this.insertBlock(++sel.startIdx, blocks[i]);
        }
      } else {
        sel.leftText = sel.leftText.substring(0, sel.startPos);
        sel.rightText = sel.rightText.substring(sel.endPos);

        sel.startBlock.text = sel.leftText + blocks[0];

        if (sel.isRange) {
          this.removeBlocksRange(sel.startIdx + 1, sel.endIdx);
        }

        for (var i = 1; i < blocksLen - 1; i++) {
          this.insertBlock(++sel.startIdx, blocks[i]);
        }

        this.insertBlock(++sel.startIdx, blocks[blocksLen - 1] + sel.rightText);
      }

      offset = blocks[blocksLen - 1].length;
    }

    Selection.setCaret(this._model[sel.startIdx].dom[0], offset);

    return false;
  };

  Editor.prototype._oncut = function _editorOncut(event) {
    event.preventDefault();

    var sel = Selection.getInfo(this._model);
    if (sel === null) {
      return false;
    }

    var text = '';
    if (sel.startIdx === sel.endIdx) {
      text = this._model[sel.startIdx].text.substring(sel.startPos, sel.endPos);
    } else {
      text = this._model[sel.startIdx].text.substring(sel.startPos) + '\n';

      for (var i = sel.startIdx + 1; i <= sel.endIdx - 1; i++) {
        text += this._model[i].text + '\n';
      }

      text += this._model[sel.endIdx].text.substring(0, sel.endPos);
    }

    event.originalEvent.clipboardData.setData('text/plain', text);

    this.removeText(sel);
    Selection.setCaret(this._model[sel.startIdx].dom[0], sel.startPos);

    return false;
  };

  Editor.prototype._eventsHandlers = function _editorEventsHandlers() {
    this._dom.on({
      keydown: this._onkeydown.bind(this),
      keyup: this._onkeyup.bind(this),
      cut: this._oncut.bind(this),
      paste: this._onpaste.bind(this)
    });
  };

  return Editor;
})();

module.exports = Editor;