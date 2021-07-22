import { Subject } from "rxjs";

export class Loading {
    isLoadingSubject$ = new Subject<boolean>();
    isLoading$ = this.isLoadingSubject$.asObservable();
}
