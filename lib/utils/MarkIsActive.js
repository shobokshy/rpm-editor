"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Check if the given mark type is active at the current editor selection
 * @param state Current Editor State
 * @param type Type of schema mark
 * @returns true if active
 */
function default_1(state, type) {
    var _a = state.selection, from = _a.from, $from = _a.$from, to = _a.to, empty = _a.empty;
    if (empty)
        return !!type.isInSet(state.storedMarks || $from.marks());
    else
        return !!state.doc.rangeHasMark(from, to, type);
}
exports.default = default_1;
//# sourceMappingURL=MarkIsActive.js.map