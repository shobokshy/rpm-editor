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
var UI = /** @class */ (function (_super) {
    __extends(UI, _super);
    function UI(props) {
        return _super.call(this, props) || this;
    }
    UI.prototype.componentDidUpdate = function () {
        console.log('update');
    };
    UI.prototype.render = function () {
        return (React.createElement(React.Fragment, null, this.props.children({
            actions: this.props.actions,
            editorState: this.props.editorState,
            dispatchTransaction: this.props.dispatchTransaction
        })));
    };
    return UI;
}(React.Component));
exports.UI = UI;
//# sourceMappingURL=UI.js.map