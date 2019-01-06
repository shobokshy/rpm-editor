import { EditorState } from "prosemirror-state";
import { NodeType } from "prosemirror-model";
import { findParentNode } from "prosemirror-utils";

/**
 * Check if the given node type is active at the current editor selection
 * @param state Current Editor State
 * @param type Type of schema node
 * @returns true if active
 */
export default function(state: EditorState, type: NodeType): boolean {
    const node = findParentNode(node => node.type === type)(state.selection);
    if(node) return true;
    return false;
}