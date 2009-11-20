// The Query is the plain-text, plain-english representation of the thing
// that you just searched for.
dc.ui.Query = dc.View.extend({

  QUOTED : /^['"].+['"]$/,

  className : 'search_query',

  constructor : function(options) {
    this.base(options);
    Documents.bind(Documents.SELECTION_CHANGED, _(this._onSelectionChange).bind(this));
  },

  blank : function() {
    $(this.el).html('');
  },

  render : function(data) {
    data = data ? (this.data = data) : this.data;
    var to = Math.min(data.to, data.total);
    var fromPart = (data.total < 2 ? '' : '' + (data.from + 1) + " &ndash; " + to + " of ");
    var verbPart = (data.labels.length > 0 && !data.text && data.fields.length <= 0 && data.attributes.length <= 0) ? ' labeled ' : ' matching ';
    var sentence = fromPart + data.total + " document" + (data.total == 1 ? "" : "s") + verbPart;
    var fields = data.fields.concat(data.attributes);
    var list = $.map(fields, function(f){ return f.value; });
    list = list.concat(data.labels);
    if (data.text) list.push(data.text);
    var me = this;
    list = $.map(list, function(s) {
      return me.QUOTED.test(s) ? s : '"' + s + '"';
    });
    var last = list.pop();

    if (list.length == 0) {
      sentence += last + ".";
    } else if (list.length == 1) {
      sentence += list[0] + ' and ' + last + ".";
    } else {
      sentence += list.join(', ') + ", and " + last + ".";
    }

    $(this.el).html(sentence);
    return this;
  },

  renderSelected : function(count) {
    var sentence = count + ' selected ' + Inflector.pluralize('document', count) + '.';
    $(this.el).html(sentence);
  },

  _onSelectionChange : function() {
    var count = Documents.countSelected();
    count > 0 ? this.renderSelected(count) : this.render();
  }

});