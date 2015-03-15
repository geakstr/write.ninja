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