var Selection = require('./Selection');

var Editor = (function() {
  function Editor() {
    this.$el = $('#editor');
    this.model = [];

    this.events_handlers();
  }

  Editor.prototype.onmouseup = function editor_onmouseup() {
    var sel_info = Selection.get_info();
    console.log(Selection.toString());
  };

  Editor.prototype.events_handlers = function editor_events_handlers() {
    this.$el.on({
      mouseup: this.onmouseup
    });
  };

  return Editor;
})();

module.exports = Editor;