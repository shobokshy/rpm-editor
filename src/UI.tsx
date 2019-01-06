import * as React from 'react';
import { EditorState } from "prosemirror-state";
import { DispatchTransaction } from './Editor';
import { Actions } from './actions/Index';

export interface EditorMethods {
    actions: Actions,
    editorState: EditorState
    dispatchTransaction: DispatchTransaction
}

interface IComponentProps {
    editorState: EditorState,
    dispatchTransaction: DispatchTransaction,
    editable: boolean,
    children: (editorFunctions: EditorMethods) => React.ReactNode,
    actions: Actions
}

interface IComponentState {
    
}

class UI extends React.Component<IComponentProps,IComponentState> {
    constructor(props: IComponentProps) {
        super(props)
    }

    componentDidUpdate() {
        console.log('update')
    }

    render() {
        return (
            <React.Fragment>
                {this.props.children({
                    actions: this.props.actions,
                    editorState: this.props.editorState,
                    dispatchTransaction: this.props.dispatchTransaction
                })}
            </React.Fragment>
        );
    }
}

export {
    UI
}