import { chainCommands, setBlockType, toggleMark, wrapIn } from "prosemirror-commands";
import { redo, undo } from "prosemirror-history";
import { wrapInList } from "prosemirror-schema-list";
import BuiltInSchema from '../schema';
import Action from "./Action";
import { Command } from "../Types";

export interface Actions {
    [key:string]: Action
}

/**
 * A keyed object that contains all actions 
 */
export const actions: Actions = {
    // Misc
    chainCommands: new Action({
        command: (...commands: Command[]) => {
            console.log(commands.length)
            //@ts-ignore
            return chainCommands(...commands)
        },
        name: 'Chain Commands'
    }),

    // Mark Commands
    bold: new Action({
        command: () => toggleMark(BuiltInSchema.marks.strong),
        type: BuiltInSchema.marks.strong,
        name: 'Bold'
    }),
    italic: new Action({
        command: () => toggleMark(BuiltInSchema.marks.em),
        type: BuiltInSchema.marks.em,
        name: 'Italic'
    }),
    code: new Action({
        command: () => toggleMark(BuiltInSchema.marks.code),
        type: BuiltInSchema.marks.code,
        name: 'Code'
    }),

    // Node Commands
    heading: new Action({
        command: (attrs) => setBlockType(BuiltInSchema.nodes.heading, { level: attrs.level }),
        type: BuiltInSchema.nodes.heading,
        name: 'Heading'
    }),
    paragraph: new Action({
        command: () => setBlockType(BuiltInSchema.nodes.paragraph),
        type: BuiltInSchema.nodes.paragraph,
        name: 'Paragraph'
    }),
    codeBlock: new Action({
        command: () => setBlockType(BuiltInSchema.nodes.code_block),
        type: BuiltInSchema.nodes.code_block,
        name: 'Code Block'
    }),
    bulletList: new Action({
        command: () => wrapInList(BuiltInSchema.nodes.bullet_list),
        type: BuiltInSchema.nodes.bullet_list,
        name: 'Bullet List'
    }),
    orderedList: new Action({
        command: () => wrapInList(BuiltInSchema.nodes.ordered_list),
        type: BuiltInSchema.nodes.ordered_list,
        name: 'Numbered List'
    }),
    blockquote: new Action({
        command: () => setBlockType(BuiltInSchema.nodes.blockquote),
        type: BuiltInSchema.nodes.blockquote,
        name: 'Block Quote'
    }),

    // History Commands
    undo: new Action({
        command: () => undo,
        name: 'Undo'
    }),
    redo: new Action({
        command: () => redo,
        name: 'Redo'
    }),
};