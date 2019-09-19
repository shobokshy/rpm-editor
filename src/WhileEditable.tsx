import * as React from "react";
import { EditorView } from "prosemirror-view";
import { editableStatePluginKey } from "./plugins/EditableState";

export interface WhileEditableContext {
    editable: boolean
}

interface WhileEditableProps {
    children: React.ReactElement
    view: EditorView
}

export const WhileEditable: React.SFC<WhileEditableProps> = (props) => {

    //@ts-ignore
    const [editable, setEditable] = React.useState<boolean>(props.view.editable);
    const [pluginState, setPluginState] = React.useState();

    React.useEffect(() => {
        const editableStatePlugin = editableStatePluginKey.get(props.view.state);
        if(editableStatePlugin) {
            const pluginState = editableStatePlugin.getState(props.view.state);
            setPluginState(pluginState);

            pluginState.editableDispatcher.on((state: boolean) => {
                setEditable(state);
            })
        }

        return () => {
            if(pluginState) pluginState.unsubscribe();
        }
        
    }, [])


    return (
        <React.Fragment>
            {React.cloneElement(props.children, {editable: editable})}
        </React.Fragment>
    )
}