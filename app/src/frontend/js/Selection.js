var Selection = (function() {
  function Selection() {}

  Selection.get_info = function selection_get_info() {
    var sel = window.getSelection();
    if (sel.anchorNode === null && sel.focusNode === null) return null;

    var $anchor_node = $(sel.anchorNode),
      $focus_node = $(sel.focusNode);

    if ($anchor_node.hasClass('edtr-blck') === false) {
      $anchor_node = $anchor_node.parents('.edtr-blck');
    }
    if ($focus_node.hasClass('edtr-blck') === false) {
      $focus_node = $focus_node.parents('.edtr-blck');
    }

    var start_idx = $anchor_node.attr('data-idx'),
      end_idx = $focus_node.attr('data-idx');

    if (isNaN(start_idx) || isNaN(end_idx)) return null;

    if (start_idx > end_idx) {
      var tmp_start_idx = start_idx;
      start_idx = end_idx;
      end_idx = tmp_start_idx;

      var $tmp_anchor_node = $anchor_node;
      $anchor_node = $focus_node;
      $focus_node = $tmp_anchor_node;
    }

    var start_pos = this.get_pos($anchor_node[0]).start,
      end_pos = this.get_pos($focus_node[0]).end,
      is_caret = start_idx === end_idx && start_pos === end_pos,
      is_range = !is_caret;

    return {
      is_caret: is_caret,
      start_idx: start_idx,
      end_idx: end_idx,
      start_pos: start_pos,
      end_pos: end_pos
    }
  };

  Selection.get_pos = function selection_get_pos(el) {
    var sel = el.ownerDocument.defaultView.getSelection(),
      start = 0,
      end = 0;

    if (sel.rangeCount > 0) {
      var range = sel.getRangeAt(0),
        clone_range = range.cloneRange();

      clone_range.selectNodeContents(el);
      clone_range.setStart(range.startContainer, range.startOffset);
      start = el.textContent.length - clone_range.toString().length;

      clone_range = range.cloneRange();
      clone_range.selectNodeContents(el);
      clone_range.setEnd(range.endContainer, range.endOffset);
      end = clone_range.toString().length;
    }

    return {
      start: start,
      end: end
    };
  };

  Selection.set_caret = function selection_set_caret(node, offset) {
    var sel = window.getSelection();

    var tw = document.createTreeWalker(node, NodeFilter.SHOW_TEXT, null, null),
      range = document.createRange(),
      cur_node = null,
      cur_offset = 0,
      was_rng_set = false;

    while (cur_node = tw.nextNode()) {
      cur_offset += cur_node.nodeValue.length;
      if (cur_offset >= offset) {
        offset = cur_node.nodeValue.length + offset - cur_offset;
        range.setStart(cur_node, offset);
        range.setEnd(cur_node, offset);
        was_rng_set = true;
        break;
      }
    }

    if (!was_rng_set) {
      range.selectNodeContents(node);
      range.collapse(false);
    }

    sel.removeAllRanges();
    sel.addRange(range);
  }

  Selection.toString = function toString() {
    var sel_info = this.get_info();
    return sel_info.is_caret + " " + sel_info.start_idx + " " +
      sel_info.end_idx + " " + sel_info.start_pos + " " + sel_info.end_pos;
  }

  return Selection;
})();

module.exports = Selection;