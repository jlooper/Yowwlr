import { ElementRef, IterableDiffers } from "@angular/core";
import { ListView } from "tns-core-modules/ui/list-view";
import { TemplatedItemsComponent } from "./templated-items-comp";
export declare class ListViewComponent extends TemplatedItemsComponent {
    readonly nativeElement: ListView;
    protected templatedItemsView: ListView;
    constructor(_elementRef: ElementRef, _iterableDiffers: IterableDiffers);
}
