"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var prosemirror_model_1 = require("prosemirror-model");
var NodeIsActive_1 = require("../utils/NodeIsActive");
var MarkIsActive_1 = require("../utils/MarkIsActive");
/**
 * A class that defines what an Action is.
 * An action is any event that affects the editor's state.
 * Each action should at least contain a command (Prosemirror Command)
 * if given a type, it can determine if it is active
 */
var Action = /** @class */ (function () {
    function Action(spec) {
        this.spec = spec;
    }
    Object.defineProperty(Action.prototype, "getType", {
        /**
         * Get the schema type this action affects. Could be a node or a mark
         * @returns undefined if this action doesn't affect any specific node/mark. Like undo,redo and chainCommands
         */
        get: function () {
            return this.spec.type;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Action.prototype, "getCommand", {
        /**
         * Get the underlying ProseMirror command
         */
        get: function () {
            return this.spec.command;
        },
        enumerable: true,
        configurable: true
    });
    /**
    * Add the current editor state and dispatch transaction.
    * This is needed if the action needs to be executed
    */
    Action.prototype.addStateAndDispatch = function (editorState, dispatch) {
        this.editorState = editorState;
        this.dispatch = dispatch;
    };
    /**
     * Execute this action using the underlying command
     * @param attrs is any attributes required by the underlying command if any
     * @returns true if succesfull, otherwise false
     */
    Action.prototype.execute = function (attrs) {
        if (this.editorState && this.dispatch) {
            return this.getCommand(attrs)(this.editorState, this.dispatch);
        }
        else {
            return false;
        }
    };
    /**
     * Check if this action is available at the current editor state
     * @param attrs is any attributes required by the underlying command if any
     * @returns true if disabled
     */
    Action.prototype.isDisabled = function (attrs) {
        if (this.editorState) {
            return this.getCommand(attrs)(this.editorState);
        }
        else {
            return true;
        }
    };
    /**
     * Check if this action is currently applied at current editor selection.
     * Requires that this action has a type associated with it (Node or Mark).
     * @param attrs is any attributes required by the underlying command if any
     * @returns true if active
     */
    Action.prototype.isAcitve = function (attrs) {
        if (this.editorState) {
            if (this.getType instanceof prosemirror_model_1.NodeType)
                return NodeIsActive_1.default(this.editorState, this.getType);
            if (this.getType instanceof prosemirror_model_1.MarkType)
                return MarkIsActive_1.default(this.editorState, this.getType);
            return false;
        }
        else {
            return false;
        }
    };
    return Action;
}());
exports.default = Action;
//# sourceMappingURL=Action.js.map