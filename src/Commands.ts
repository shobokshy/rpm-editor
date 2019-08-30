import { EditorState, Transaction } from "prosemirror-state";
import { createTable, safeInsert, addColumnAt, addRowAt, removeColumnAt, removeRowAt, removeTable } from "prosemirror-utils";

export const insertTable = ({columnCount = 3, rowCount = 3, withHeaderRow = true} : {columnCount?: number, rowCount?: number, withHeaderRow?: boolean} = {}) => {
    return (state: EditorState, dispatch?: (tr: Transaction) => void) => {
        if (dispatch) {
            const table = createTable(state.schema, rowCount, columnCount, withHeaderRow);
            dispatch(safeInsert(table)(state.tr).scrollIntoView());
        }
        return true;
    }
}

export const insertColumnAt = ({ index }: { index: number }) => {
    return (state: EditorState, dispatch?: (tr: Transaction) => void) => {
        if (dispatch) dispatch(addColumnAt(index)(state.tr));
        return true;
    }
}

export const insertRowAt = ({ index, clonePrevious = false }: { index: number, clonePrevious?: boolean }) => {
    return (state: EditorState, dispatch?: (tr: Transaction) => void) => {
        if (dispatch) dispatch(addRowAt(index, clonePrevious)(state.tr));
        return true;
    }
}

export const deleteColumnAt = ({ index }: { index: number }) => {
    return (state: EditorState, dispatch?: (tr: Transaction) => void) => {
        if (dispatch) dispatch(removeColumnAt(index)(state.tr));
        return true;
    }
}

export const deleteRowAt = ({ index }: { index: number }) => {
    return (state: EditorState, dispatch?: (tr: Transaction) => void) => {
        if (dispatch) dispatch(removeRowAt(index)(state.tr));
        return true;
    }
}

export const deleteTable = () => {
    return (state: EditorState, dispatch?: (tr: Transaction) => void) => {
        if (dispatch) dispatch(removeTable(state.tr));
        return true;
    }
}