import { PluginConfig } from ".";
import { Plugin, PluginKey, Transaction } from "prosemirror-state";
import { EditableStateDispatcher } from "../EditableStateDispatcher";

interface EditableStateReturn {
    editable: boolean,
    editableDispatcher: EditableStateDispatcher
}

export const editableStatePluginKey = new PluginKey('EditableStatePlugin')

export const EditableState = (pluginConfig: PluginConfig) => {
    return new Plugin({
        key: editableStatePluginKey,
        state: {
            init: (): EditableStateReturn => {
                return {
                    editable: pluginConfig.editable,
                    editableDispatcher: new EditableStateDispatcher()
                }
            },
            apply(tr: Transaction, oldState: EditableStateReturn) {
                const newState = tr.getMeta(editableStatePluginKey);
                if(newState != undefined) {
                    oldState.editableDispatcher.set(newState);
                    return {
                        editable: newState,
                        editableDispatcher: oldState.editableDispatcher
                    }
                } else {
                    return oldState;
                }
            }
        }
    })
}