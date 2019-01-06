import { EditorState } from "prosemirror-state";
import { DispatchTransaction } from "../Editor";
import Action from "./Action";
export declare type Command = (state: EditorState, dispatch?: DispatchTransaction) => boolean;
export interface Actions {
    [key: string]: Action;
}
declare const actions: Actions;
export default actions;
