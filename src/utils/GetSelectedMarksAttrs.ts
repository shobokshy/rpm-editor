import { EditorState } from "prosemirror-state";
import { MarkType, Mark } from "prosemirror-model";

/**
 * Get the attributes of all selected marks of a given type
 * @param state Current Editor State
 * @param type Type of schema mark
 * @returns an array of attributes
 */
export default function (state: EditorState, type: MarkType): { [key: string]: any; }[] {
    const selection  = state.selection;
    let marks: Mark[] = [];

    if (selection.empty) {
        marks = selection.$from.marks().filter(m => m.type === type);
    } else {
        state.doc.nodesBetween(selection.from, selection.to, node => {
            marks = node.marks.filter(m => m.type === type);
        });
    }
    
    return marks.map(mark => {
        return mark.attrs
    });
}