import * as React from 'react';
import { Transaction } from "prosemirror-state";
import { EditorView } from 'prosemirror-view';
import { EditorContext } from './Editor';



interface IComponentProps {

}

interface IComponentState {
    editorView?: EditorView,
    editorRef: React.RefObject<any>
}

class View extends React.Component<IComponentProps,IComponentState> {
    constructor(props: IComponentProps) {
        super(props)
        this.state = {
            editorView: undefined,
            editorRef: React.createRef()
        }
    }

    componentDidMount() {
        this.createEditorView();
    }

    // on new state from parent, update the view with that state
    componentDidUpdate(prevProps: IComponentProps) {
        if(this.state.editorView) {
            this.state.editorView.updateState(this.context.editorState);
            this.focus();
        }
    }

    private createEditorView(): void {
        this.setState({
            editorView: new EditorView(
                this.state.editorRef.current,
                {
                    state: this.context.editorState,
                    dispatchTransaction: this.dispatchTransaction.bind(this),
                    editable: () => this.context.editable
                }
            )
        })
    }

    // dispatch transaction function from parent
    // send new transactions coming from view to parent
    private dispatchTransaction(tr: Transaction) {
        this.context.dispatchTransaction(tr);
    }

    // Focus cursor to editor view
    public focus() {
        if(this.state.editorView) this.state.editorView.focus();
    }

    // clean up on un mount
    public componentWillUnmount() {
        if(this.state.editorView) this.state.editorView.destroy();
    }

    render() {
        return (
            <div ref={this.state.editorRef} />
        );
    }
}

// Subscribe to the editor's context
View.contextType = EditorContext;

export default View;