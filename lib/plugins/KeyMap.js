"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var prosemirror_keymap_1 = require("prosemirror-keymap");
var prosemirror_commands_1 = require("prosemirror-commands");
exports.default = (function (actions) {
    var keys = {
        'Mod-z': actions.undo.getCommand(),
        'Shift-Mod-z': actions.redo.getCommand(),
        //'Backspace': actions.undoInputRule,
        'Mod-y': actions.redo.getCommand(),
        //'Alt-ArrowUp': actions.joinUp,
        //'Alt-ArrowDown': actions.joinDown,
        //'Mod-BracketLeft': actions.lift,
        //'Escape': actions.selectParentNode,
        'Mod-b': actions.bold.getCommand(),
        'Mod-i': actions.italic.getCommand(),
        //'Mod-u': actions.underline,
        'Mod-`': actions.code.getCommand(),
        'Shift-Ctrl-8': actions.bulletList.getCommand(),
        'Shift-Ctrl-9': actions.orderedList.getCommand(),
        'Ctrl->': actions.blockquote.getCommand(),
        //'Mod-Enter': chainactions(exitCode, insertBreak),
        //'Shift-Enter': chainactions(exitCode, insertBreak),
        //'Ctrl-Enter': chainactions(exitCode, insertBreak), // mac-only?
        //'Enter': splitListItem(schema.nodes.list_item),
        //'Mod-[': liftListItem(schema.nodes.list_item),
        //'Mod-]': sinkListItem(schema.nodes.list_item),
        //'Tab': sinkListItem(schema.nodes.list_item),
        //'Tab': chainactions(sinkListItem(schema.nodes.list_item), wrapInList(schema.nodes.list_item)),
        //'Shift-Tab': liftListItem(schema.nodes.list_item),
        'Shift-Ctrl-0': actions.paragraph.getCommand(),
        'Shift-Ctrl-\\': actions.codeBlock.getCommand(),
        'Shift-Ctrl-1': actions.heading.getCommand({ level: 1 }),
        'Shift-Ctrl-2': actions.heading.getCommand({ level: 2 }),
        'Shift-Ctrl-3': actions.heading.getCommand({ level: 3 }),
        'Shift-Ctrl-4': actions.heading.getCommand({ level: 4 }),
        'Shift-Ctrl-5': actions.heading.getCommand({ level: 5 }),
        'Shift-Ctrl-6': actions.heading.getCommand({ level: 6 }),
    };
    // Add existing basemap keys to our custom set of keys
    Object.keys(prosemirror_commands_1.baseKeymap).forEach(function (key) {
        if (keys[key]) {
            keys[key] = actions.chainactions.getCommand(keys[key], prosemirror_commands_1.baseKeymap[key]);
        }
        else {
            keys[key] = prosemirror_commands_1.baseKeymap[key];
        }
    });
    return prosemirror_keymap_1.keymap(keys);
});
//# sourceMappingURL=KeyMap.js.map