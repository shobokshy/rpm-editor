import { NodeType, MarkType } from "prosemirror-model";
import { EditorState } from "prosemirror-state";
import { DispatchTransaction } from "../Editor";
import NodeIsActive from "../utils/NodeIsActive";
import MarkIsActive from "../utils/MarkIsActive";
import { FriendlyShortcutString } from "../utils/FriendlyShortcutString";

export type Command = (state: EditorState, dispatch?: DispatchTransaction) => boolean;

interface Spec {
    command: (...args: any) => Command
    type?: NodeType | MarkType,
    shortcuts?: Shortcut[],
    name?: string
}

export interface Shortcut {
    key: string,
    attrs?: object
}

export interface Actions {
    [key: string]: Action
}

/**
 * A class that defines what an Action is.
 * An action is any event that affects the editor's state.
 * Each action should at least contain a command (Prosemirror Command)
 * if given a type, it can determine if it is active
 */
export default class Action {
    private spec: Spec
    private editorState?: EditorState
    private dispatch?: DispatchTransaction

    constructor(spec: Spec) {
        this.spec = spec
    }

    /**
     * Get the schema type this action affects. Could be a node or a mark
     * @returns undefined if this action doesn't affect any specific node/mark. Like undo,redo and chainCommands
     */
    get getType(): NodeType | MarkType | undefined {
        return this.spec.type
    }

    /**
     * Get the underlying ProseMirror command
     */
    get getCommand(): (...args: any) => Command {
        return this.spec.command
    }

    /**
     * Get the action's name if available
     */
    get getName(): string | undefined {
        return this.spec.name
    }

    /**
     * Get the keyboard shortcuts if any for this action
     * @returns array of string shortcuts or undefined if no shortcut
     */
    get getShortcuts(): Shortcut[] {
        if(this.spec.shortcuts) return this.spec.shortcuts
        return [];
    }

    /**
     * Get first shortcut if any for this action
     * @returns a friendly string for UI purposes
     */
    public getShortcut(): string | undefined {
        const shortcut = this.spec.shortcuts ? this.spec.shortcuts[0] : undefined;
        if (shortcut) return FriendlyShortcutString(shortcut);
    }

    /** 
    * Add the current editor state and dispatch transaction.
    * This is needed if the action needs to be executed
    */
    public addStateAndDispatch(editorState: EditorState, dispatch: DispatchTransaction) {
        this.editorState = editorState
        this.dispatch = dispatch
    }

    /**
     * Execute this action using the underlying command
     * @param attrs is any attributes required by the underlying command if any
     * @returns true if succesfull, otherwise false
     */
    public execute(attrs?: object): boolean {
        if(this.editorState && this.dispatch) {
            return this.getCommand(attrs)(this.editorState, this.dispatch)
        } else {
            return false
        }
    }

    /**
     * Check if this action is available at the current editor state
     * @param attrs is any attributes required by the underlying command if any
     * @returns true if disabled
     */ 
    public isDisabled(attrs?: object): boolean {
        if(this.editorState) {
            return !this.getCommand(attrs)(this.editorState)
        } else {
            return true
        }
    }

    /**
     * Check if this action is currently applied at current editor selection.
     * Requires that this action has a type associated with it (Node or Mark).
     * @param attrs is any attributes required by the underlying command if any
     * @returns true if active
     */
    public isActive(attrs?: object): boolean {
        if(this.editorState) {
            if(this.getType instanceof NodeType) return NodeIsActive(this.editorState, this.getType)
            if(this.getType instanceof MarkType) return MarkIsActive(this.editorState, this.getType)
            return false
        } else {
            return false
        }
    }
}