import * as React from 'react';
import { EditorContext, StepsInfo } from './Types';
import * as collab from "prosemirror-collab";
import { withEditorContext } from './EditorContextHOC';
import { Step } from 'prosemirror-transform';
import { Transaction, EditorState } from 'prosemirror-state';
import { Schema } from 'prosemirror-model';
import throttle = require('lodash.throttle');

export interface CollabManagerConfig {
    onIncomingSteps: (cb: (steps?: StepsInfo) => void) => void;
    onSendableSteps: (
        id: string | number, 
        sendableSteps: { version: number, steps: Step < any > [], clientId: string | number, origins?: Transaction < any > [] },
        acknowledged: (steps: StepsInfo) => void
    ) => void;
    getNewSteps: (id: string | number, version: number, schema: Schema, cb: (steps: StepsInfo) => void) => void;
    onConnectionDrop: (cb: () => void) => void;
}

interface CollabManagerComponentProps extends EditorContext {
    config: CollabManagerConfig,
    throttleWait?: number
}

const CollabManagerComponent: React.FC<CollabManagerComponentProps> = (props) => {

    const editorState = React.useRef<EditorState>(props.editorState);
    const savedVersion = React.useRef<number>(-1);
    const waitingForAck = React.useRef<boolean>(false);
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

    // React.useEffect(() => {
    //     window.onbeforeunload = () => {
    //         getSendableSteps(true);
    //         const sendable = collab.sendableSteps(editorState.current);
    //         console.log(sendable);
    //         if (sendable && sendable.steps.length > 0) return "You have unsaved content! Are you sure you want to leave?";
    //     }

    //     return () => {
    //         window.onbeforeunload = null;
    //     }
    // }, [])

    React.useLayoutEffect(() => {
        editorState.current = props.editorState;
        getSendableSteps(false);
    }, [props.editorState.doc]);

    const listenForSteps = () => {

        props.config.onIncomingSteps((incoming) => {
            const currentVersion = collab.getVersion(editorState.current);

            if (incoming) {
                receiveTransaction(incoming);
            } else {
                props.config.getNewSteps(props.id, currentVersion, props.editorState.schema, (incomingSteps) => {
                    receiveTransaction(incomingSteps);
                })
            }
        });

        props.config.onConnectionDrop(() => {
            waitingForAck.current = false;
        });
    }

    const sendSteps = () => {
        const sendable = collab.sendableSteps(editorState.current);

        if (sendable && !waitingForAck.current) {
            waitingForAck.current = true;
            props.config.onSendableSteps(props.id, {
                version: sendable.version,
                clientId: sendable.clientID,
                steps: sendable.steps
            }, (acknowledged: StepsInfo) => {
                receiveTransaction(acknowledged);
                waitingForAck.current = false;
            });
        }
    }

    const getSendableSteps = (unthrottled?: boolean) => {
        if (unthrottled) {
            sendSteps();
        } else {
            sendThrottled.current();
        }
    }

    const receiveTransaction = (data: StepsInfo) => {
        if (data.version! > savedVersion.current) {
            props.dispatchTransaction(
                collab.receiveTransaction(
                    editorState.current,
                    data.steps,
                    data.clientIds
                )
            )
            savedVersion.current = data.version!;
        }
    }

    return null;
}

export const CollabManager = withEditorContext(CollabManagerComponent);