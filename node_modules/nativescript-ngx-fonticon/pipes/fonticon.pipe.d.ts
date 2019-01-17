import { PipeTransform, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { TNSFontIconService } from '../services/fonticon.service';
export declare class TNSFontIconPipe implements PipeTransform, OnDestroy {
    private fonticon;
    private _ref;
    private _collectionName;
    private _value;
    private _iconSub;
    constructor(fonticon: TNSFontIconService, _ref: ChangeDetectorRef);
    transform(className: string, args: any[]): "";
    _dispose(): void;
    ngOnDestroy(): void;
}
export declare class TNSFontIconPurePipe implements PipeTransform {
    private fonticon;
    private _collectionName;
    constructor(fonticon: TNSFontIconService);
    transform(className: string, args: any[]): any;
}
