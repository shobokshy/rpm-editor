import * as collab from "prosemirror-collab";
import { InputRule } from 'prosemirror-inputrules';
import { Node, Schema } from 'prosemirror-model';
import { EditorState, Plugin, Transaction } from 'prosemirror-state';
import * as React from 'react';
import { Actions } from './actions/BuiltInActions';
import { EditorContextProvider } from './EditorConextProvider';
import Plugins, { PluginConfig } from './plugins';
import { IPortalRenderer, PortalRenderer } from './PortalRenderer';
import { DispatchTransaction } from './Types';
import { enrichActions } from './utils/EnrichActions';

require('./Editor.css');

export interface EditorProps {
	id: string | number,
	className?: string,
	children?: React.ReactNode,
	onChange?: (editorState: EditorState) => void,
	document?: Node,
	editable: boolean,
	actions: Actions,
	plugins?: (pluginConfig: PluginConfig) => Plugin[],
	inputRules?: InputRule[],
	schema: Schema,
	debug?: boolean,
	collabVersion?: number
}


export const Editor: React.SFC<EditorProps> = (props) => {

	const [editorState, setEditorState] = React.useState<EditorState>();
	const portalRenderer = React.useRef<IPortalRenderer>(null);

	React.useEffect(() => {
		if (props.onChange && editorState) props.onChange(editorState);
	}, [editorState])

	React.useLayoutEffect(() => {
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
	const getPlugins = (excludeCollab?: boolean): Plugin[] => {
		const plugins: Plugin[] = [];
		const userPlugins = props.plugins;

		if (userPlugins && portalRenderer.current) plugins.push(...userPlugins({
			schema: props.schema,
			dispatchTransaction: dispatchTransaction,
			actions: getActions(),
			editable: props.editable,
			inputRules: props.inputRules,
			renderer: {
				render: portalRenderer.current.render,
				unmount: portalRenderer.current.unmount
			}
		}));

		if (portalRenderer.current) plugins.push(...Plugins({
			schema: props.schema,
			dispatchTransaction: dispatchTransaction,
			actions: getActions(),
			editable: props.editable,
			inputRules: props.inputRules,
			renderer: {
				render: portalRenderer.current.render,
				unmount: portalRenderer.current.unmount
			}
		}));

		if (!excludeCollab) plugins.push(
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

	const reConfigureEditor = () => {
		setEditorState((state) => {
			if(state) return state.reconfigure({
				plugins: [
					...getPlugins(true).filter((plugin) => {
						if (plugin.spec.key) {
							//@ts-ignore
							return plugin.key != "tableColumnResizing$"
						} else { return true}
					}),
					...state.plugins.filter((plugin) => {
						if (plugin.spec.key) {
							//@ts-ignore
							return plugin.key === "tableColumnResizing$"
						} else { return false }
					}),
					collab.collab({
						version: collab.getVersion(state)
					})
				]
			})
		})
	}

	/**
	 * Update current editor state with a new transaction
	 * @param tr Prosemirror Transaction
	 */
	const dispatchTransaction = (tr: Transaction | ((state: EditorState) => Transaction)): void => {
		if (typeof tr === 'function') {
			setEditorState(s => s ? s.apply(tr(s)) : undefined);
		} else {
			setEditorState(s => s ? s.apply(tr) : undefined);
		}
	}
	
	return (
		<PortalRenderer ref={portalRenderer}>
			{(portals) => (
				<React.Fragment>
					{editorState && (
						<div className={props.className ? props.className : "rpm-editor"}>
							<EditorContextProvider
								value={{
									id: props.id,
									editorState: editorState,
									dispatchTransaction: dispatchTransaction,
									editable: props.editable,
									actions: getActions(editorState, dispatchTransaction),
									debug: props.debug
								}}
							>
								<React.Fragment>
									{props.children}
									{portals}
								</React.Fragment>
							</EditorContextProvider>
						</div>
					)}
				</React.Fragment>
			)}
		</PortalRenderer>
	);
}