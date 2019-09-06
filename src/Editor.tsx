import { EditorState, Transaction, Plugin } from 'prosemirror-state';
import { Node } from 'prosemirror-model';
import * as React from 'react';
import { Actions } from './actions/BuiltInActions';
import Plugins, { IPluginConfig } from './plugins';
import { Schema } from 'prosemirror-model';
import { enrichActions } from './utils/EnrichActions';
import * as collab from "prosemirror-collab";
import { Step } from 'prosemirror-transform';
import { StepsInfo, EditorContext, DispatchTransaction } from './Types';

require('./Editor.css');

export interface EditorProps {
	className?: string,
	children?: React.ReactNode,

	document: Node,
	editable: boolean,
	actions: Actions,
	plugins?: (pluginConfig: IPluginConfig) => Plugin[]
	schema: Schema,
	debug?: boolean,
	
	collabOptions?: {
		version?: number,
		onNewSendableSteps: (sendableSteps: {version: number, steps: Step<any>[], clientID: string | number, origins: Transaction<any>[];}) => void
		incomingSteps?: StepsInfo
	}
}

/**
 * Editor's context which allows for different editor components to share state & methods
 */
export const ReactEditorContext = React.createContext<EditorContext | null>(null);


export const Editor: React.SFC<EditorProps> = (props) => {

	const [editorState, setEditorState] = React.useState<EditorState>();

	React.useEffect(() => {
		createEditorState();
	}, [])

	React.useEffect(() => {
		// Get new steps that can be sent to collab server
		getSendableSteps();
	}, [editorState])

	if (props.collabOptions) React.useEffect(() => {

		if (props.collabOptions && props.collabOptions.incomingSteps) onNewSteps(props.collabOptions.incomingSteps);

	}, [props.collabOptions.incomingSteps])

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
			actions: getActions()
		}));

		plugins.push(...Plugins({
			schema: props.schema,
			dispatchTransaction: dispatchTransaction,
			actions: getActions()
		}));

		if (props.collabOptions) plugins.push(
			collab.collab({
				version: props.collabOptions.version || 0
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
		if (editorState) console.log(tr);
		if (editorState) setEditorState(editorState.apply(tr));
	}

	const getSendableSteps = () => {
		if (editorState && props.collabOptions) {
			const sendable = collab.sendableSteps(editorState);
			if (sendable) props.collabOptions.onNewSendableSteps(sendable);
		}
	}

	const onNewSteps = (incomingSteps: StepsInfo) => {
		if (editorState) dispatchTransaction(
			collab.receiveTransaction(editorState, incomingSteps.steps, incomingSteps.clientIds)
		);
		getSendableSteps()
	}

	
	return (
		<React.Fragment>
			{editorState && (
				<div className={props.className ? props.className : "rpm-editor"}>
					<ReactEditorContext.Provider
						value={{
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