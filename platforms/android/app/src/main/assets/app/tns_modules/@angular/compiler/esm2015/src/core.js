/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
// Attention:
// This file duplicates types and values from @angular/core
// so that we are able to make @angular/compiler independent of @angular/core.
// This is important to prevent a build cycle, as @angular/core needs to
// be compiled with the compiler.
import { CssSelector } from './selector';
export const createInject = makeMetadataFactory('Inject', (token) => ({ token }));
export const createInjectionToken = makeMetadataFactory('InjectionToken', (desc) => ({ _desc: desc, ngInjectableDef: undefined }));
export const createAttribute = makeMetadataFactory('Attribute', (attributeName) => ({ attributeName }));
export const createContentChildren = makeMetadataFactory('ContentChildren', (selector, data = {}) => (Object.assign({ selector, first: false, isViewQuery: false, descendants: false }, data)));
export const createContentChild = makeMetadataFactory('ContentChild', (selector, data = {}) => (Object.assign({ selector, first: true, isViewQuery: false, descendants: true }, data)));
export const createViewChildren = makeMetadataFactory('ViewChildren', (selector, data = {}) => (Object.assign({ selector, first: false, isViewQuery: true, descendants: true }, data)));
export const createViewChild = makeMetadataFactory('ViewChild', (selector, data) => (Object.assign({ selector, first: true, isViewQuery: true, descendants: true }, data)));
export const createDirective = makeMetadataFactory('Directive', (dir = {}) => dir);
export var ViewEncapsulation;
(function (ViewEncapsulation) {
    ViewEncapsulation[ViewEncapsulation["Emulated"] = 0] = "Emulated";
    ViewEncapsulation[ViewEncapsulation["Native"] = 1] = "Native";
    ViewEncapsulation[ViewEncapsulation["None"] = 2] = "None";
    ViewEncapsulation[ViewEncapsulation["ShadowDom"] = 3] = "ShadowDom";
})(ViewEncapsulation || (ViewEncapsulation = {}));
export var ChangeDetectionStrategy;
(function (ChangeDetectionStrategy) {
    ChangeDetectionStrategy[ChangeDetectionStrategy["OnPush"] = 0] = "OnPush";
    ChangeDetectionStrategy[ChangeDetectionStrategy["Default"] = 1] = "Default";
})(ChangeDetectionStrategy || (ChangeDetectionStrategy = {}));
export const createComponent = makeMetadataFactory('Component', (c = {}) => (Object.assign({ changeDetection: ChangeDetectionStrategy.Default }, c)));
export const createPipe = makeMetadataFactory('Pipe', (p) => (Object.assign({ pure: true }, p)));
export const createInput = makeMetadataFactory('Input', (bindingPropertyName) => ({ bindingPropertyName }));
export const createOutput = makeMetadataFactory('Output', (bindingPropertyName) => ({ bindingPropertyName }));
export const createHostBinding = makeMetadataFactory('HostBinding', (hostPropertyName) => ({ hostPropertyName }));
export const createHostListener = makeMetadataFactory('HostListener', (eventName, args) => ({ eventName, args }));
export const createNgModule = makeMetadataFactory('NgModule', (ngModule) => ngModule);
export const createInjectable = makeMetadataFactory('Injectable', (injectable = {}) => injectable);
export const CUSTOM_ELEMENTS_SCHEMA = {
    name: 'custom-elements'
};
export const NO_ERRORS_SCHEMA = {
    name: 'no-errors-schema'
};
export const createOptional = makeMetadataFactory('Optional');
export const createSelf = makeMetadataFactory('Self');
export const createSkipSelf = makeMetadataFactory('SkipSelf');
export const createHost = makeMetadataFactory('Host');
export const Type = Function;
export var SecurityContext;
(function (SecurityContext) {
    SecurityContext[SecurityContext["NONE"] = 0] = "NONE";
    SecurityContext[SecurityContext["HTML"] = 1] = "HTML";
    SecurityContext[SecurityContext["STYLE"] = 2] = "STYLE";
    SecurityContext[SecurityContext["SCRIPT"] = 3] = "SCRIPT";
    SecurityContext[SecurityContext["URL"] = 4] = "URL";
    SecurityContext[SecurityContext["RESOURCE_URL"] = 5] = "RESOURCE_URL";
})(SecurityContext || (SecurityContext = {}));
export var MissingTranslationStrategy;
(function (MissingTranslationStrategy) {
    MissingTranslationStrategy[MissingTranslationStrategy["Error"] = 0] = "Error";
    MissingTranslationStrategy[MissingTranslationStrategy["Warning"] = 1] = "Warning";
    MissingTranslationStrategy[MissingTranslationStrategy["Ignore"] = 2] = "Ignore";
})(MissingTranslationStrategy || (MissingTranslationStrategy = {}));
function makeMetadataFactory(name, props) {
    const factory = (...args) => {
        const values = props ? props(...args) : {};
        return Object.assign({ ngMetadataName: name }, values);
    };
    factory.isTypeOf = (obj) => obj && obj.ngMetadataName === name;
    factory.ngMetadataName = name;
    return factory;
}
function parserSelectorToSimpleSelector(selector) {
    const classes = selector.classNames && selector.classNames.length ?
        [8 /* CLASS */, ...selector.classNames] :
        [];
    const elementName = selector.element && selector.element !== '*' ? selector.element : '';
    return [elementName, ...selector.attrs, ...classes];
}
function parserSelectorToNegativeSelector(selector) {
    const classes = selector.classNames && selector.classNames.length ?
        [8 /* CLASS */, ...selector.classNames] :
        [];
    if (selector.element) {
        return [
            1 /* NOT */ | 4 /* ELEMENT */, selector.element, ...selector.attrs, ...classes
        ];
    }
    else if (selector.attrs.length) {
        return [1 /* NOT */ | 2 /* ATTRIBUTE */, ...selector.attrs, ...classes];
    }
    else {
        return selector.classNames && selector.classNames.length ?
            [1 /* NOT */ | 8 /* CLASS */, ...selector.classNames] :
            [];
    }
}
function parserSelectorToR3Selector(selector) {
    const positive = parserSelectorToSimpleSelector(selector);
    const negative = selector.notSelectors && selector.notSelectors.length ?
        selector.notSelectors.map(notSelector => parserSelectorToNegativeSelector(notSelector)) :
        [];
    return positive.concat(...negative);
}
export function parseSelectorToR3Selector(selector) {
    const selectors = CssSelector.parse(selector);
    return selectors.map(parserSelectorToR3Selector);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29yZS5qcyIsInNvdXJjZVJvb3QiOiIuLi8uLi8iLCJzb3VyY2VzIjpbInBhY2thZ2VzL2NvbXBpbGVyL3NyYy9jb3JlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILGFBQWE7QUFDYiwyREFBMkQ7QUFDM0QsOEVBQThFO0FBQzlFLHdFQUF3RTtBQUN4RSxpQ0FBaUM7QUFFakMsT0FBTyxFQUFDLFdBQVcsRUFBQyxNQUFNLFlBQVksQ0FBQztBQUd2QyxNQUFNLENBQUMsTUFBTSxZQUFZLEdBQUcsbUJBQW1CLENBQVMsUUFBUSxFQUFFLENBQUMsS0FBVSxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUMsS0FBSyxFQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzdGLE1BQU0sQ0FBQyxNQUFNLG9CQUFvQixHQUFHLG1CQUFtQixDQUNuRCxnQkFBZ0IsRUFBRSxDQUFDLElBQVksRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsZUFBZSxFQUFFLFNBQVMsRUFBQyxDQUFDLENBQUMsQ0FBQztBQUdyRixNQUFNLENBQUMsTUFBTSxlQUFlLEdBQ3hCLG1CQUFtQixDQUFZLFdBQVcsRUFBRSxDQUFDLGFBQXNCLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBQyxhQUFhLEVBQUMsQ0FBQyxDQUFDLENBQUM7QUFVL0YsTUFBTSxDQUFDLE1BQU0scUJBQXFCLEdBQUcsbUJBQW1CLENBQ3BELGlCQUFpQixFQUNqQixDQUFDLFFBQWMsRUFBRSxPQUFZLEVBQUUsRUFBRSxFQUFFLENBQy9CLGlCQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLFdBQVcsRUFBRSxLQUFLLEVBQUUsV0FBVyxFQUFFLEtBQUssSUFBSyxJQUFJLEVBQUUsQ0FBQyxDQUFDO0FBQ3JGLE1BQU0sQ0FBQyxNQUFNLGtCQUFrQixHQUFHLG1CQUFtQixDQUNqRCxjQUFjLEVBQUUsQ0FBQyxRQUFjLEVBQUUsT0FBWSxFQUFFLEVBQUUsRUFBRSxD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QUFLLENBQUMsTUFBTSxFQUFFO1FBQ2hDLE9BQU8sQ0FBQywrQkFBMkMsRUFBRSxHQUFHLFFBQVEsQ0FBQyxLQUFLLEVBQUUsR0FBRyxPQUFPLENBQUMsQ0FBQztLQUNyRjtTQUFNO1FBQ0wsT0FBTyxRQUFRLENBQUMsVUFBVSxJQUFJLFFBQVEsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDdEQsQ0FBQywyQkFBdUMsRUFBRSxHQUFHLFFBQVEsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO1lBQ25FLEVBQUUsQ0FBQztLQUNSO0FBQ0gsQ0FBQztBQUVELFNBQVMsMEJBQTBCLENBQUMsUUFBcUI7SUFDdkQsTUFBTSxRQUFRLEdBQUcsOEJBQThCLENBQUMsUUFBUSxDQUFDLENBQUM7SUFFMUQsTUFBTSxRQUFRLEdBQXNCLFFBQVEsQ0FBQyxZQUFZLElBQUksUUFBUSxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUN2RixRQUFRLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDLGdDQUFnQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN6RixFQUFFLENBQUM7SUFFUCxPQUFPLFFBQVEsQ0FBQyxNQUFNLENBQUMsR0FBRyxRQUFRLENBQUMsQ0FBQztBQUN0QyxDQUFDO0FBRUQsTUFBTSxVQUFVLHlCQUF5QixDQUFDLFFBQWdCO0lBQ3hELE1BQU0sU0FBUyxHQUFHLFdBQVcsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDOUMsT0FBTyxTQUFTLENBQUMsR0FBRyxDQUFDLDBCQUEwQixDQUFDLENBQUM7QUFDbkQsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuLy8gQXR0ZW50aW9uOlxuLy8gVGhpcyBmaWxlIGR1cGxpY2F0ZXMgdHlwZXMgYW5kIHZhbHVlcyBmcm9tIEBhbmd1bGFyL2NvcmVcbi8vIHNvIHRoYXQgd2UgYXJlIGFibGUgdG8gbWFrZSBAYW5ndWxhci9jb21waWxlciBpbmRlcGVuZGVudCBvZiBAYW5ndWxhci9jb3JlLlxuLy8gVGhpcyBpcyBpbXBvcnRhbnQgdG8gcHJldmVudCBhIGJ1aWxkIGN5Y2xlLCBhcyBAYW5ndWxhci9jb3JlIG5lZWRzIHRvXG4vLyBiZSBjb21waWxlZCB3aXRoIHRoZSBjb21waWxlci5cblxuaW1wb3J0IHtDc3NTZWxlY3Rvcn0gZnJvbSAnLi9zZWxlY3Rvcic7XG5cbmV4cG9ydCBpbnRlcmZhY2UgSW5qZWN0IHsgdG9rZW46IGFueTsgfVxuZXhwb3J0IGNvbnN0IGNyZWF0ZUluamVjdCA9IG1ha2VNZXRhZGF0YUZhY3Rvcnk8SW5qZWN0PignSW5qZWN0JywgKHRva2VuOiBhbnkpID0+ICh7dG9rZW59KSk7XG5leHBvcnQgY29uc3QgY3JlYXRlSW5qZWN0aW9uVG9rZW4gPSBtYWtlTWV0YWRhdGFGYWN0b3J5PG9iamVjdD4oXG4gICAgJ0luamVjdGlvblRva2VuJywgKGRlc2M6IHN0cmluZykgPT4gKHtfZGVzYzogZGVzYywgbmdJbmplY3RhYmxlRGVmOiB1bmRlZmluZWR9KSk7XG5cbmV4cG9ydCBpbnRlcmZhY2UgQXR0cmlidXRlIHsgYXR0cmlidXRlTmFtZT86IHN0cmluZzsgfVxuZXhwb3J0IGNvbnN0IGNyZWF0ZUF0dHJpYnV0ZSA9XG4gICAgbWFrZU1ldGFkYXRhRmFjdG9yeTxBdHRyaWJ1dGU+KCdBdHRyaWJ1dGUnLCAoYXR0cmlidXRlTmFtZT86IHN0cmluZykgPT4gKHthdHRyaWJ1dGVOYW1lfSkpO1xuXG5leHBvcnQgaW50ZXJmYWNlIFF1ZXJ5IHtcbiAgZGVzY2VuZGFudHM6IGJvb2xlYW47XG4gIGZpcnN0OiBib29sZWFuO1xuICByZWFkOiBhbnk7XG4gIGlzVmlld1F1ZXJ5OiBib29sZWFuO1xuICBzZWxlY3RvcjogYW55O1xufVxuXG5leHBvcnQgY29uc3QgY3JlYXRlQ29udGVudENoaWxkcmVuID0gbWFrZU1ldGFkYXRhRmFjdG9yeTxRdWVyeT4oXG4gICAgJ0NvbnRlbnRDaGlsZHJlbicsXG4gICAgKHNlbGVjdG9yPzogYW55LCBkYXRhOiBhbnkgPSB7fSkgPT5cbiAgICAgICAgKHtzZWxlY3RvciwgZmlyc3Q6IGZhbHNlLCBpc1ZpZXdRdWVyeTogZmFsc2UsIGRlc2NlbmRhbnRzOiBmYWxzZSwgLi4uZGF0YX0pKTtcbmV4cG9ydCBjb25zdCBjcmVhdGVDb250ZW50Q2hpbGQgPSBtYWtlTWV0YWRhdGFGYWN0b3J5PFF1ZXJ5PihcbiAgICAnQ29udGVudENoaWxkJywgKHNlbGVjdG9yPzogYW55LCBkYXRhOiBhbnkgPSB7fSkgPT5cbiAgICAgICAgICAgICAgICAgICAgICAgICh7c2VsZWN0b3IsIGZpcnN0OiB0cnVlLCBpc1ZpZXdRdWVyeTogZmFsc2UsIGRlc2NlbmRhbnRzOiB0cnVlLCAuLi5kYXRhfSkpO1xuZXhwb3J0IGNvbnN0IGNyZWF0ZVZpZXdDaGlsZHJlbiA9IG1ha2VNZXRhZGF0YUZhY3Rvcnk8UXVlcnk+KFxuICAgICdWaWV3Q2hpbGRyZW4nLCAoc2VsZWN0b3I/OiBhbnksIGRhdGE6IGFueSA9IHt9KSA9PlxuICAgICAgICAgICAgICAgICAgICAgICAgKHtzZWxlY3RvciwgZmlyc3Q6IGZhbHNlLCBpc1ZpZXdRdWVyeTogdHJ1ZSwgZGVzY2VuZGFudHM6IHRydWUsIC4uLmRhdGF9KSk7XG5leHBvcnQgY29uc3QgY3JlYXRlVmlld0NoaWxkID0gbWFrZU1ldGFkYXRhRmFjdG9yeTxRdWVyeT4oXG4gICAgJ1ZpZXdDaGlsZCcsIChzZWxlY3RvcjogYW55LCBkYXRhOiBhbnkpID0+XG4gICAgICAgICAgICAgICAgICAgICAoe3NlbGVjdG9yLCBmaXJzdDogdHJ1ZSwgaXNWaWV3UXVlcnk6IHRydWUsIGRlc2NlbmRhbnRzOiB0cnVlLCAuLi5kYXRhfSkpO1xuXG5leHBvcnQgaW50ZXJmYWNlIERpcmVjdGl2ZSB7XG4gIHNlbGVjdG9yPzogc3RyaW5nO1xuICBpbnB1dHM/OiBzdHJpbmdbXTtcbiAgb3V0cHV0cz86IHN0cmluZ1tdO1xuICBob3N0Pzoge1trZXk6IHN0cmluZ106IHN0cmluZ307XG4gIHByb3ZpZGVycz86IFByb3ZpZGVyW107XG4gIGV4cG9ydEFzPzogc3RyaW5nO1xuICBxdWVyaWVzPzoge1trZXk6IHN0cmluZ106IGFueX07XG4gIGd1YXJkcz86IHtba2V5OiBzdHJpbmddOiBhbnl9O1xufVxuZXhwb3J0IGNvbnN0IGNyZWF0ZURpcmVjdGl2ZSA9XG4gICAgbWFrZU1ldGFkYXRhRmFjdG9yeTxEaXJlY3RpdmU+KCdEaXJlY3RpdmUnLCAoZGlyOiBEaXJlY3RpdmUgPSB7fSkgPT4gZGlyKTtcblxuZXhwb3J0IGludGVyZmFjZSBDb21wb25lbnQgZXh0ZW5kcyBEaXJlY3RpdmUge1xuICBjaGFuZ2VEZXRlY3Rpb24/OiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneTtcbiAgdmlld1Byb3ZpZGVycz86IFByb3ZpZGVyW107XG4gIG1vZHVsZUlkPzogc3RyaW5nO1xuICB0ZW1wbGF0ZVVybD86IHN0cmluZztcbiAgdGVtcGxhdGU/OiBzdHJpbmc7XG4gIHN0eWxlVXJscz86IHN0cmluZ1tdO1xuICBzdHlsZXM/OiBzdHJpbmdbXTtcbiAgYW5pbWF0aW9ucz86IGFueVtdO1xuICBlbmNhcHN1bGF0aW9uPzogVmlld0VuY2Fwc3VsYXRpb247XG4gIGludGVycG9sYXRpb24/OiBbc3RyaW5nLCBzdHJpbmddO1xuICBlbnRyeUNvbXBvbmVudHM/OiBBcnJheTxUeXBlfGFueVtdPjtcbiAgcHJlc2VydmVXaGl0ZXNwYWNlcz86IGJvb2xlYW47XG59XG5leHBvcnQgZW51bSBWaWV3RW5jYXBzdWxhdGlvbiB7XG4gIEVtdWxhdGVkID0gMCxcbiAgTmF0aXZlID0gMSxcbiAgTm9uZSA9IDIsXG4gIFNoYWRvd0RvbSA9IDNcbn1cblxuZXhwb3J0IGVudW0gQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kge1xuICBPblB1c2ggPSAwLFxuICBEZWZhdWx0ID0gMVxufVxuXG5leHBvcnQgY29uc3QgY3JlYXRlQ29tcG9uZW50ID0gbWFrZU1ldGFkYXRhRmFjdG9yeTxDb21wb25lbnQ+KFxuICAgICdDb21wb25lbnQnLCAoYzogQ29tcG9uZW50ID0ge30pID0+ICh7Y2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5EZWZhdWx0LCAuLi5jfSkpO1xuXG5leHBvcnQgaW50ZXJmYWNlIFBpcGUge1xuICBuYW1lOiBzdHJpbmc7XG4gIHB1cmU/OiBib29sZWFuO1xufVxuZXhwb3J0IGNvbnN0IGNyZWF0ZVBpcGUgPSBtYWtlTWV0YWRhdGFGYWN0b3J5PFBpcGU+KCdQaXBlJywgKHA6IFBpcGUpID0+ICh7cHVyZTogdHJ1ZSwgLi4ucH0pKTtcblxuZXhwb3J0IGludGVyZmFjZSBJbnB1dCB7IGJpbmRpbmdQcm9wZXJ0eU5hbWU/OiBzdHJpbmc7IH1cbmV4cG9ydCBjb25zdCBjcmVhdGVJbnB1dCA9XG4gICAgbWFrZU1ldGFkYXRhRmFjdG9yeTxJbnB1dD4oJ0lucHV0JywgKGJpbmRpbmdQcm9wZXJ0eU5hbWU/OiBzdHJpbmcpID0+ICh7YmluZGluZ1Byb3BlcnR5TmFtZX0pKTtcblxuZXhwb3J0IGludGVyZmFjZSBPdXRwdXQgeyBiaW5kaW5nUHJvcGVydHlOYW1lPzogc3RyaW5nOyB9XG5leHBvcnQgY29uc3QgY3JlYXRlT3V0cHV0ID0gbWFrZU1ldGFkYXRhRmFjdG9yeTxPdXRwdXQ+KFxuICAgICdPdXRwdXQnLCAoYmluZGluZ1Byb3BlcnR5TmFtZT86IHN0cmluZykgPT4gKHtiaW5kaW5nUHJvcGVydHlOYW1lfSkpO1xuXG5leHBvcnQgaW50ZXJmYWNlIEhvc3RCaW5kaW5nIHsgaG9zdFByb3BlcnR5TmFtZT86IHN0cmluZzsgfVxuZXhwb3J0IGNvbnN0IGNyZWF0ZUhvc3RCaW5kaW5nID0gbWFrZU1ldGFkYXRhRmFjdG9yeTxIb3N0QmluZGluZz4oXG4gICAgJ0hvc3RCaW5kaW5nJywgKGhvc3RQcm9wZXJ0eU5hbWU/OiBzdHJpbmcpID0+ICh7aG9zdFByb3BlcnR5TmFtZX0pKTtcblxuZXhwb3J0IGludGVyZmFjZSBIb3N0TGlzdGVuZXIge1xuICBldmVudE5hbWU/OiBzdHJpbmc7XG4gIGFyZ3M/OiBzdHJpbmdbXTtcbn1cbmV4cG9ydCBjb25zdCBjcmVhdGVIb3N0TGlzdGVuZXIgPSBtYWtlTWV0YWRhdGFGYWN0b3J5PEhvc3RMaXN0ZW5lcj4oXG4gICAgJ0hvc3RMaXN0ZW5lcicsIChldmVudE5hbWU/OiBzdHJpbmcsIGFyZ3M/OiBzdHJpbmdbXSkgPT4gKHtldmVudE5hbWUsIGFyZ3N9KSk7XG5cbmV4cG9ydCBpbnRlcmZhY2UgTmdNb2R1bGUge1xuICBwcm92aWRlcnM/OiBQcm92aWRlcltdO1xuICBkZWNsYXJhdGlvbnM/OiBBcnJheTxUeXBlfGFueVtdPjtcbiAgaW1wb3J0cz86IEFycmF5PFR5cGV8TW9kdWxlV2l0aFByb3ZpZGVyc3xhbnlbXT47XG4gIGV4cG9ydHM/OiBBcnJheTxUeXBlfGFueVtdPjtcbiAgZW50cnlDb21wb25lbnRzPzogQXJyYXk8VHlwZXxhbnlbXT47XG4gIGJvb3RzdHJhcD86IEFycmF5PFR5cGV8YW55W10+O1xuICBzY2hlbWFzPzogQXJyYXk8U2NoZW1hTWV0YWRhdGF8YW55W10+O1xuICBpZD86IHN0cmluZztcbn1cbmV4cG9ydCBjb25zdCBjcmVhdGVOZ01vZHVsZSA9XG4gICAgbWFrZU1ldGFkYXRhRmFjdG9yeTxOZ01vZHVsZT4oJ05nTW9kdWxlJywgKG5nTW9kdWxlOiBOZ01vZHVsZSkgPT4gbmdNb2R1bGUpO1xuXG5leHBvcnQgaW50ZXJmYWNlIE1vZHVsZVdpdGhQcm92aWRlcnMge1xuICBuZ01vZHVsZTogVHlwZTtcbiAgcHJvdmlkZXJzPzogUHJvdmlkZXJbXTtcbn1cbmV4cG9ydCBpbnRlcmZhY2UgSW5qZWN0YWJsZSB7XG4gIHByb3ZpZGVkSW4/OiBUeXBlfCdyb290J3xhbnk7XG4gIHVzZUNsYXNzPzogVHlwZXxhbnk7XG4gIHVzZUV4aXN0aW5nPzogVHlwZXxhbnk7XG4gIHVzZVZhbHVlPzogYW55O1xuICB1c2VGYWN0b3J5PzogVHlwZXxhbnk7XG4gIGRlcHM/OiBBcnJheTxUeXBlfGFueVtdPjtcbn1cbmV4cG9ydCBjb25zdCBjcmVhdGVJbmplY3RhYmxlID1cbiAgICBtYWtlTWV0YWRhdGFGYWN0b3J5KCdJbmplY3RhYmxlJywgKGluamVjdGFibGU6IEluamVjdGFibGUgPSB7fSkgPT4gaW5qZWN0YWJsZSk7XG5leHBvcnQgaW50ZXJmYWNlIFNjaGVtYU1ldGFkYXRhIHsgbmFtZTogc3RyaW5nOyB9XG5cbmV4cG9ydCBjb25zdCBDVVNUT01fRUxFTUVOVFNfU0NIRU1BOiBTY2hlbWFNZXRhZGF0YSA9IHtcbiAgbmFtZTogJ2N1c3RvbS1lbGVtZW50cydcbn07XG5cbmV4cG9ydCBjb25zdCBOT19FUlJPUlNfU0NIRU1BOiBTY2hlbWFNZXRhZGF0YSA9IHtcbiAgbmFtZTogJ25vLWVycm9ycy1zY2hlbWEnXG59O1xuXG5leHBvcnQgY29uc3QgY3JlYXRlT3B0aW9uYWwgPSBtYWtlTWV0YWRhdGFGYWN0b3J5KCdPcHRpb25hbCcpO1xuZXhwb3J0IGNvbnN0IGNyZWF0ZVNlbGYgPSBtYWtlTWV0YWRhdGFGYWN0b3J5KCdTZWxmJyk7XG5leHBvcnQgY29uc3QgY3JlYXRlU2tpcFNlbGYgPSBtYWtlTWV0YWRhdGFGYWN0b3J5KCdTa2lwU2VsZicpO1xuZXhwb3J0IGNvbnN0IGNyZWF0ZUhvc3QgPSBtYWtlTWV0YWRhdGFGYWN0b3J5KCdIb3N0Jyk7XG5cbmV4cG9ydCBpbnRlcmZhY2UgVHlwZSBleHRlbmRzIEZ1bmN0aW9uIHsgbmV3ICguLi5hcmdzOiBhbnlbXSk6IGFueTsgfVxuZXhwb3J0IGNvbnN0IFR5cGUgPSBGdW5jdGlvbjtcblxuZXhwb3J0IGVudW0gU2VjdXJpdHlDb250ZXh0IHtcbiAgTk9ORSA9IDAsXG4gIEhUTUwgPSAxLFxuICBTVFlMRSA9IDIsXG4gIFNDUklQVCA9IDMsXG4gIFVSTCA9IDQsXG4gIFJFU09VUkNFX1VSTCA9IDUsXG59XG5cbmV4cG9ydCB0eXBlIFByb3ZpZGVyID0gYW55O1xuXG5leHBvcnQgY29uc3QgZW51bSBOb2RlRmxhZ3Mge1xuICBOb25lID0gMCxcbiAgVHlwZUVsZW1lbnQgPSAxIDw8IDAsXG4gIFR5cGVUZXh0ID0gMSA8PCAxLFxuICBQcm9qZWN0ZWRUZW1wbGF0ZSA9IDEgPDwgMixcbiAgQ2F0UmVuZGVyTm9kZSA9IFR5cGVFbGVtZW50IHwgVHlwZVRleHQsXG4gIFR5cGVOZ0NvbnRlbnQgPSAxIDw8IDMsXG4gIFR5cGVQaXBlID0gMSA8PCA0LFxuICBUeXBlUHVyZUFycmF5ID0gMSA8PCA1LFxuICBUeXBlUHVyZU9iamVjdCA9IDEgPDwgNixcbiAgVHlwZVB1cmVQaXBlID0gMSA8PCA3LFxuICBDYXRQdXJlRXhwcmVzc2lvbiA9IFR5cGVQdXJlQXJyYXkgfCBUeXBlUHVyZU9iamVjdCB8IFR5cGVQdXJlUGlwZSxcbiAgVHlwZVZhbHVlUHJvdmlkZXIgPSAxIDw8IDgsXG4gIFR5cGVDbGFzc1Byb3ZpZGVyID0gMSA8PCA5LFxuICBUeXBlRmFjdG9yeVByb3ZpZGVyID0gMSA8PCAxMCxcbiAgVHlwZVVzZUV4aXN0aW5nUHJvdmlkZXIgPSAxIDw8IDExLFxuICBMYXp5UHJvdmlkZXIgPSAxIDw8IDEyLFxuICBQcml2YXRlUHJvdmlkZXIgPSAxIDw8IDEzLFxuICBUeXBlRGlyZWN0aXZlID0gMSA8PCAxNCxcbiAgQ29tcG9uZW50ID0gMSA8PCAxNSxcbiAgQ2F0UHJvdmlkZXJOb0RpcmVjdGl2ZSA9XG4gICAgICBUeXBlVmFsdWVQcm92aWRlciB8IFR5cGVDbGFzc1Byb3ZpZGVyIHwgVHlwZUZhY3RvcnlQcm92aWRlciB8IFR5cGVVc2VFeGlzdGluZ1Byb3ZpZGVyLFxuICBDYXRQcm92aWRlciA9IENhdFByb3ZpZGVyTm9EaXJlY3RpdmUgfCBUeXBlRGlyZWN0aXZlLFxuICBPbkluaXQgPSAxIDw8IDE2LFxuICBPbkRlc3Ryb3kgPSAxIDw8IDE3LFxuICBEb0NoZWNrID0gMSA8PCAxOCxcbiAgT25DaGFuZ2VzID0gMSA8PCAxOSxcbiAgQWZ0ZXJDb250ZW50SW5pdCA9IDEgPDwgMjAsXG4gIEFmdGVyQ29udGVudENoZWNrZWQgPSAxIDw8IDIxLFxuICBBZnRlclZpZXdJbml0ID0gMSA8PCAyMixcbiAgQWZ0ZXJWaWV3Q2hlY2tlZCA9IDEgPDwgMjMsXG4gIEVtYmVkZGVkVmlld3MgPSAxIDw8IDI0LFxuICBDb21wb25lbnRWaWV3ID0gMSA8PCAyNSxcbiAgVHlwZUNvbnRlbnRRdWVyeSA9IDEgPDwgMjYsXG4gIFR5cGVWaWV3UXVlcnkgPSAxIDw8IDI3LFxuICBTdGF0aWNRdWVyeSA9IDEgPDwgMjgsXG4gIER5bmFtaWNRdWVyeSA9IDEgPDwgMjksXG4gIFR5cGVNb2R1bGVQcm92aWRlciA9IDEgPDwgMzAsXG4gIENhdFF1ZXJ5ID0gVHlwZUNvbnRlbnRRdWVyeSB8IFR5cGVWaWV3UXVlcnksXG5cbiAgLy8gbXV0dWFsbHkgZXhjbHVzaXZlIHZhbHVlcy4uLlxuICBUeXBlcyA9IENhdFJlbmRlck5vZGUgfCBUeXBlTmdDb250ZW50IHwgVHlwZVBpcGUgfCBDYXRQdXJlRXhwcmVzc2lvbiB8IENhdFByb3ZpZGVyIHwgQ2F0UXVlcnlcbn1cblxuZXhwb3J0IGNvbnN0IGVudW0gRGVwRmxhZ3Mge1xuICBOb25lID0gMCxcbiAgU2tpcFNlbGYgPSAxIDw8IDAsXG4gIE9wdGlvbmFsID0gMSA8PCAxLFxuICBTZWxmID0gMSA8PCAyLFxuICBWYWx1ZSA9IDEgPDwgMyxcbn1cblxuLyoqXG4gKiBJbmplY3Rpb24gZmxhZ3MgZm9yIERJLlxuICovXG5leHBvcnQgY29uc3QgZW51bSBJbmplY3RGbGFncyB7XG4gIERlZmF1bHQgPSAwLFxuXG4gIC8qKlxuICAgKiBTcGVjaWZpZXMgdGhhdCBhbiBpbmplY3RvciBzaG91bGQgcmV0cmlldmUgYSBkZXBlbmRlbmN5IGZyb20gYW55IGluamVjdG9yIHVudGlsIHJlYWNoaW5nIHRoZVxuICAgKiBob3N0IGVsZW1lbnQgb2YgdGhlIGN1cnJlbnQgY29tcG9uZW50LiAoT25seSB1c2VkIHdpdGggRWxlbWVudCBJbmplY3RvcilcbiAgICovXG4gIEhvc3QgPSAxIDw8IDAsXG4gIC8qKiBEb24ndCBkZXNjZW5kIGludG8gYW5jZXN0b3JzIG9mIHRoZSBub2RlIHJlcXVlc3RpbmcgaW5qZWN0aW9uLiAqL1xuICBTZWxmID0gMSA8PCAxLFxuICAvKiogU2tpcCB0aGUgbm9kZSB0aGF0IGlzIHJlcXVlc3RpbmcgaW5qZWN0aW9uLiAqL1xuICBTa2lwU2VsZiA9IDEgPDwgMixcbiAgLyoqIEluamVjdCBgZGVmYXVsdFZhbHVlYCBpbnN0ZWFkIGlmIHRva2VuIG5vdCBmb3VuZC4gKi9cbiAgT3B0aW9uYWwgPSAxIDw8IDMsXG59XG5cbmV4cG9ydCBjb25zdCBlbnVtIEFyZ3VtZW50VHlwZSB7SW5saW5lID0gMCwgRHluYW1pYyA9IDF9XG5cbmV4cG9ydCBjb25zdCBlbnVtIEJpbmRpbmdGbGFncyB7XG4gIFR5cGVFbGVtZW50QXR0cmlidXRlID0gMSA8PCAwLFxuICBUeXBlRWxlbWVudENsYXNzID0gMSA8PCAxLFxuICBUeXBlRWxlbWVudFN0eWxlID0gMSA8PCAyLFxuICBUeXBlUHJvcGVydHkgPSAxIDw8IDMsXG4gIFN5bnRoZXRpY1Byb3BlcnR5ID0gMSA8PCA0LFxuICBTeW50aGV0aWNIb3N0UHJvcGVydHkgPSAxIDw8IDUsXG4gIENhdFN5bnRoZXRpY1Byb3BlcnR5ID0gU3ludGhldGljUHJvcGVydHkgfCBTeW50aGV0aWNIb3N0UHJvcGVydHksXG5cbiAgLy8gbXV0dWFsbHkgZXhjbHVzaXZlIHZhbHVlcy4uLlxuICBUeXBlcyA9IFR5cGVFbGVtZW50QXR0cmlidXRlIHwgVHlwZUVsZW1lbnRDbGFzcyB8IFR5cGVFbGVtZW50U3R5bGUgfCBUeXBlUHJvcGVydHlcbn1cblxuZXhwb3J0IGNvbnN0IGVudW0gUXVlcnlCaW5kaW5nVHlwZSB7Rmlyc3QgPSAwLCBBbGwgPSAxfVxuXG5leHBvcnQgY29uc3QgZW51bSBRdWVyeVZhbHVlVHlwZSB7XG4gIEVsZW1lbnRSZWYgPSAwLFxuICBSZW5kZXJFbGVtZW50ID0gMSxcbiAgVGVtcGxhdGVSZWYgPSAyLFxuICBWaWV3Q29udGFpbmVyUmVmID0gMyxcbiAgUHJvdmlkZXIgPSA0XG59XG5cbmV4cG9ydCBjb25zdCBlbnVtIFZpZXdGbGFncyB7XG4gIE5vbmUgPSAwLFxuICBPblB1c2ggPSAxIDw8IDEsXG59XG5cbmV4cG9ydCBlbnVtIE1pc3NpbmdUcmFuc2xhdGlvblN0cmF0ZWd5IHtcbiAgRXJyb3IgPSAwLFxuICBXYXJuaW5nID0gMSxcbiAgSWdub3JlID0gMixcbn1cblxuZXhwb3J0IGludGVyZmFjZSBNZXRhZGF0YUZhY3Rvcnk8VD4ge1xuICAoLi4uYXJnczogYW55W10pOiBUO1xuICBpc1R5cGVPZihvYmo6IGFueSk6IG9iaiBpcyBUO1xuICBuZ01ldGFkYXRhTmFtZTogc3RyaW5nO1xufVxuXG5mdW5jdGlvbiBtYWtlTWV0YWRhdGFGYWN0b3J5PFQ+KG5hbWU6IHN0cmluZywgcHJvcHM/OiAoLi4uYXJnczogYW55W10pID0+IFQpOiBNZXRhZGF0YUZhY3Rvcnk8VD4ge1xuICBjb25zdCBmYWN0b3J5OiBhbnkgPSAoLi4uYXJnczogYW55W10pID0+IHtcbiAgICBjb25zdCB2YWx1ZXMgPSBwcm9wcyA/IHByb3BzKC4uLmFyZ3MpIDoge307XG4gICAgcmV0dXJuIHtcbiAgICAgIG5nTWV0YWRhdGFOYW1lOiBuYW1lLFxuICAgICAgLi4udmFsdWVzLFxuICAgIH07XG4gIH07XG4gIGZhY3RvcnkuaXNUeXBlT2YgPSAob2JqOiBhbnkpID0+IG9iaiAmJiBvYmoubmdNZXRhZGF0YU5hbWUgPT09IG5hbWU7XG4gIGZhY3RvcnkubmdNZXRhZGF0YU5hbWUgPSBuYW1lO1xuICByZXR1cm4gZmFjdG9yeTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBSb3V0ZSB7XG4gIGNoaWxkcmVuPzogUm91dGVbXTtcbiAgbG9hZENoaWxkcmVuPzogc3RyaW5nfFR5cGV8YW55O1xufVxuXG4vKipcbiAqIEZsYWdzIHVzZWQgdG8gZ2VuZXJhdGUgUjMtc3R5bGUgQ1NTIFNlbGVjdG9ycy4gVGhleSBhcmUgcGFzdGVkIGZyb21cbiAqIGNvcmUvc3JjL3JlbmRlcjMvcHJvamVjdGlvbi50cyBiZWNhdXNlIHRoZXkgY2Fubm90IGJlIHJlZmVyZW5jZWQgZGlyZWN0bHkuXG4gKi9cbmV4cG9ydCBjb25zdCBlbnVtIFNlbGVjdG9yRmxhZ3Mge1xuICAvKiogSW5kaWNhdGVzIHRoaXMgaXMgdGhlIGJlZ2lubmluZyBvZiBhIG5ldyBuZWdhdGl2ZSBzZWxlY3RvciAqL1xuICBOT1QgPSAwYjAwMDEsXG5cbiAgLyoqIE1vZGUgZm9yIG1hdGNoaW5nIGF0dHJpYnV0ZXMgKi9cbiAgQVRUUklCVVRFID0gMGIwMDEwLFxuXG4gIC8qKiBNb2RlIGZvciBtYXRjaGluZyB0YWcgbmFtZXMgKi9cbiAgRUxFTUVOVCA9IDBiMDEwMCxcblxuICAvKiogTW9kZSBmb3IgbWF0Y2hpbmcgY2xhc3MgbmFtZXMgKi9cbiAgQ0xBU1MgPSAwYjEwMDAsXG59XG5cbi8vIFRoZXNlIGFyZSBhIGNvcHkgdGhlIENTUyB0eXBlcyBmcm9tIGNvcmUvc3JjL3JlbmRlcjMvaW50ZXJmYWNlcy9wcm9qZWN0aW9uLnRzXG4vLyBUaGV5IGFyZSBkdXBsaWNhdGVkIGhlcmUgYXMgdGhleSBjYW5ub3QgYmUgZGlyZWN0bHkgcmVmZXJlbmNlZCBmcm9tIGNvcmUuXG5leHBvcnQgdHlwZSBSM0Nzc1NlbGVjdG9yID0gKHN0cmluZyB8IFNlbGVjdG9yRmxhZ3MpW107XG5leHBvcnQgdHlwZSBSM0Nzc1NlbGVjdG9yTGlzdCA9IFIzQ3NzU2VsZWN0b3JbXTtcblxuZnVuY3Rpb24gcGFyc2VyU2VsZWN0b3JUb1NpbXBsZVNlbGVjdG9yKHNlbGVjdG9yOiBDc3NTZWxlY3Rvcik6IFIzQ3NzU2VsZWN0b3Ige1xuICBjb25zdCBjbGFzc2VzID0gc2VsZWN0b3IuY2xhc3NOYW1lcyAmJiBzZWxlY3Rvci5jbGFzc05hbWVzLmxlbmd0aCA/XG4gICAgICBbU2VsZWN0b3JGbGFncy5DTEFTUywgLi4uc2VsZWN0b3IuY2xhc3NOYW1lc10gOlxuICAgICAgW107XG4gIGNvbnN0IGVsZW1lbnROYW1lID0gc2VsZWN0b3IuZWxlbWVudCAmJiBzZWxlY3Rvci5lbGVtZW50ICE9PSAnKicgPyBzZWxlY3Rvci5lbGVtZW50IDogJyc7XG4gIHJldHVybiBbZWxlbWVudE5hbWUsIC4uLnNlbGVjdG9yLmF0dHJzLCAuLi5jbGFzc2VzXTtcbn1cblxuZnVuY3Rpb24gcGFyc2VyU2VsZWN0b3JUb05lZ2F0aXZlU2VsZWN0b3Ioc2VsZWN0b3I6IENzc1NlbGVjdG9yKTogUjNDc3NTZWxlY3RvciB7XG4gIGNvbnN0IGNsYXNzZXMgPSBzZWxlY3Rvci5jbGFzc05hbWVzICYmIHNlbGVjdG9yLmNsYXNzTmFtZXMubGVuZ3RoID9cbiAgICAgIFtTZWxlY3RvckZsYWdzLkNMQVNTLCAuLi5zZWxlY3Rvci5jbGFzc05hbWVzXSA6XG4gICAgICBbXTtcblxuICBpZiAoc2VsZWN0b3IuZWxlbWVudCkge1xuICAgIHJldHVybiBbXG4gICAgICBTZWxlY3RvckZsYWdzLk5PVCB8IFNlbGVjdG9yRmxhZ3MuRUxFTUVOVCwgc2VsZWN0b3IuZWxlbWVudCwgLi4uc2VsZWN0b3IuYXR0cnMsIC4uLmNsYXNzZXNcbiAgICBdO1xuICB9IGVsc2UgaWYgKHNlbGVjdG9yLmF0dHJzLmxlbmd0aCkge1xuICAgIHJldHVybiBbU2VsZWN0b3JGbGFncy5OT1QgfCBTZWxlY3RvckZsYWdzLkFUVFJJQlVURSwgLi4uc2VsZWN0b3IuYXR0cnMsIC4uLmNsYXNzZXNdO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBzZWxlY3Rvci5jbGFzc05hbWVzICYmIHNlbGVjdG9yLmNsYXNzTmFtZXMubGVuZ3RoID9cbiAgICAgICAgW1NlbGVjdG9yRmxhZ3MuTk9UIHwgU2VsZWN0b3JGbGFncy5DTEFTUywgLi4uc2VsZWN0b3IuY2xhc3NOYW1lc10gOlxuICAgICAgICBbXTtcbiAgfVxufVxuXG5mdW5jdGlvbiBwYXJzZXJTZWxlY3RvclRvUjNTZWxlY3RvcihzZWxlY3RvcjogQ3NzU2VsZWN0b3IpOiBSM0Nzc1NlbGVjdG9yIHtcbiAgY29uc3QgcG9zaXRpdmUgPSBwYXJzZXJTZWxlY3RvclRvU2ltcGxlU2VsZWN0b3Ioc2VsZWN0b3IpO1xuXG4gIGNvbnN0IG5lZ2F0aXZlOiBSM0Nzc1NlbGVjdG9yTGlzdCA9IHNlbGVjdG9yLm5vdFNlbGVjdG9ycyAmJiBzZWxlY3Rvci5ub3RTZWxlY3RvcnMubGVuZ3RoID9cbiAgICAgIHNlbGVjdG9yLm5vdFNlbGVjdG9ycy5tYXAobm90U2VsZWN0b3IgPT4gcGFyc2VyU2VsZWN0b3JUb05lZ2F0aXZlU2VsZWN0b3Iobm90U2VsZWN0b3IpKSA6XG4gICAgICBbXTtcblxuICByZXR1cm4gcG9zaXRpdmUuY29uY2F0KC4uLm5lZ2F0aXZlKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlU2VsZWN0b3JUb1IzU2VsZWN0b3Ioc2VsZWN0b3I6IHN0cmluZyk6IFIzQ3NzU2VsZWN0b3JMaXN0IHtcbiAgY29uc3Qgc2VsZWN0b3JzID0gQ3NzU2VsZWN0b3IucGFyc2Uoc2VsZWN0b3IpO1xuICByZXR1cm4gc2VsZWN0b3JzLm1hcChwYXJzZXJTZWxlY3RvclRvUjNTZWxlY3Rvcik7XG59XG5cbi8vIFBhc3RlZCBmcm9tIHJlbmRlcjMvaW50ZXJmYWNlcy9kZWZpbml0aW9uIHNpbmNlIGl0IGNhbm5vdCBiZSByZWZlcmVuY2VkIGRpcmVjdGx5XG4vKipcbiAqIEZsYWdzIHBhc3NlZCBpbnRvIHRlbXBsYXRlIGZ1bmN0aW9ucyB0byBkZXRlcm1pbmUgd2hpY2ggYmxvY2tzIChpLmUuIGNyZWF0aW9uLCB1cGRhdGUpXG4gKiBzaG91bGQgYmUgZXhlY3V0ZWQuXG4gKlxuICogVHlwaWNhbGx5LCBhIHRlbXBsYXRlIHJ1bnMgYm90aCB0aGUgY3JlYXRpb24gYmxvY2sgYW5kIHRoZSB1cGRhdGUgYmxvY2sgb24gaW5pdGlhbGl6YXRpb24gYW5kXG4gKiBzdWJzZXF1ZW50IHJ1bnMgb25seSBleGVjdXRlIHRoZSB1cGRhdGUgYmxvY2suIEhvd2V2ZXIsIGR5bmFtaWNhbGx5IGNyZWF0ZWQgdmlld3MgcmVxdWlyZSB0aGF0XG4gKiB0aGUgY3JlYXRpb24gYmxvY2sgYmUgZXhlY3V0ZWQgc2VwYXJhdGVseSBmcm9tIHRoZSB1cGRhdGUgYmxvY2sgKGZvciBiYWNrd2FyZHMgY29tcGF0KS5cbiAqL1xuZXhwb3J0IGNvbnN0IGVudW0gUmVuZGVyRmxhZ3Mge1xuICAvKiBXaGV0aGVyIHRvIHJ1biB0aGUgY3JlYXRpb24gYmxvY2sgKGUuZy4gY3JlYXRlIGVsZW1lbnRzIGFuZCBkaXJlY3RpdmVzKSAqL1xuICBDcmVhdGUgPSAwYjAxLFxuXG4gIC8qIFdoZXRoZXIgdG8gcnVuIHRoZSB1cGRhdGUgYmxvY2sgKGUuZy4gcmVmcmVzaCBiaW5kaW5ncykgKi9cbiAgVXBkYXRlID0gMGIxMFxufVxuXG5leHBvcnQgY29uc3QgZW51bSBJbml0aWFsU3R5bGluZ0ZsYWdzIHtcbiAgVkFMVUVTX01PREUgPSAwYjEsXG59XG5cbi8vIFBhc3RlZCBmcm9tIHJlbmRlcjMvaW50ZXJmYWNlcy9ub2RlLnRzXG4vKipcbiAqIEEgc2V0IG9mIG1hcmtlciB2YWx1ZXMgdG8gYmUgdXNlZCBpbiB0aGUgYXR0cmlidXRlcyBhcnJheXMuIFRob3NlIG1hcmtlcnMgaW5kaWNhdGUgdGhhdCBzb21lXG4gKiBpdGVtcyBhcmUgbm90IHJlZ3VsYXIgYXR0cmlidXRlcyBhbmQgdGhlIHByb2Nlc3Npbmcgc2hvdWxkIGJlIGFkYXB0ZWQgYWNjb3JkaW5nbHkuXG4gKi9cbmV4cG9ydCBjb25zdCBlbnVtIEF0dHJpYnV0ZU1hcmtlciB7XG4gIC8qKlxuICAgKiBNYXJrZXIgaW5kaWNhdGVzIHRoYXQgdGhlIGZvbGxvd2luZyAzIHZhbHVlcyBpbiB0aGUgYXR0cmlidXRlcyBhcnJheSBhcmU6XG4gICAqIG5hbWVzcGFjZVVyaSwgYXR0cmlidXRlTmFtZSwgYXR0cmlidXRlVmFsdWVcbiAgICogaW4gdGhhdCBvcmRlci5cbiAgICovXG4gIE5hbWVzcGFjZVVSSSA9IDAsXG5cbiAgLyoqXG4gICAqIFRoaXMgbWFya2VyIGluZGljYXRlcyB0aGF0IHRoZSBmb2xsb3dpbmcgYXR0cmlidXRlIG5hbWVzIHdlcmUgZXh0cmFjdGVkIGZyb20gYmluZGluZ3MgKGV4LjpcbiAgICogW2Zvb109XCJleHBcIikgYW5kIC8gb3IgZXZlbnQgaGFuZGxlcnMgKGV4LiAoYmFyKT1cImRvU3RoKClcIikuXG4gICAqIFRha2luZyB0aGUgYWJvdmUgYmluZGluZ3MgYW5kIG91dHB1dHMgYXMgYW4gZXhhbXBsZSBhbiBhdHRyaWJ1dGVzIGFycmF5IGNvdWxkIGxvb2sgYXMgZm9sbG93czpcbiAgICogWydjbGFzcycsICdmYWRlIGluJywgQXR0cmlidXRlTWFya2VyLlNlbGVjdE9ubHksICdmb28nLCAnYmFyJ11cbiAgICovXG4gIFNlbGVjdE9ubHkgPSAxXG59Il19