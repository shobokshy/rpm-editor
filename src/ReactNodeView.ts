import * as React from 'react';
import { NodeView, EditorView } from "prosemirror-view";
import { handleContentDOMRef } from "./Types";
import { Node } from "prosemirror-model";
import { PluginConfig } from './plugins';

export class ReactNodeView implements NodeView {
    dom: HTMLElement;
    contentDOM?: HTMLElement | null;
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
        this.dom = dom;
        this.contentDOM = this.createContentDOMElement();
        this.renderReactComponent();
    }

    public static generateId() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    }

    update(node: Node): boolean {
        if (node.type != this.node.type) return false;
        this.node = node;
        return true;
    }

    destroy() {
        this.pluginConfig.renderer.unmount(this.key);
        this.dom.remove();
    }

    ignoreMutation(record: MutationRecord | { type: "selection"; target: Element; }): boolean {
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
     * An optional method that is used to create the content DOM element where editor will render the schema into.
     */
    createContentDOMElement(): HTMLElement | undefined {
        return undefined;
    }

    /**
     * Method that returns a react component that will be used to render
     * @param attrs Attrs object created from updateAttrs or on init
     * @param handleContentDOMRef A react ref used to place contentDOM inside the react component
     */
    reactComponent(attrs?: any, handleContentDOMRef?: handleContentDOMRef): React.ReactElement {
        throw new Error('not implemented');
    }

    private renderReactComponent(): void {
        this.pluginConfig.renderer.render(this.key, this.reactComponent(this.attrs, (elem) => this.handleContentDOMRef(elem)), this.dom);
    }

    private handleContentDOMRef(node: HTMLElement | null) {
        if (node && this.contentDOM) node.appendChild(this.contentDOM);
    }
}