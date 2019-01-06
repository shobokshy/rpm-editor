"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Action = (function () {
    function Action(spec) {
        this.spec = spec;
    }
    Object.defineProperty(Action.prototype, "getType", {
        get: function () {
            return this.spec.type;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Action.prototype, "getCommand", {
        get: function () {
            return this.spec.command;
        },
        enumerable: true,
        configurable: true
    });
    Action.prototype.addStateAndDispatch = function (editorState, dispatch) {
        this.editorState = editorState;
        this.dispatch = dispatch;
    };
    Action.prototype.execute = function (attrs) {
        if (this.editorState && this.dispatch) {
            return this.getCommand(attrs)(this.editorState, this.dispatch);
        }
        else {
            return false;
        }
    };
    Action.prototype.isDisabled = function (attrs) {
        if (this.editorState) {
            return this.getCommand(attrs)(this.editorState);
        }
        else {
            return true;
        }
    };
    Action.prototype.isAcitve = function (attrs) {
        return false;
    };
    return Action;
}());
exports.default = Action;
//# sourceMappingURL=Action.js.map