import { EditorState, Transaction } from "prosemirror-state";
import { Actions } from "./actions/Action";
import { Step } from "prosemirror-transform";

/**
 * Interface for the editor's context
 */
export interface EditorContext {
    editorState: EditorState,
    dispatchTransaction: DispatchTransaction,
    actions: Actions,
    editable: boolean
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
export type DispatchTransaction = (tr: Transaction) => void