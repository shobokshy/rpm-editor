import { EditorState, Transaction } from 'prosemirror-state';
import * as React from 'react';
import { EditorMethods } from './UI';
import { EditorView } from 'prosemirror-view';
interface IComponentState {
    editorState: EditorState;
    editorView: React.RefObject<EditorView>;
    renderView: boolean;
}
interface IComponentProps {
    editable: boolean;
    className?: string;
    children: (editorFunctions: EditorMethods) => React.ReactNode;
}
/**
 * A function that takes a transaction as an input and applies that transaction to the editor's state
 */
export declare type DispatchTransaction = (tr: Transaction) => void;
declare class Editor extends React.Component<IComponentProps, IComponentState> {
    constructor(props: IComponentProps);
    private createEditorState;
    /**
     * Update current editor state with a new transaction
     * @param tr Prosemirror Transaction
     */
    private dispatchTransaction;
    /**
     * Get actions and enrich them with editor state & dispatch function on new state
     * @param editorState Editor's current state
     * @param dispatch a dispatch function that takes a transaction
     */
    private getActions;
    private focus;
    render(): JSX.Element;
}
export { Editor };
