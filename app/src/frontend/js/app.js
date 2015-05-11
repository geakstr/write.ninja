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