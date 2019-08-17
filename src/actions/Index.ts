import { chainCommands, setBlockType, toggleMark, wrapIn } from "prosemirror-commands";
import { redo, undo } from "prosemirror-history";
import { wrapInList } from "prosemirror-schema-list";
import BuiltInSchema from '../schema';
import Action, { Command } from "./Action";

export interface Actions {
    [key:string]: Action
}

/**
 * A keyed object that contains all actions 
 */
const actions: Actions = {
    // Misc
    chainCommands: new Action({
        command: (...commands: Command[]) => {
            console.log(commands.length)
            return chainCommands(...commands)
        }
    }),

    // Mark Commands
    bold: new Action({
        command: () => toggleMark(BuiltInSchema.marks.strong),
        type: BuiltInSchema.marks.strong
    }),
    italic: new Action({
        command: () => toggleMark(BuiltInSchema.marks.em),
        type: BuiltInSchema.marks.em
    }),
    code: new Action({
        command: () => toggleMark(BuiltInSchema.marks.code),
        type: BuiltInSchema.marks.code
    }),

    // Node Commands
    heading: new Action({
        command: (attrs) => setBlockType(BuiltInSchema.nodes.heading, { level: attrs.level }),
        type: BuiltInSchema.nodes.heading
    }),
    paragraph: new Action({
        command: () => setBlockType(BuiltInSchema.nodes.paragraph),
        type: BuiltInSchema.nodes.paragraph
    }),
    codeBlock: new Action({
        command: () => setBlockType(BuiltInSchema.nodes.code_block),
        type: BuiltInSchema.nodes.code_block
    }),
    bulletList: new Action({
        command: () => wrapInList(BuiltInSchema.nodes.bullet_list),
        type: BuiltInSchema.nodes.bullet_list
    }),
    orderedList: new Action({
        command: () => wrapInList(BuiltInSchema.nodes.ordered_list),
        type: BuiltInSchema.nodes.ordered_list
    }),
    blockquote: new Action({
        command: () => setBlockType(BuiltInSchema.nodes.blockquote),
        type: BuiltInSchema.nodes.blockquote
    }),

    // History Commands
    undo: new Action({
        command: () => undo
    }),
    redo: new Action({
        command: () => redo
    }),
};

export default actions;