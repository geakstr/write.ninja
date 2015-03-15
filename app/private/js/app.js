(function() {
  var editor = {
    elem : document.getElementById("editor"),
    model : {},
  };

  function show_caret_pos() {
    var caret_pos_elem = document.getElementById("caret_pos");
    var selection_info = get_selection_info(editor.elem);

    caret_pos_elem.innerHTML = "Caret position: " + selection_info.start + " " + selection_info.end;
  }

  document.body.onkeyup = show_caret_pos;
  document.body.onmouseup = show_caret_pos;
})();


function get_selection_info(elem) {
  var offset = 0, length = 0;
  var selection = elem.ownerDocument.defaultView.getSelection();

  if (selection.rangeCount > 0) {
    var range = selection.getRangeAt(0);
    var pre_caret_range = range.cloneRange();
    pre_caret_range.selectNodeContents(elem);
    pre_caret_range.setEnd(range.endContainer, range.endOffset);

    length = range.toString().length;
    offset = pre_caret_range.toString().length - length;
  }

  return {
    start : offset,
    end : offset + length
  };
}