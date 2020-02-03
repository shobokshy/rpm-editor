import { Schema } from "prosemirror-model";
import { Transaction, Plugin } from "prosemirror-state";
import { history } from 'prosemirror-history';
import { dropCursor } from "prosemirror-dropcursor";
import { gapCursor } from "prosemirror-gapcursor";
import KeyMap from "./KeyMap";
import { Actions } from "../actions/BuiltInActions";
import { InputRule } from "prosemirror-inputrules";
import { IPortalRenderer } from "../PortalRenderer";

export interface PluginConfig {
    schema: Schema,
    editable: boolean,
    dispatchTransaction: (tr: Transaction) => void,
    actions: Actions,
    inputRules?: InputRule[],
    renderer: {
        render: IPortalRenderer['render'],
        unmount: IPortalRenderer['unmount']
    }
}

export default (pluginConfig: PluginConfig): Plugin[] => {
    const plugins: Plugin[] = [];
    
    plugins.push(KeyMap(pluginConfig.actions));
    plugins.push(history());
    plugins.push(dropCursor({
        //@ts-ignore
        class: "rpm-drop-cursor"
    }));
    plugins.push(gapCursor());

    return plugins;
}