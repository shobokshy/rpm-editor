import { Command } from "prosemirror-commands";
import { MarkType, NodeType } from "prosemirror-model";
import { EditorState } from "prosemirror-state";
import { DispatchTransaction } from "../Types";
import GetSelectedMarksAttrs from "../utils/GetSelectedMarksAttrs";
import MarkIsActive from "../utils/MarkIsActive";
import NodeIsActive from "../utils/NodeIsActive";
import Shortcut from "./Shortcut";

interface Spec {
    command: (...args: any) => Command,
    type?: NodeType | MarkType | (NodeType | MarkType)[],
    shortcuts?: Shortcut[] | ((state: EditorState) => Shortcut[]),
    name?: string
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
    get getType(): NodeType | MarkType | (NodeType | MarkType)[] | undefined {
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
     * @returns array of string shortcuts or an empty array if not any
     */
    get getShortcuts(): Shortcut[] {
        if(this.spec.shortcuts) {
            if (this.spec.shortcuts instanceof Array) {
                return this.spec.shortcuts
            } else {
                if (this.editorState)
                    return this.spec.shortcuts(this.editorState)
                else return [];
            }
        }
        return [];
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
    public execute(attrs?: any): boolean {
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
    public isDisabled(attrs?: any): boolean {
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
    public isActive(attrs?: any): boolean {
        const self = this;
        if(this.editorState) {
            if(this.getType instanceof NodeType) return NodeIsActive(this.editorState, this.getType, attrs);
            if(this.getType instanceof MarkType) return MarkIsActive(this.editorState, this.getType);

            if(this.getType instanceof Array) {
                const activeArray: boolean[] = [];
                this.getType.forEach(type => {
                    if (this.editorState) {
                        if (type instanceof NodeType) activeArray.push(NodeIsActive(this.editorState, type, attrs))
                        if (type instanceof MarkType) activeArray.push(MarkIsActive(this.editorState, type))
                    }   
                })

                return activeArray.some(active => active === true);
            }
            return false
        } else {
            return false
        }
    }

    /**
     * Get the attributes of this action that are applied at current editor selection.
     * Requires that this action has a type associated with it of Mark
     * @returns an array of attributes
     */
    public getSelectedAttributes(): { [key: string]: any; }[] {
        if (this.editorState) {
            if (this.getType instanceof MarkType) return GetSelectedMarksAttrs(this.editorState, this.getType)
            return []
        } else {
            return []
        }
    }
}