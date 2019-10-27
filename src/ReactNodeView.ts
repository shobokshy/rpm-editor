import * as React from 'react';
import * as ReactDOM from "react-dom";
import { NodeView, EditorView } from "prosemirror-view";
import { Node } from "prosemirror-model";
import { DispatchTransaction } from "./Types";
import { PluginConfig } from './plugins';

// Create UUID.
// Warning! This is not a compliant UUID. It is just used for html unique IDs
const generateUUID = (): string => {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

export class ReactNodeView implements NodeView {
    dom: HTMLElement;
    attrs?: any;
    private readonly key: string;
    readonly view: EditorView;
    node: Node;
    readonly pluginConfig: PluginConfig;
    readonly getPos: () => number;

    constructor(
        key: string,
        node: Node,
        view: EditorView<any>,
        pluginConfig: PluginConfig,
        getPos: () => number,
        attrs?: any
    ) {
        this.key = key;
        this.node = node;
        this.view = view;
        this.pluginConfig = pluginConfig;
        this.getPos = getPos;
        this.attrs = attrs;

        this.init();
    }

    private init() {
        const dom = this.createDOMElement();
        dom.classList.add('node-view');
        dom.id = `${this.key}_${generateUUID()}`;
        this.dom = dom;
        this.renderReactComponent();
    }

    update(node: Node): boolean {
        this.node = node;
        this.renderReactComponent();
        return true;
    }

    destroy() {
        ReactDOM.unmountComponentAtNode(this.dom)
    }

    ignoreMutation(): boolean {
        return true;
    }

    /**
     * Update this view's attributes. This will trigger a re-render for the react component
     * @param attrs An attrs object which will be passed to the reactComponent() method
     */
    updateAttrs(attrs: any) {
        this.attrs = attrs;
        this.renderReactComponent()
    }

    /**
     * Method that is used to create the DOM element where the react component is going to sit in.
     */
    createDOMElement(): HTMLElement {
        throw new Error('not implemented');
    }

    /**
     * Method that returns a react component that will be used to render
     */
    reactComponent(attrs?: any): React.ReactElement {
        throw new Error('not implemented');
    }

    private renderReactComponent(): void {
        ReactDOM.render(this.reactComponent(this.attrs), this.dom);
    }
}