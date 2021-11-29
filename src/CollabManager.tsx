import * as React from 'react';
import { EditorContext, StepsInfo, Committed } from './Types';
import * as collab from "prosemirror-collab";
import { withEditorContext } from './EditorContextHOC';
import { Step } from 'prosemirror-transform';
import { Transaction, EditorState } from 'prosemirror-state';
import { Schema } from 'prosemirror-model';
import { Mutex } from 'async-mutex';
import throttle = require('lodash.throttle');

export interface CollabManagerConfig {
    onIncomingSteps: (cb: (steps?: StepsInfo) => void) => void;
    onSendableSteps: (
        id: string | number,
        schema: Schema,
        sendableSteps: { version: number, steps: Step<any>[], clientId: string | number, origins?: Transaction<any>[] },
        acknowledged: (committed: Committed) => void
    ) => void;
    getNewSteps: (id: string | number, version: number, schema: Schema, cb: (steps: StepsInfo) => void) => void;
    onConnectionDrop: (cb: () => void) => void;
    onConnectionReturn: (cb: () => void) => void;
}

interface CollabManagerComponentProps extends EditorContext {
    config: CollabManagerConfig,
    throttleWait?: number
}

const CollabManagerComponent: React.FC<CollabManagerComponentProps> = (props) => {

    const editorState = React.useRef<EditorState>(props.editorState);
    const recieveLock = React.useRef(new Mutex());
    const sendLock = React.useRef(new Mutex());
    const sendThrottled = React.useRef(throttle(() => {
        sendSteps()
    }, props.throttleWait || 1000)
    );
    const getThrottled = React.useRef(throttle(() => {
        getSteps()
    }, props.throttleWait || 1000)
    );

    React.useEffect(() => {
        listenForSteps();

        return () => {
            sendSteps()
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
        trySendSteps();
    }, [props.editorState]);

    const listenForSteps = () => {

        props.config.onIncomingSteps((incoming) => {
            if (incoming) {
                receiveTransaction(incoming);
            } else {
                tryGetSteps();
            }
        });

        props.config.onConnectionReturn(() => {
            sendSteps();
        });
    }

    const getSteps = () => {
        recieveLock.current.acquire().then(release => {
            setTimeout(() => release(), 5000);

            const currentVersion = collab.getVersion(editorState.current);
            props.config.getNewSteps(props.id, currentVersion, props.editorState.schema, (incomingSteps) => {
                receiveTransaction(incomingSteps);
                release();
            });
        })
    }

    const sendSteps = () => {
        sendLock.current.acquire().then(release => {
            setTimeout(() => release(), 5000);

            const sendable = collab.sendableSteps(editorState.current);

            if (sendable) {
                props.config.onSendableSteps(props.id, props.editorState.schema, {
                    version: sendable.version,
                    clientId: sendable.clientID,
                    steps: sendable.steps
                }, (acknowledged: Committed) => {
                    if (acknowledged.committed === true) {
                        if (acknowledged.data) receiveTransaction(acknowledged.data);
                        release();
                    } else {
                        tryGetSteps();
                        release();
                    }
                });
            } else {
                release();
            }
        })
    }

    const trySendSteps = () => {
        sendThrottled.current();
    }

    const tryGetSteps = () => {
        getThrottled.current();
    }

    const receiveTransaction = (data: StepsInfo) => {

        const currentVersion = collab.getVersion(editorState.current);
        if (data.version! > currentVersion) {
            const tr = collab.receiveTransaction(
                editorState.current,
                data.steps,
                data.clientIds
            )
            props.dispatchTransaction(tr);
        }
    }

    return null;
}

export const CollabManager = withEditorContext(CollabManagerComponent);