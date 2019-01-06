import * as React from 'react';
import { EditorState } from "prosemirror-state";
import { EditorView } from 'prosemirror-view';
import { DispatchTransaction } from './Editor';
import { Actions } from './actions/Index';
import { Command } from './actions/Action';
export interface EditorMethods {
    execute: (command: Command) => boolean;
    disabled: (command: Command) => boolean;
    active: (command: Command) => boolean;
    actions: Actions;
    x: number;
}
interface IComponentProps {
    editorState: EditorState;
    dispatchTransaction: DispatchTransaction;
    editable: boolean;
    children: (editorFunctions: EditorMethods) => React.ReactNode;
    actions: Actions;
}
interface IComponentState {
    editorView?: EditorView;
    editorRef: React.RefObject<any>;
}
declare class View extends React.Component<IComponentProps, IComponentState> {
    constructor(props: IComponentProps);
    componentDidMount(): void;
    componentDidUpdate(prevProps: IComponentProps): void;
    private createEditorView;
    private dispatchTransaction;
    focus(): void;
    componentWillUnmount(): void;
    execute(command: Command): boolean;
    disabled(command: Command): boolean;
    active(command: Command): boolean;
    render(): JSX.Element;
}
export { View };
