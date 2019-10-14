import { EditorState, Transaction, Plugin } from 'prosemirror-state';
import { Node } from 'prosemirror-model';
import * as React from 'react';
import { Actions } from './actions/BuiltInActions';
import Plugins, { PluginConfig } from './plugins';
import { Schema } from 'prosemirror-model';
import { enrichActions } from './utils/EnrichActions';
import * as collab from "prosemirror-collab";
import { EditorContext, DispatchTransaction } from './Types';
import { InputRule } from 'prosemirror-inputrules';

require('./Editor.css');

export interface EditorProps {
	id: string | number,
	className?: string,
	children?: React.ReactNode,

	document?: Node,
	editable: boolean,
	actions: Actions,
	plugins?: (pluginConfig: PluginConfig) => Plugin[],
	inputRules?: InputRule[],
	schema: Schema,
	debug?: boolean,
	collabVersion?: number
}

/**
 * Editor's context which allows for different editor components to share state & methods
 */
export const ReactEditorContext = React.createContext<EditorContext | null>(null);

export const Editor: React.SFC<EditorProps> = (props) => {

	const [editorState, setEditorState] = React.useState<EditorState>();

	React.useEffect(() => {
		createEditorState();
	}, [props.id])

	/**
	 * Get actions and enrich them with editor state & dispatch function on new state
	 * @param editorState Editor's current state
	 * @param dispatch a dispatch function that takes a transaction
	 */
	const getActions = (editorState?: EditorState, dispatch?: DispatchTransaction): Actions => {
		if (editorState && dispatch) {
			return enrichActions(props.actions, editorState, dispatch);
		} else {
			return props.actions;
		}
	}

	/**
	 * Gets an array of builtin plugins and user provided plugins
	 * @returns an array of plugins
	 */
	const getPlugins = (): Plugin[] => {
		const plugins: Plugin[] = [];
		const userPlugins = props.plugins;

		if (userPlugins) plugins.push(...userPlugins({
			schema: props.schema,
			dispatchTransaction: dispatchTransaction,
			actions: getActions(),
			editable: props.editable,
			inputRules: props.inputRules
		}));

		plugins.push(...Plugins({
			schema: props.schema,
			dispatchTransaction: dispatchTransaction,
			actions: getActions(),
			editable: props.editable,
			inputRules: props.inputRules
		}));

		plugins.push(
			collab.collab({
				version: props.collabVersion || 0
			})
		)

		return plugins;
	}

	/**
	 * Create a new state for Prosemirror
	 */
	const createEditorState = () => {
		setEditorState(
			EditorState.create({
				schema: props.schema,
				doc: props.document,
				plugins: getPlugins()
			})
		)
	}

	/**
	 * Update current editor state with a new transaction
	 * @param tr Prosemirror Transaction
	 */
	const dispatchTransaction = (tr: Transaction): void => {
		setEditorState(state => state ? state.apply(tr) : undefined);
	}
	
	return (
		<React.Fragment>
			{editorState && (
				<div className={props.className ? props.className : "rpm-editor"}>
					<ReactEditorContext.Provider
						value={{
							id: props.id,
							editorState: editorState,
							dispatchTransaction: dispatchTransaction,
							editable: props.editable,
							actions: getActions(editorState, dispatchTransaction),
							debug: props.debug
						}}
					>
						{props.children}
					</ReactEditorContext.Provider>
				</div>
			)}
		</React.Fragment>
	);
}