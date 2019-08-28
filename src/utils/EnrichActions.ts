import { Actions } from "..";
import { EditorState } from "prosemirror-state";
import { DispatchTransaction } from "../Editor";

export const enrichActions = (actions: Actions, state: EditorState, dispatch: DispatchTransaction) => {
    Object.keys(actions).forEach((action: string) => {
        actions[action].addStateAndDispatch(state, dispatch)
    });

    return actions;
}