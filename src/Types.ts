import { EditorState, Transaction } from "prosemirror-state";
import Action from "./actions/Action";
import { Step } from "prosemirror-transform";

/**
 * Interface for the editor's context
 */
export interface EditorContext {
    id: string | number,
    editorState: EditorState,
    dispatchTransaction: DispatchTransaction,
    actions: Actions,
    editable: boolean,
    debug?: boolean
}

export interface StepsInfo {
    version?: number;
    steps: Step<any>[];
    clientIds: (string | number)[];
    origins?: Transaction<any>[];
}

/**
 * A function that takes a transaction as an input and applies that transaction to the editor's state
 */
export type DispatchTransaction = (tr: Transaction) => void;

export interface Actions {
    [key: string]: Action
}

export type Command = (state: EditorState, dispatch?: DispatchTransaction) => boolean;

export type handleContentDOMRef = (node: HTMLElement | null) => void