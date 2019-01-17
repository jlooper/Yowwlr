import { InjectionToken } from "@angular/core";
import { Frame } from "tns-core-modules/ui/frame";
import { View } from "tns-core-modules/ui/core/view";
import { Page } from "tns-core-modules/ui/page";
import { Device } from "tns-core-modules/platform";
export declare const APP_ROOT_VIEW: InjectionToken<View>;
export declare const DEVICE: InjectionToken<Device>;
export declare const PAGE_FACTORY: InjectionToken<PageFactory>;
export declare function setRootPage(page: Page): void;
export declare function getRootPage(): Page;
export declare function getDefaultPage(): Page;
export declare const defaultPageProvider: {
    provide: typeof Page;
    useFactory: typeof getDefaultPage;
};
export declare function getDefaultFrame(): Frame;
export declare const defaultFrameProvider: {
    provide: typeof Frame;
    useFactory: typeof getDefaultFrame;
};
export declare function getDefaultDevice(): Device;
export declare const defaultDeviceProvider: {
    provide: InjectionToken<Device>;
    useFactory: typeof getDefaultDevice;
};
export declare type PageFactory = (options: PageFactoryOptions) => Page;
export interface PageFactoryOptions {
    isBootstrap?: boolean;
    isLivesync?: boolean;
    isModal?: boolean;
    isNavigation?: boolean;
    componentType?: any;
}
export declare const defaultPageFactory: PageFactory;
export declare const defaultPageFactoryProvider: {
    provide: InjectionToken<PageFactory>;
    useValue: PageFactory;
};
export declare class FrameService {
    getFrame(): Frame;
}
