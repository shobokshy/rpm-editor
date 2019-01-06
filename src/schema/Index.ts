import nodes from './Nodes';
import marks from './Marks';
import { Schema } from 'prosemirror-model';

const BuiltInSchema = new Schema({
  nodes: nodes,
  marks: marks
});

export default BuiltInSchema;