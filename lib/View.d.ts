import * as React from 'react';
import { EditorView } from 'prosemirror-view';
interface IComponentProps {
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
export default View;
