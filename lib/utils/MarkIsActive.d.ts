import { EditorState } from "prosemirror-state";
import { MarkType } from "prosemirror-model";
/**
 * Check if the given mark type is active at the current editor selection
 * @param state Current Editor State
 * @param type Type of schema mark
 * @returns true if active
 */
export default function (state: EditorState, type: MarkType): boolean;
