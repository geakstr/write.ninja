var $ = require('jquery');

var Utils = (function() {
  function Utils() {}

  $.fn.insertAt = function(index, elements) {
    var children = this.children();
    if (index >= children.size()) {
      this.append(elements);
      return this;
    }
    var before = children.eq(index);
    $(elements).insertBefore(before);
    return this;
  };

  return Utils;
})();

module.exports = Utils;