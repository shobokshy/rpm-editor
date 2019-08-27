import { EditorState, Transaction } from 'prosemirror-state';
import * as React from 'react';
import { Actions } from './actions/BuiltInActions';
import Plugins from './plugins';
import { EditorView } from 'prosemirror-view';
import { Schema } from 'prosemirror-model';

require('./Editor.css');

interface IComponentState {
	editorState: EditorState,
	editorView: React.RefObject<EditorView>
  	renderView: boolean
}

interface IComponentProps {
	editable: boolean,
	actions: Actions,
	schema: Schema,
	className?: string,
	children?: React.ReactNode
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
	constructor(props: IComponentProps) {
		super(props)
		this.state = {
			editorState: this.createEditorState(),
			editorView: React.createRef(),
			renderView: false,
		}
	}

	/**
	 * Create a new state for Prosemirror
	 */
	private createEditorState(): EditorState {
		return EditorState.create({
			schema: this.props.schema,
			doc: undefined,
			plugins: [
				...Plugins({
					schema: this.props.schema,
					dispatchTransaction: this.dispatchTransaction.bind(this),
					actions: this.getActions()
				})
			]
		});
	}

	/**
	 * Update current editor state with a new transaction
	 * @param tr Prosemirror Transaction
	 */
	private dispatchTransaction(tr: Transaction): void {
		this.setState({
			editorState: this.state.editorState.apply(tr)
		},
			// focus to the editor view on new transactions
			this.focus
		)
	}

	/**
	 * Get actions and enrich them with editor state & dispatch function on new state
	 * @param editorState Editor's current state
	 * @param dispatch a dispatch function that takes a transaction
	 */
	private getActions(editorState?: EditorState, dispatch?: DispatchTransaction): Actions {
		if(editorState && dispatch) {
			const actions = this.props.actions;
			Object.keys(actions).forEach((action: string) => {
				actions[action].addStateAndDispatch(editorState, dispatch)
			});

			return actions;
		} else {
			return this.props.actions;
		}
	}

	private focus() {
		if(this.state.editorView.current) this.state.editorView.current.focus();
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