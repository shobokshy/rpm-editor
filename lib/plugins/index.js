"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var prosemirror_history_1 = require("prosemirror-history");
var prosemirror_dropcursor_1 = require("prosemirror-dropcursor");
var prosemirror_gapcursor_1 = require("prosemirror-gapcursor");
var KeyMap_1 = require("./KeyMap");
exports.default = (function (pluginConfig) {
    var plugins = [];
    plugins.push(KeyMap_1.default(pluginConfig.actions));
    plugins.push(prosemirror_history_1.history());
    plugins.push(prosemirror_dropcursor_1.dropCursor());
    plugins.push(prosemirror_gapcursor_1.gapCursor());
    return plugins;
});
//# sourceMappingURL=index.js.map