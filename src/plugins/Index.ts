import { Schema } from "prosemirror-model";
import { Transaction, Plugin } from "prosemirror-state";
import { history } from 'prosemirror-history';
import { dropCursor } from "prosemirror-dropcursor";
import { gapCursor } from "prosemirror-gapcursor";
import { tableEditing, columnResizing } from "prosemirror-tables";
import KeyMap from "./KeyMap";
import { Actions } from "../actions/BuiltInActions";
import { EditableState } from "./EditableState";
import { rules } from "./InputRules";
import { InputRule } from "prosemirror-inputrules";

export interface PluginConfig {
    schema: Schema,
    editable: boolean,
    dispatchTransaction: (tr: Transaction) => void,
    actions: Actions,
    inputRules?: InputRule[]
    // editorProps: EditorProps
}

export default (pluginConfig: PluginConfig): Plugin[] => {
    const plugins: Plugin[] = [];
    

    plugins.push(EditableState(pluginConfig));
    plugins.push(KeyMap(pluginConfig.actions));
    plugins.push(history());
    //plugins.push(rules(pluginConfig.inputRules));
    plugins.push(dropCursor({
        //@ts-ignore
        class: "rpm-drop-cursor"
    }));
    plugins.push(gapCursor());
    //@ts-ignore
    plugins.push(columnResizing({lastColumnResizable: false}));
    plugins.push(tableEditing());


    return plugins;
}