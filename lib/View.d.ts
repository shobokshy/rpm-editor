import * as React from 'react';
import { EditorState } from "prosemirror-state";
import { EditorView } from 'prosemirror-view';
import { DispatchTransaction } from './Editor';
interface IComponentProps {
    editorState: EditorState;
    dispatchTransaction: DispatchTransaction;
    editable: boolean;
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
    render(): JSX.Element;
}
export { View };
