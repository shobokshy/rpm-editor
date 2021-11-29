import * as React from 'react';
import { EditorContext } from './Types';

export const Context = React.createContext<EditorContext | null>(null);

export const useEditor = () => {
    return React.useContext(Context);
}

interface EditorContextProviderProps {
    value: EditorContext,
    children: React.ReactElement
}

export const EditorContextProvider: React.FC<EditorContextProviderProps> = React.memo((props) => {
    return (
        <Context.Provider value={props.value}>
            {props.children}
        </Context.Provider>
    )
}, (a,b) => a.children === b.children);