interface ShortcutSpec {
    /** A keyboard shortcut key */
    key: string,
    /** A name describing this shortcut */
    name?: string,
    /** Action attributes that belong to this shortcut  */
    attrs?: any
}

/**
 * A class that defines a keyboard shortcut.
 */
export default class Shortcut {
    private spec: ShortcutSpec

    constructor(spec: ShortcutSpec) {
        this.spec = spec
    }

    /** @returns shortcut's name if defined */
    get name(): string | undefined {
        return this.spec.name
    }

    /** @returns shortcut's keyboard key */
    get key(): string {
        return this.spec.key
    }

    /** @returns shortcut's attributes if any */
    get attrs(): any | undefined {
        return this.spec.attrs
    }

    /** @returns shortcut's UI friendly key */
    public getFriendlyKey(): string {
        return this.capitalizeString(this.spec.key)
    }

    private capitalizeString(string: string): string {
        const pieces = string.split(/\s|-/);
        for (let i = 0; i < pieces.length; i++) {
            const j = pieces[i].charAt(0).toUpperCase();
            pieces[i] = j + pieces[i].substr(1).toLowerCase();
        }
        const captellized = pieces.join("-");
        return captellized.replace('Mod', 'Ctrl') //TODO: Detect OS and use appropriate key
    }
}