var $ = require('jquery');

var Block = (function() {
  function Block(text) {
    this._idx = 0;
    this._text = text;
    this._type = this.detectType(text);
    this._dom = $(this.format());
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
      this.type = this.detectType(text);
      this._dom.text(text);
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

  Block.prototype.detectType = function blockDetectType(text) {
    text = text.trim();

    var type = 'note';
    if (text.length === 0) {
      type = 'empty';
    } else if (text[0] === '-') {
      type = 'task';
    }

    return type;
  };

  Block.prototype.format = function blockFormat() {
    var css = 'edtr-blck';
    var attr = 'class="' + css + '" data-idx="' + this._idx + '"';

    return '<p ' + attr + '>' + this._text + '</p>';
  };

  return Block;
})();

module.exports = Block;