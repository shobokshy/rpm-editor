import { Schema } from "prosemirror-model";
import { Transaction, Plugin } from "prosemirror-state";
import { history } from 'prosemirror-history';
import { dropCursor } from "prosemirror-dropcursor";
import { gapCursor } from "prosemirror-gapcursor";
import KeyMap from "./KeyMap";
import actions, { Actions } from "../actions/Index";
// import { EditorProps } from "prosemirror-view";

export interface IPluginConfig {
    schema: Schema,
    dispatchTransaction: (tr: Transaction) => void,
    actions: Actions
    // editorProps: EditorProps
}

export default (pluginConfig: IPluginConfig): Plugin[] => {
    const plugins: Plugin[] = [];

    plugins.push(KeyMap(pluginConfig.actions));
    plugins.push(history());
    plugins.push(dropCursor());
    plugins.push(gapCursor());


    return plugins;
}