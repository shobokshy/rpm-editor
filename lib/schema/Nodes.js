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
var prosemirror_schema_list_1 = require("prosemirror-schema-list");
var prosemirror_tables_1 = require("prosemirror-tables");
var listNodes = {
    ordered_list: __assign({}, prosemirror_schema_list_1.orderedList, { 
        //content: 'list_item+',
        group: 'block' }),
    bullet_list: __assign({}, prosemirror_schema_list_1.bulletList, { content: 'list_item+', group: 'block' }),
    list_item: __assign({}, prosemirror_schema_list_1.listItem, { content: 'paragraph block*', group: 'block' })
};
exports.default = __assign({}, prosemirror_schema_basic_1.nodes, listNodes, prosemirror_tables_1.tableNodes({
    tableGroup: 'block',
    cellContent: 'block+',
}));
//# sourceMappingURL=Nodes.js.map