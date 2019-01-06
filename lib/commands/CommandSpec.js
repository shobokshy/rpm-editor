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
var Action = (function () {
    function Action(spec, editorState, dispatch) {
        this.spec = spec;
        this.editorState = editorState;
        this.dispatch = dispatch;
    }
    Object.defineProperty(Action.prototype, "type", {
        get: function () {
            return this.spec.type;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Action.prototype, "attrs", {
        get: function () {
            return this.spec.attrs;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Action.prototype, "command", {
        get: function () {
            return this.spec.command(__assign({}, this.attrs));
        },
        enumerable: true,
        configurable: true
    });
    Action.prototype.execute = function () {
        if (this.editorState && this.dispatch) {
            return this.command(this.editorState, this.dispatch);
        }
        else {
            return false;
        }
    };
    return Action;
}());
exports.default = Action;
//# sourceMappingURL=CommandSpec.js.map