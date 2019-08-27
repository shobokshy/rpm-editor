import { Shortcut } from "../actions/Action";

function captellize(str: string) {
    var pieces = str.split(" ");
    for (var i = 0; i < pieces.length; i++) {
        var j = pieces[i].charAt(0).toUpperCase();
        pieces[i] = j + pieces[i].substr(1).toLowerCase();
    }
    return pieces.join(" ");
}

export const FriendlyShortcutString = function(shortcut: Shortcut): string {
    let string = shortcut.key;
    return captellize(string);
}