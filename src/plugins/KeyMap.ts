import { Actions } from "../actions/BuiltInActions";
import { keymap } from "prosemirror-keymap";
import { baseKeymap, chainCommands } from "prosemirror-commands";
import { Command } from "../Types";

interface Keys {
    [key:string]: Command;
}

export default (actions: Actions) => {

    let keys: Keys = {};

    Object.keys(actions).map((actionKey: string) => {
        const action = actions[actionKey];
        const shortcuts = action.getShortcuts;
        shortcuts.forEach((shortcut) => {
            if (keys[shortcut.key]) {
                keys[shortcut.key] = chainCommands(keys[shortcut.key], action.getCommand(shortcut.attrs))
            } else {
                keys[shortcut.key] = action.getCommand(shortcut.attrs)
            }
        })
    });
    

    // const keys: Keys = {
    //     'Mod-z': actions.undo.getCommand(),
    //     'Shift-Mod-z': actions.redo.getCommand(),
    //     //'Backspace': actions.undoInputRule,
    //     'Mod-y': actions.redo.getCommand(),
    //     //'Alt-ArrowUp': actions.joinUp,
    //     //'Alt-ArrowDown': actions.joinDown,
    //     //'Mod-BracketLeft': actions.lift,
    //     //'Escape': actions.selectParentNode,
    //     'Mod-b': actions.bold.getCommand(),
    //     'Mod-i': actions.italic.getCommand(),
    //     //'Mod-u': actions.underline,
    //     'Mod-`': actions.code.getCommand(),
    //     'Shift-Ctrl-8': actions.bulletList.getCommand(),
    //     'Shift-Ctrl-9': actions.orderedList.getCommand(),
    //     'Ctrl->': actions.blockquote.getCommand(),
    //     //'Mod-Enter': chainactions(exitCode, insertBreak),
    //     //'Shift-Enter': chainactions(exitCode, insertBreak),
    //     //'Ctrl-Enter': chainactions(exitCode, insertBreak), // mac-only?
    //     //'Enter': splitListItem(schema.nodes.list_item),
    //     //'Mod-[': liftListItem(schema.nodes.list_item),
    //     //'Mod-]': sinkListItem(schema.nodes.list_item),
    //     //'Tab': sinkListItem(schema.nodes.list_item),
    //     //'Tab': chainactions(sinkListItem(schema.nodes.list_item), wrapInList(schema.nodes.list_item)),
    //     //'Shift-Tab': liftListItem(schema.nodes.list_item),
    //     'Shift-Ctrl-0': actions.paragraph.getCommand(),
    //     'Shift-Ctrl-\\':actions.codeBlock.getCommand(),
    //     'Shift-Ctrl-1': actions.heading.getCommand({level: 1}),
    //     'Shift-Ctrl-2': actions.heading.getCommand({level: 2}),
    //     'Shift-Ctrl-3': actions.heading.getCommand({level: 3}),
    //     'Shift-Ctrl-4': actions.heading.getCommand({level: 4}),
    //     'Shift-Ctrl-5': actions.heading.getCommand({level: 5}),
    //     'Shift-Ctrl-6': actions.heading.getCommand({level: 6}),
    //     //'Mod-_': insertRule,
    //     //'Tab': goToNextCell(1),
    //     //'Shift-Tab': goToNextCell(-1)
    // }
    
    // Add existing basemap keys to our custom set of keys
    Object.keys(baseKeymap).forEach((key: string) => {
        if (keys[key]) {
            keys[key] = chainCommands(keys[key], baseKeymap[key])
        } else {
            keys[key] = baseKeymap[key]
        }
    });


    return keymap(keys);
};