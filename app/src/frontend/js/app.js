$(document).ready(function() {
  var $ = require('jquery'),
    Utils = require('./Utils'),
    Selection = require('./Selection'),
    Editor = require('./Editor'),
    Block = require('./Block');

  var editor = new Editor();

  editor.push_block('Это первая строка');
  editor.push_block().push_block();
  editor.push_block('Это вторая строка');

  editor.insert_block(1, 'Вставка');
});