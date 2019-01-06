"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Nodes_1 = require("./Nodes");
var Marks_1 = require("./Marks");
var prosemirror_model_1 = require("prosemirror-model");
var BuiltInSchema = new prosemirror_model_1.Schema({
    nodes: Nodes_1.default,
    marks: Marks_1.default
});
exports.default = BuiltInSchema;
//# sourceMappingURL=index.js.map