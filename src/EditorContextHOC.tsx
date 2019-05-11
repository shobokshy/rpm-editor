import * as React from 'react';
import { IEditorContext, EditorContext } from './Editor';

/**
 * HOC Typescript implementation copied from:
 * https://stackoverflow.com/questions/50612299/react-typescript-consuming-context-via-hoc
 * 
 */



export interface IEditorProps {
    editorContext: IEditorContext
}

/**
 * Injects a React component with the editor's context as a prop called editorContext
 * @param Component a React component
 */
export default function withEditorContext<P extends IEditorProps>(Component: React.ComponentType<P>) {
    return function ComponentWithEditorContext(props: Pick<P, Exclude<keyof P, keyof IEditorProps>>) {
        return (
            <EditorContext.Consumer>
                {context => <Component {...props as P} editorContext={context} />}
            </EditorContext.Consumer>
        );
    };
}