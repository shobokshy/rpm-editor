import { Schema } from "prosemirror-model";
import { Transaction, Plugin } from "prosemirror-state";
import { Actions } from "../actions/Index";
export interface IPluginConfig {
    schema: Schema;
    dispatchTransaction: (tr: Transaction) => void;
    actions: Actions;
}
declare const _default: (pluginConfig: IPluginConfig) => Plugin<any>[];
export default _default;
