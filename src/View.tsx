import * as React from 'react';
import { EditorView } from 'prosemirror-view';
import { withEditorContext } from './EditorContextHOC';
import { EditorContext } from './Types';


interface ViewProps extends EditorContext {
    className?: string
}

const View: React.SFC<ViewProps> = (props) => {

    const editorViewDOMRef = React.useRef<any>(null);
    const [editorView, setEditorView] = React.useState<EditorView>();

    React.useEffect(() => {

        createEditorView();

        return () => {
            destroy();
        }
    }, []);

    React.useEffect(() => {
        if(editorView) editorView.updateState(props.editorState);
        focus();
    }, [props.editorState])

    const createEditorView = () => {
        if (editorViewDOMRef) setEditorView(new EditorView(
            editorViewDOMRef.current,
            {
                state: props.editorState,
                dispatchTransaction: props.dispatchTransaction,
                editable: () => props.editable
            }
        ))
    } 

    // Focus cursor to editor view
    const focus = () => {
        if (editorView) editorView.focus();
    }

    // Destroy editor view
    const destroy = () => {
        if (editorView) editorView.destroy();
    }

    
    return (
        <div className={props.className} ref={editorViewDOMRef} />
    );
    
}


export const ViewWithContext = withEditorContext(View);