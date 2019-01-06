import * as React from 'react';
import { Transaction, EditorState } from "prosemirror-state";
import { EditorView } from 'prosemirror-view';
import { DispatchTransaction } from './Editor';



interface IComponentProps {
    editorState: EditorState,
    dispatchTransaction: DispatchTransaction,
    editable: boolean
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
            this.state.editorView.updateState(this.props.editorState);
            this.focus();
        }
    }

    private createEditorView(): void {
        this.setState({
            editorView: new EditorView(
                this.state.editorRef.current,
                {
                    state: this.props.editorState,
                    dispatchTransaction: this.dispatchTransaction.bind(this),
                    editable: () => this.props.editable
                }
            )
        })
    }

    // dispatch transaction function from parent
    // send new transactions coming from view to parent
    private dispatchTransaction(tr: Transaction) {
        this.props.dispatchTransaction(tr);
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

export {
    View
}