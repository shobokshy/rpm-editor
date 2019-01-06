"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var prosemirror_utils_1 = require("prosemirror-utils");
/**
 * Check if the given node type is active at the current editor selection
 * @param state Current Editor State
 * @param type Type of schema node
 * @returns true if active
 */
function default_1(state, type) {
    var node = prosemirror_utils_1.findParentNode(function (node) { return node.type === type; })(state.selection);
    if (node)
        return true;
    return false;
}
exports.default = default_1;
//# sourceMappingURL=NodeIsActive.js.map