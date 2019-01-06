import { nodes } from 'prosemirror-schema-basic';
import { orderedList, bulletList, listItem } from 'prosemirror-schema-list';
import { tableNodes } from 'prosemirror-tables';
import { NodeSpec } from 'prosemirror-model';


const listNodes: {
        ordered_list: NodeSpec,
        bullet_list: NodeSpec,
        list_item: NodeSpec
    } = {
    ordered_list: {
        ...orderedList,
        //content: 'list_item+',
        group: 'block'
    },
    bullet_list: {
        ...bulletList,
        content: 'list_item+',
        group: 'block'
    },
    list_item: {
        ...listItem,
        content: 'paragraph block*',
        group: 'block'
    }
}

export default {
  ...nodes,
  ...listNodes,
  // @ts-ignore
  ...tableNodes({
    tableGroup: 'block',
    cellContent: 'block+',
  })
}