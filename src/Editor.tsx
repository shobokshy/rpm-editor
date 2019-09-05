import { EditorState, Transaction, Plugin } from 'prosemirror-state';
import { Node } from 'prosemirror-model';
import * as React from 'react';
import { Actions } from './actions/BuiltInActions';
import Plugins, { IPluginConfig } from './plugins';
import { EditorView } from 'prosemirror-view';
import { Schema } from 'prosemirror-model';
import { enrichActions } from './utils/EnrichActions';
import * as collab from "prosemirror-collab";
import { Step } from 'prosemirror-transform';

require('./Editor.css');

interface IComponentState {
	editorState: EditorState,
	editorView: React.RefObject<EditorView>
  	renderView: boolean
}

interface IComponentProps {
	document: Node,
	editable: boolean,
	actions: Actions,
	plugins?: (pluginConfig: IPluginConfig) => Plugin[]
	schema: Schema,
	className?: string,
	children?: React.ReactNode,
	collabOptions?: {
		version?: number,
		onNewSendableSteps: (sendableSteps: {version: number, steps: Step<any>[], clientID: string | number, origins: Transaction<any>[];}) => void
		setOnRecievedSteps: (onRecievedStepsFunction: (steps: Step[], clientIds: (number | string)[]) => void) => void
	}
	enableCollab?: boolean
	collabVersion?: number
}

/**
 * Interface for the editor's context
 */
interface IEditorContext {
	editorState: EditorState,
	dispatchTransaction: DispatchTransaction,
	actions: Actions,
	editable: boolean
}

/**
 * Editor's context which allows for different editor components to share state & methods
 */
const EditorContext = React.createContext<IEditorContext | null>(null);

/**
 * A function that takes a transaction as an input and applies that transaction to the editor's state
 */
type DispatchTransaction = (tr: Transaction) => void

class Editor extends React.Component<IComponentProps, IComponentState> {
	private readonly pluginUIContainer: HTMLElement = document.createElement('div');

	constructor(props: IComponentProps) {
		super(props)
		this.state = {
			editorState: this.createEditorState(),
			editorView: React.createRef(),
			renderView: false,
		}
	}

	componentDidMount() {
		if (this.props.collabOptions) this.props.collabOptions.setOnRecievedSteps(this.onNewSteps)
	}

	/**
	 * Create a new state for Prosemirror
	 */
	private createEditorState(): EditorState {
		return EditorState.create({
			schema: this.props.schema,
			doc: this.props.document,
			plugins: this.getPlugins()
		});
	}

	/**
	 * Update current editor state with a new transaction
	 * @param tr Prosemirror Transaction
	 */
	private dispatchTransaction(tr: Transaction): void {
		this.setState({
			editorState: this.state.editorState.apply(tr)
		}, () => {
			// focus to the editor view on new transactions
			this.focus,

			// Get new steps that can be sent to collab server
			this.getSendableSteps
		})
	}

	/**
	 * Gets an array of builtin plugins and user provided plugins
	 * @returns an array of plugins
	 */
	private getPlugins(): Plugin[] {
		const plugins: Plugin[] = [];
		const userPlugins = this.props.plugins;

		if (userPlugins) plugins.push(...userPlugins({
			schema: this.props.schema,
			dispatchTransaction: this.dispatchTransaction.bind(this),
			actions: this.getActions()
		}));

		plugins.push(...Plugins({
			schema: this.props.schema,
			dispatchTransaction: this.dispatchTransaction.bind(this),
			actions: this.getActions()
		}));

		if (this.props.enableCollab) plugins.push(
			collab.collab({
				version: this.props.collabVersion || 0
			})
		)

		return plugins;
	}

	/**
	 * Get actions and enrich them with editor state & dispatch function on new state
	 * @param editorState Editor's current state
	 * @param dispatch a dispatch function that takes a transaction
	 */
	private getActions(editorState?: EditorState, dispatch?: DispatchTransaction): Actions {
		if(editorState && dispatch) {
			return enrichActions(this.props.actions, editorState, dispatch);
		} else {
			return this.props.actions;
		}
	}

	private focus() {
		if(this.state.editorView.current) this.state.editorView.current.focus();
	}

	private getSendableSteps() {
		const sendable = collab.sendableSteps(this.state.editorState);
		if (this.props.collabOptions && sendable) this.props.collabOptions.onNewSendableSteps(sendable);
	}

	private onNewSteps(steps: Step[], clientIds: (number | string)[] ) {
		const self = this;
		this.dispatchTransaction(
			collab.receiveTransaction(self.state.editorState, steps, clientIds)
		);
		this.getSendableSteps()
	}

	public render() {
		return (
			<div className={this.props.className ? this.props.className : "rpm-editor"}>
				<EditorContext.Provider
					value={{
						editorState: this.state.editorState,
						dispatchTransaction: this.dispatchTransaction.bind(this),
						editable: this.props.editable,
						actions: this.getActions(this.state.editorState, this.dispatchTransaction.bind(this))
					}}
				>
					{this.props.children}
				</EditorContext.Provider>
			</div>
		);
	}
}

export default Editor;
export { DispatchTransaction, EditorContext, IEditorContext };