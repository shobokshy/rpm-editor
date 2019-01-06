import { EditorState } from "prosemirror-state";
import { NodeType } from "prosemirror-model";
/**
 * Check if the given node type is active at the current editor selection
 * @param state Current Editor State
 * @param type Type of schema node
 * @returns true if active
 */
export default function (state: EditorState, type: NodeType): boolean;
