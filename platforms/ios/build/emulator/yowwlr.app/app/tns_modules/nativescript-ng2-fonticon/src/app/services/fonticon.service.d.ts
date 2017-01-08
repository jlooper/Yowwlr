import { BehaviorSubject } from 'rxjs/BehaviorSubject';
export declare class TNSFontIconService {
    static config: any;
    static debug: boolean;
    filesLoaded: BehaviorSubject<any>;
    css: any;
    private _currentName;
    constructor();
    loadCss(): void;
    private loadFile(path);
    private mapCss(data);
}
