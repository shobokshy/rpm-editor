import Action from "./Action";
export interface Actions {
    [key: string]: Action;
}
/**
 * A keyed object that contains all actions
 */
declare const actions: Actions;
export default actions;
