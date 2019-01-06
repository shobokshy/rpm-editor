import * as React from 'react';
import { EditorState } from "prosemirror-state";
import { DispatchTransaction } from './Editor';
import { Actions } from './actions/Index';
export interface EditorMethods {
    actions: Actions;
    editorState: EditorState;
    dispatchTransaction: DispatchTransaction;
}
interface IComponentProps {
    editorState: EditorState;
    dispatchTransaction: DispatchTransaction;
    editable: boolean;
    children: (editorFunctions: EditorMethods) => React.ReactNode;
    actions: Actions;
}
interface IComponentState {
}
declare class UI extends React.Component<IComponentProps, IComponentState> {
    constructor(props: IComponentProps);
    componentDidUpdate(): void;
    render(): JSX.Element;
}
export { UI };
