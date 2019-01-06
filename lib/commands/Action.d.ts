import { NodeType, MarkType } from "prosemirror-model";
import { EditorState } from "prosemirror-state";
import { DispatchTransaction } from "../Editor";
export declare type Command = (state: EditorState, dispatch?: DispatchTransaction) => boolean;
interface Spec {
    command: (...args: any) => Command;
    type?: NodeType | MarkType;
}
export default class Action {
    private spec;
    private editorState?;
    private dispatch?;
    constructor(spec: Spec);
    readonly getType: NodeType<any> | MarkType<any> | undefined;
    readonly getCommand: (...args: any) => Command;
    addStateAndDispatch(editorState: EditorState, dispatch: DispatchTransaction): void;
    execute(attrs?: object): boolean;
    isDisabled(attrs?: object): boolean;
    isAcitve(attrs?: object): boolean;
}
export {};
