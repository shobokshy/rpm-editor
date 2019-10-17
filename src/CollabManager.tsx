import * as React from 'react';
import { EditorContext, StepsInfo } from './Types';
import * as collab from "prosemirror-collab";
import { withEditorContext } from './EditorContextHOC';
import { Step } from 'prosemirror-transform';
import { Transaction, EditorState } from 'prosemirror-state';
import { Schema } from 'prosemirror-model';
import throttle = require('lodash.throttle');

export interface CollabManagerConfig {
    onIncomingSteps: (cb: () => void) => void;
    onSendableSteps: (id: string | number, sendableSteps: { version: number, steps: Step < any > [], clientId: string | number, origins?: Transaction < any > [] }) => void;
    getNewSteps: (id: string | number, version: number, schema: Schema, cb: (steps: StepsInfo) => void) => void;
}

interface CollabManagerComponentProps extends EditorContext {
    config: CollabManagerConfig,
    throttleWait?: number
}

const CollabManagerComponent: React.FC<CollabManagerComponentProps> = (props) => {

    const editorState = React.useRef<EditorState>(props.editorState);
    const sendThrottled = React.useRef(throttle(() => {
            sendSteps()
        }, props.throttleWait || 1000)
    );

    React.useEffect(() => {
        listenForSteps();

        return () => {
            getSendableSteps(true)
        }
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

    const sendSteps = () => {
        const sendable = collab.sendableSteps(editorState.current);

        if (sendable) props.config.onSendableSteps(props.id, {
            version: sendable.version,
            clientId: sendable.clientID,
            steps: sendable.steps
        });
    }

    const getSendableSteps = (unthrottled?: boolean) => {
        if (unthrottled) {
            sendSteps();
        } else {
            sendThrottled.current();
        }
    }


    return null;
}

export const CollabManager = withEditorContext(CollabManagerComponent);