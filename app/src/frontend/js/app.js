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