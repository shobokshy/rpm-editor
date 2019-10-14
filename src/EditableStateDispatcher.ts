import { Subject } from 'rxjs';

export class EditableStateDispatcher {
    private subject: Subject<boolean>;

    constructor() {
        this.subject = new Subject<boolean>();
    }

    on(cb: (state: boolean) => void) {
        return this.subject.subscribe({
            next: (state: any) => cb(state)
        })
    }

    set(state: boolean) {
        this.subject.next(state);
    }

    unsubscribe() {
        this.subject.unsubscribe()
    }
}