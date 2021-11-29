import { Schema } from "prosemirror-model";

/**
 * Make a server schema renderable by including the toDOM & parseDOM functions available in a client schema
 * 
 * @param serverSchema schema provided by server
 * @param clientSchema schema provided by client that includes toDOM & parseDOM
 * @returns A schema usable on the client
 */
export const makeRenderable = (serverSchema: Schema, clientSchema: Schema): Schema => {
    const {nodes, marks} = serverSchema;
    Object.keys(nodes).forEach((key) => {
        if (clientSchema.nodes[key] || clientSchema.nodes[key] !== clientSchema.topNodeType ) {
            nodes[key].spec.toDOM = clientSchema.nodes[key].spec.toDOM
            nodes[key].spec.parseDOM = clientSchema.nodes[key].spec.parseDOM
        }
    })

    Object.keys(marks).forEach((key) => {
        if (clientSchema.marks[key]) {
            marks[key].spec.toDOM = clientSchema.marks[key].spec.toDOM
            marks[key].spec.parseDOM = clientSchema.marks[key].spec.parseDOM
        }
    })

    return serverSchema;
}