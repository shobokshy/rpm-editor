import * as React from 'react';
import { EditorContext, StepsInfo } from './Types';
import * as collab from "prosemirror-collab";
import { withEditorContext } from './EditorContextHOC';
import { Step } from 'prosemirror-transform';
import { Transaction, EditorState } from 'prosemirror-state';
import { Schema } from 'prosemirror-model';

export interface CollabManagerConfig {
    onIncomingSteps: (cb: () => void) => void;
    onSendableSteps: (id: string | number, sendableSteps: { version: number, steps: Step < any > [], clientId: string | number, origins: Transaction < any > [] }) => void;
    getNewSteps: (id: string | number, version: number, schema: Schema, cb: (steps: StepsInfo) => void) => void;
}

interface CollabManagerComponentProps extends EditorContext {
    config: CollabManagerConfig
}

const CollabManagerComponent: React.FC<CollabManagerComponentProps> = (props) => {

    const editorState = React.useRef<EditorState>(props.editorState);

    React.useEffect(() => {
        listenForSteps();
    }, [])

    React.useEffect(() => {
        getSendableSteps();
    }, [props.editorState])

    React.useLayoutEffect(() => {
        editorState.current = props.editorState;
    })

    const listenForSteps = () => {
        let requestedVersion = -1;

        props.config.onIncomingSteps(() => {
            const currentVersion = collab.getVersion(editorState.current);

            if(currentVersion > requestedVersion) {
                requestedVersion = currentVersion;

                props.config.getNewSteps(props.id, currentVersion, props.editorState.schema, (incomingSteps) => {
                    props.dispatchTransaction(
                        collab.receiveTransaction(editorState.current, incomingSteps.steps, incomingSteps.clientIds)
                    )
                })
            }
        })
    }

    const getSendableSteps = () => {
        const sendable = collab.sendableSteps(props.editorState);

        if (sendable) props.config.onSendableSteps(props.id, {
            version: sendable.version,
            clientId: sendable.clientID,
            steps: sendable.steps,
            origins: sendable.origins
        });
    }


    return null;
}

export const CollabManager = withEditorContext(CollabManagerComponent);