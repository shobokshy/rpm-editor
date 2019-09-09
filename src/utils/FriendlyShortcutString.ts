import { Shortcut } from "../actions/Action";

function captellize(str: string) {
    const pieces = str.split(/\s|-/);
    for (let i = 0; i < pieces.length; i++) {
        const j = pieces[i].charAt(0).toUpperCase();
        pieces[i] = j + pieces[i].substr(1).toLowerCase();
    }
    const string = pieces.join("-");
    return string.replace('Mod', 'Ctrl') //TODO: Detect OS and use appropriate key
}

export const FriendlyShortcutString = function(shortcut: Shortcut): string {
    let string = shortcut.key;
    return captellize(string);
}