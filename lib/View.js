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
var React = require("react");
var prosemirror_view_1 = require("prosemirror-view");
var View = /** @class */ (function (_super) {
    __extends(View, _super);
    function View(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            editorView: undefined,
            editorRef: React.createRef()
        };
        return _this;
    }
    View.prototype.componentDidMount = function () {
        this.createEditorView();
    };
    // on new state from parent, update the view with that state
    View.prototype.componentDidUpdate = function (prevProps) {
        if (this.state.editorView) {
            this.state.editorView.updateState(this.props.editorState);
            this.focus();
        }
    };
    View.prototype.createEditorView = function () {
        var _this = this;
        this.setState({
            editorView: new prosemirror_view_1.EditorView(this.state.editorRef.current, {
                state: this.props.editorState,
                dispatchTransaction: this.dispatchTransaction.bind(this),
                editable: function () { return _this.props.editable; }
            })
        });
    };
    // dispatch transaction function from parent
    // send new transactions coming from view to parent
    View.prototype.dispatchTransaction = function (tr) {
        this.props.dispatchTransaction(tr);
    };
    // Focus cursor to editor view
    View.prototype.focus = function () {
        if (this.state.editorView)
            this.state.editorView.focus();
    };
    // clean up on un mount
    View.prototype.componentWillUnmount = function () {
        if (this.state.editorView)
            this.state.editorView.destroy();
    };
    View.prototype.render = function () {
        return (React.createElement("div", { ref: this.state.editorRef }));
    };
    return View;
}(React.Component));
exports.View = View;
//# sourceMappingURL=View.js.map