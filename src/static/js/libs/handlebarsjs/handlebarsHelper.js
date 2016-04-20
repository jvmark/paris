(function() {
  var ArrayProto = Array.prototype,
    ObjProto = Object.prototype,
    FuncProto = Function.prototype;

  // Create quick reference variables for speed access to core prototypes.
  var
    push = ArrayProto.push,
    slice = ArrayProto.slice,
    concat = ArrayProto.concat,
    toString = ObjProto.toString,
    hasOwnProperty = ObjProto.hasOwnProperty;


  Handlebars.registerHelper('ifCond', function(v1, operator, v2, options) {
    switch (operator) {
      case '==':
        return (v1 == v2) ? options.fn(this) : options.inverse(this);
      case '===':
        return (v1 === v2) ? options.fn(this) : options.inverse(this);
      case '<':
        return (v1 < v2) ? options.fn(this) : options.inverse(this);
      case '<=':
        return (v1 <= v2) ? options.fn(this) : options.inverse(this);
      case '>':
        return (v1 > v2) ? options.fn(this) : options.inverse(this);
      case '>=':
        return (v1 >= v2) ? options.fn(this) : options.inverse(this);
      case '!=':
        return (v1 != v2) ? options.fn(this) : options.inverse(this);
      case '&&':
        return (v1 && v2) ? options.fn(this) : options.inverse(this);
      case '||':
        return (v1 || v2) ? options.fn(this) : options.inverse(this);
      default:
        return options.inverse(this);
    }
  });

  Handlebars.registerHelper('if', function(conditional, options) {
    if (conditional) {
      return options.fn(this);
    } else {
      return options.inverse(this);
    }
  });


  //{{duitang 'people/detail/good/'}}
  Handlebars.registerHelper('duitang', function(options) {
    return options;
  });

  //{{dtImageTrans (i.avatar,true,48,48,'c')}}
  Handlebars.registerHelper('dtImageTrans', function(url, t, w, h, c) {
    var pathn = $.trim(url).replace(/^http(s)?:\/\//ig, ''),
      pathn = pathn.split('/'),
      domain = pathn[0],
      pathn = pathn[1];

    // 只有堆糖域名下 uploads misc 目录下的图片可以缩略
    if (domain.indexOf('duitang.com') == -1 || !pathn || pathn != 'uploads' && pathn != 'misc') {
      return url;
    }
    if (t) {
      w = w || 0;
      h = h || 0;
      c = c ? '_' + c : ''
      return $.G.dtImageTrans(url).replace(/(\.[a-z_]+)$/ig, '.thumb.' + w + '_' + h + c + '$1')
    } else {
      return url.replace(/(?:\.thumb\.\w+|\.[a-z]+!\w+)(\.[a-z_]+)$/ig, '$1')
    }
  });

  Handlebars.registerHelper('encodeParam', function(value, key) {
    if (arguments.length === 2) {
      return encodeURIComponent(value);
    } else {
      var obj = {};
      obj[key] = value;
      return encodeURIComponent(JSON.stringify(obj));
    }
  });

  Handlebars.registerHelper('plus', function(n1, n2) {
    return n1 + n2;
  });

  Handlebars.registerHelper('decrease', function(n1, n2) {
    return n1 - n2;
  });

  Handlebars.registerHelper('json', function(obj) {
    var copy = clone(obj);
    if (copy.hasOwnProperty('title')) {
      delete copy.title
    };
    if (copy.hasOwnProperty('more')) {
      delete copy.more
    };
    return JSON.stringify(obj);
  });

  Handlebars.registerHelper('jsonParse', function(obj) {
    var copy = clone(obj);
    if (copy.hasOwnProperty('title')) {
      delete copy.title
    };
    if (copy.hasOwnProperty('more')) {
      delete copy.more
    };
    return JSON.stringify(copy, null, 4);
  });

  Handlebars.registerHelper('wootemp', function(type, layout, sdkVersion) {
    if (type === 'blog') {
      if (layout === '1column') {
        if (sdkVersion < 0.3) {
          return 3;
        } else {
          return 9;
        }
      } else {
        return 0;
      }
    } else if (type === 'album') {
      return 1
    } else if (type === 'people') {
      return 2
    }
  });
  Handlebars.registerHelper("math", function(lvalue, operator, rvalue, options) {
    lvalue = parseFloat(lvalue);
    rvalue = parseFloat(rvalue);

    return {
      "+": lvalue + rvalue,
      "-": lvalue - rvalue,
      "*": lvalue * rvalue,
      "/": lvalue / rvalue,
      "%": lvalue % rvalue
    }[operator];
  });

  Handlebars.registerHelper('join', function(array) {
    return array.join(',');
  });

  Handlebars.registerHelper('firstcut', function(array) {
    var covers = array[0];
    //depend on $.G.dtImageTrans in file pack.js
    return $.G.dtImageTrans(covers, true, 224, 224, 'c');
  });

  function clone(obj) {
    if (null == obj || "object" != typeof obj) return obj;
    var copy = obj.constructor();
    for (var attr in obj) {
      if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
    }
    return copy;
  }
}).call(this);