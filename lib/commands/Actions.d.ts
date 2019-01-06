import { Command } from "./Index";
import { NodeType, MarkType } from "prosemirror-model";
import { EditorState } from "prosemirror-state";
import { DispatchTransaction } from "../Editor";
interface Spec {
    command: (...args: any) => Command;
    type?: NodeType | MarkType;
    attrs?: object;
}
export default class Action {
    private spec;
    private editorState?;
    private dispatch?;
    constructor(spec: Spec, editorState?: EditorState, dispatch?: DispatchTransaction);
    readonly type: MarkType<any> | NodeType<any> | undefined;
    readonly attrs: object | undefined;
    readonly command: Command;
    execute(): boolean;
}
export {};
