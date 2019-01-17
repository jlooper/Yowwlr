import { ModuleWithProviders } from '@angular/core';
import { TNSFontIconService } from './services/fonticon.service';
export * from './pipes/fonticon.pipe';
export * from './services/fonticon.service';
export declare class TNSFontIconModule {
    constructor(fonticon: TNSFontIconService);
    static forRoot(providedConfig?: any): ModuleWithProviders;
}
