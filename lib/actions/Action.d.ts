import { NodeType, MarkType } from "prosemirror-model";
import { EditorState } from "prosemirror-state";
import { DispatchTransaction } from "../Editor";
export declare type Command = (state: EditorState, dispatch?: DispatchTransaction) => boolean;
interface Spec {
    command: (...args: any) => Command;
    type?: NodeType | MarkType;
}
/**
 * A class that defines what an Action is.
 * An action is any event that affects the editor's state.
 * Each action should at least contain a command (Prosemirror Command)
 * if given a type, it can determine if it is active
 */
export default class Action {
    private spec;
    private editorState?;
    private dispatch?;
    constructor(spec: Spec);
    /**
     * Get the schema type this action affects. Could be a node or a mark
     * @returns undefined if this action doesn't affect any specific node/mark. Like undo,redo and chainCommands
     */
    readonly getType: NodeType | MarkType | undefined;
    /**
     * Get the underlying ProseMirror command
     */
    readonly getCommand: (...args: any) => Command;
    /**
    * Add the current editor state and dispatch transaction.
    * This is needed if the action needs to be executed
    */
    addStateAndDispatch(editorState: EditorState, dispatch: DispatchTransaction): void;
    /**
     * Execute this action using the underlying command
     * @param attrs is any attributes required by the underlying command if any
     * @returns true if succesfull, otherwise false
     */
    execute(attrs?: object): boolean;
    /**
     * Check if this action is available at the current editor state
     * @param attrs is any attributes required by the underlying command if any
     * @returns true if disabled
     */
    isDisabled(attrs?: object): boolean;
    /**
     * Check if this action is currently applied at current editor selection.
     * Requires that this action has a type associated with it (Node or Mark).
     * @param attrs is any attributes required by the underlying command if any
     * @returns true if active
     */
    isAcitve(attrs?: object): boolean;
}
export {};
