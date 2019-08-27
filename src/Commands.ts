import { EditorState, Transaction } from "prosemirror-state";
import { createTable, safeInsert } from "prosemirror-utils";

export const insertTable = ({columnCount = 3, rowCount = 3, withHeaderRow = true} : {columnCount?: number, rowCount?: number, withHeaderRow?: boolean} = {}) => {
    return (state: EditorState, dispatch?: (tr: Transaction) => void) => {
        if (dispatch) {
            const table = createTable(state.schema, rowCount, columnCount, withHeaderRow);
            dispatch(safeInsert(table)(state.tr).scrollIntoView());
        }
        return true;
    }
}