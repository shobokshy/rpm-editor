"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var prosemirror_commands_1 = require("prosemirror-commands");
var prosemirror_history_1 = require("prosemirror-history");
var schema_1 = require("../schema");
var Action_1 = require("./Action");
var actions = {
    bold: new Action_1.default({
        command: function () { return prosemirror_commands_1.toggleMark(schema_1.default.marks.strong); },
        type: schema_1.default.marks.em
    }),
    italic: new Action_1.default({
        command: function () { return prosemirror_commands_1.toggleMark(schema_1.default.marks.em); },
        type: schema_1.default.marks.em
    }),
    code: new Action_1.default({
        command: function () { return prosemirror_commands_1.toggleMark(schema_1.default.marks.code); },
        type: schema_1.default.marks.code
    }),
    heading: new Action_1.default({
        command: function (attrs) { return prosemirror_commands_1.setBlockType(schema_1.default.nodes.heading, { level: attrs.level }); },
        type: schema_1.default.nodes.heading
    }),
    paragraph: new Action_1.default({
        command: function () { return prosemirror_commands_1.setBlockType(schema_1.default.nodes.paragraph); },
        type: schema_1.default.nodes.paragraph
    }),
    codeBlock: new Action_1.default({
        command: function () { return prosemirror_commands_1.setBlockType(schema_1.default.nodes.code_block); },
        type: schema_1.default.nodes.code_block
    }),
    bulletList: new Action_1.default({
        command: function () { return prosemirror_commands_1.setBlockType(schema_1.default.nodes.bullet_list); },
        type: schema_1.default.nodes.bullet_list
    }),
    orderedList: new Action_1.default({
        command: function () { return prosemirror_commands_1.setBlockType(schema_1.default.nodes.ordered_list); },
        type: schema_1.default.nodes.ordered_list
    }),
    blockquote: new Action_1.default({
        command: function () { return prosemirror_commands_1.setBlockType(schema_1.default.nodes.blockquote); },
        type: schema_1.default.nodes.blockquote
    }),
    undo: new Action_1.default({
        command: function () { return prosemirror_history_1.undo; }
    }),
    redo: new Action_1.default({
        command: function () { return prosemirror_history_1.redo; }
    }),
};
exports.default = actions;
//# sourceMappingURL=Index.js.map