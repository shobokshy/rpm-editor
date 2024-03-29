import * as React from 'react';
import { Context } from './EditorConextProvider';
import { EditorContext } from './Types';

/**
 * HOC Typescript implementation copied from:
 * https://stackoverflow.com/questions/50612299/react-typescript-consuming-context-via-hoc
 * 
 */

/**
 * Injects a React component with the editor's context as a prop called editorContext
 * @param Component a React component
 */
export function withEditorContext<P extends EditorContext>(Component: React.ComponentType<P>) {
    return function ComponentWithEditorContext(props: Pick<P, Exclude<keyof P, keyof EditorContext>>) {
        return (
            <Context.Consumer>
                {context => <Component {...props as P} {...context} />}
            </Context.Consumer>
        );
    };
}