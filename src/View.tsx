import * as React from 'react';
import { EditorView, DirectEditorProps } from 'prosemirror-view';
import { withEditorContext } from './EditorContextHOC';
import { EditorContext } from './Types';
import applyDevTools from "prosemirror-dev-tools"
import { editableStatePluginKey } from './plugins/EditableState';

interface ViewProps extends EditorContext {
    className?: string
}

const View: React.SFC<ViewProps> = (props) => {

    const editorViewDOMRef = React.useRef<any>();
    const [editorView, setEditorView] = React.useState<EditorView>();

    React.useEffect(() => {
        createEditorView();
        return () => {
            destroy();
        }
    }, []);

    React.useLayoutEffect(() => {
        if (editorView) editorView.updateState(props.editorState);
        focus();
    }, [props.editorState])

    React.useEffect(() => {
        reconfigureEditorView();
        broadcastIsEditable();
        focus();
    }, [props.editable])

    React.useEffect(() => {
        if (props.debug && editorView) applyDevTools(editorView);
    }, [editorView])

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

    const broadcastIsEditable = () => {
        if(editorView) {
            const tr = editorView.state.tr.setMeta(editableStatePluginKey, props.editable);
            props.dispatchTransaction(tr);
        }
    }

    const reconfigureEditorView = () => {
        if (editorView) editorView.setProps({
            editable: () => props.editable
        } as any);
    }

    // Focus cursor to editor view
    const focus = () => {
        if (editorView && !editorView.hasFocus()) editorView.focus();
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