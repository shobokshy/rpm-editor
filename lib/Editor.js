"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var prosemirror_state_1 = require("prosemirror-state");
var React = require("react");
var Index_1 = require("./actions/Index");
var plugins_1 = require("./plugins");
var schema_1 = require("./schema");
var UI_1 = require("./UI");
var View_1 = require("./View");
require('./Editor.css');
var Editor = /** @class */ (function (_super) {
    __extends(Editor, _super);
    function Editor(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            editorState: _this.createEditorState(),
            editorView: React.createRef(),
            renderView: false,
        };
        return _this;
    }
    Editor.prototype.createEditorState = function () {
        return prosemirror_state_1.EditorState.create({
            schema: schema_1.default,
            doc: undefined,
            plugins: plugins_1.default({
                schema: schema_1.default,
                dispatchTransaction: this.dispatchTransaction.bind(this),
                actions: this.getActions()
            }).slice()
        });
    };
    /**
     * Update current editor state with a new transaction
     * @param tr Prosemirror Transaction
     */
    Editor.prototype.dispatchTransaction = function (tr) {
        this.setState({
            editorState: this.state.editorState.apply(tr)
        }, 
        // focus to the editor view on new transactions
        this.focus);
    };
    /**
     * Get actions and enrich them with editor state & dispatch function on new state
     * @param editorState Editor's current state
     * @param dispatch a dispatch function that takes a transaction
     */
    Editor.prototype.getActions = function (editorState, dispatch) {
        if (editorState && dispatch) {
            Object.keys(Index_1.default).forEach(function (action) {
                Index_1.default[action].addStateAndDispatch(editorState, dispatch);
            });
            return Index_1.default;
        }
        else {
            return Index_1.default;
        }
    };
    Editor.prototype.focus = function () {
        if (this.state.editorView.current)
            this.state.editorView.current.focus();
    };
    Editor.prototype.render = function () {
        var _this = this;
        return (React.createElement("div", { className: this.props.className ? this.props.className : "rpm-editor" },
            React.createElement(UI_1.UI, { editorState: this.state.editorState, dispatchTransaction: this.dispatchTransaction.bind(this), editable: this.props.editable, children: this.props.children, actions: this.getActions(this.state.editorState, this.dispatchTransaction.bind(this)) }),
            React.createElement(View_1.View, { editorState: this.state.editorState, dispatchTransaction: this.dispatchTransaction.bind(this), editable: this.props.editable, ref: function () { return _this.state.editorView; } })));
    };
    return Editor;
}(React.Component));
exports.Editor = Editor;
//# sourceMappingURL=Editor.js.map