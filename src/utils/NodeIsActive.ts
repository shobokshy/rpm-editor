import { EditorState } from "prosemirror-state";
import { NodeType } from "prosemirror-model";
import { findParentNode } from "prosemirror-utils";
import IsEqual from "./IsEqual";

/**
 * Check if the given node type is active at the current editor selection
 * @param state Current Editor State
 * @param type Type of schema node
 * @param attrs Optional Attrs to check
 * @returns true if active
 */
export default function(state: EditorState, type: NodeType, attrs?: any): boolean {
    const node = findParentNode(node => node.type === type)(state.selection);
    if(node) {
        if (!attrs) return true;
        const attrsFull = Object.assign({}, node.node.attrs, attrs);
        return IsEqual(node.node.attrs, attrsFull);
    }
    return false;
}