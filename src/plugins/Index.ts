import { Schema } from "prosemirror-model";
import { Transaction, Plugin } from "prosemirror-state";
import { history } from 'prosemirror-history';
import { dropCursor } from "prosemirror-dropcursor";
import { gapCursor } from "prosemirror-gapcursor";
import { tableEditing, columnResizing } from "prosemirror-tables";
import KeyMap from "./KeyMap";
import { Actions } from "../actions/BuiltInActions";
// import { EditorProps } from "prosemirror-view";

export interface PluginConfig {
    schema: Schema,
    dispatchTransaction: (tr: Transaction) => void,
    actions: Actions
    // editorProps: EditorProps
}

export default (pluginConfig: PluginConfig): Plugin[] => {
    const plugins: Plugin[] = [];

    plugins.push(KeyMap(pluginConfig.actions));
    plugins.push(history());
    plugins.push(dropCursor());
    plugins.push(gapCursor());
    //@ts-ignore
    plugins.push(columnResizing({lastColumnResizable: false}));
    plugins.push(tableEditing());


    return plugins;
}