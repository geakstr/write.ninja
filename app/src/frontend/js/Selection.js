var Selection = (function() {
  function Selection() {}

  Selection.getInfo = function selectionGetInfo(model) {
    var sel = window.getSelection();
    if (sel.anchorNode === null && sel.focusNode === null) {
      return null;
    }

    var $anchorNode = $(sel.anchorNode);
    var $focusNode = $(sel.focusNode);

    if ($anchorNode.hasClass('edtr-blck') === false) {
      $anchorNode = $anchorNode.parents('.edtr-blck');
    }
    if ($focusNode.hasClass('edtr-blck') === false) {
      $focusNode = $focusNode.parents('.edtr-blck');
    }

    var startIdx = $anchorNode.attr('data-idx');
    var endIdx = $focusNode.attr('data-idx');

    if (isNaN(startIdx) || isNaN(endIdx)) {
      return null;
    }

    if (startIdx > endIdx) {
      var tmpStartIdx = startIdx;
      startIdx = endIdx;
      endIdx = tmpStartIdx;

      var $tmpAnchorNode = $anchorNode;
      $anchorNode = $focusNode;
      $focusNode = $tmpAnchorNode;
    }

    var startPos = this.getPos($anchorNode[0]).start;
    var endPos = this.getPos($focusNode[0]).end;

    var startBlock = model[startIdx];
    var endBlock = model[endIdx];

    var leftText = startBlock.text;
    var rightText = endBlock.text;

    var isCaret = startIdx === endIdx && startPos === endPos;
    var isRange = !isCaret;

    return {
      isCaret: isCaret,
      isRange: isRange,
      startPos: +startPos,
      endPos: +endPos,
      startIdx: +startIdx,
      endIdx: +endIdx,
      startBlock: startBlock,
      endBlock: endBlock,
      leftText: leftText,
      rightText: rightText
    }
  };

  Selection.getPos = function selectionSetPos(el) {
    var sel = el.ownerDocument.defaultView.getSelection();
    var start = 0;
    var end = 0;

    if (sel.rangeCount > 0) {
      var range = sel.getRangeAt(0);
      var cloneRange = range.cloneRange();

      cloneRange.selectNodeContents(el);
      cloneRange.setStart(range.startContainer, range.startOffset);
      start = el.textContent.length - cloneRange.toString().length;

      cloneRange = range.cloneRange();
      cloneRange.selectNodeContents(el);
      cloneRange.setEnd(range.endContainer, range.endOffset);
      end = cloneRange.toString().length;
    }

    return {
      start: start,
      end: end
    };
  };

  Selection.setCaret = function selectionSetCaret(node, offset) {
    var sel = window.getSelection();

    var tw = document.createTreeWalker(node, NodeFilter.SHOW_TEXT, null, null);
    var range = document.createRange();
    var curNode = null;
    var curOffset = 0;
    var wasRngSet = false;

    while (curNode = tw.nextNode()) {
      curOffset += curNode.nodeValue.length;
      if (curOffset >= offset) {
        offset = curNode.nodeValue.length + offset - curOffset;
        range.setStart(curNode, offset);
        range.setEnd(curNode, offset);
        wasRngSet = true;
        break;
      }
    }

    if (!wasRngSet) {
      range.selectNodeContents(node);
      range.collapse(false);
    }

    sel.removeAllRanges();
    sel.addRange(range);
  }

  Selection.toString = function toString() {
    var selInfo = this.getInfo();

    var ret = selInfo.isCaret + ' ' + selInfo.startIdx + ' ';
    ret += selInfo.endIdx + ' ' + selInfo.startPos + ' ' + selInfo.endPos;
    return ret;
  }

  return Selection;
})();

module.exports = Selection;