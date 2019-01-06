"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var prosemirror_schema_basic_1 = require("prosemirror-schema-basic");
/*import { Node } from 'prosemirror-model';

const subscript = {
  excludes: 'superscript',
  parseDOM: [
    { tag: 'sub' },
    { style: 'vertical-align=sub' }
  ],
  toDOM: () => ['sub']
}

const superscript = {
  excludes: 'subscript',
  parseDOM: [
    { tag: 'sup' },
    { style: 'vertical-align=super' }
  ],
  toDOM: () => ['sup']
}

const strikethrough = {
  parseDOM: [
    { tag: 'strike' },
    { style: 'text-decoration:line-through' },
    { style: 'text-decoration-line:line-through' }
  ],
  toDOM: () => ['span', {
    style: 'text-decoration-line:line-through'
  }]
}

const underline = {
  parseDOM: [
    { tag: 'u' },
    { style: 'text-decoration:underline' }
  ],
  toDOM: () => ['span', {
    style: 'text-decoration:underline'
  }]
}

const color = {
  attrs: {
    style: ''
  },
  toDOM: (node: Node)  => ["span", {
    style: node.attrs.style
  }, 0]
}*/
exports.default = __assign({}, prosemirror_schema_basic_1.marks);
//# sourceMappingURL=Marks.js.map