import { ElementSchemaRegistry } from "@angular/compiler";
import { SchemaMetadata } from "@angular/core";
export declare enum SecurityContext {
    NONE = 0,
    HTML = 1,
    STYLE = 2,
    SCRIPT = 3,
    URL = 4,
    RESOURCE_URL = 5
}
export declare class NativeScriptElementSchemaRegistry extends ElementSchemaRegistry {
    hasProperty(_tagName: string, _propName: string): boolean;
    hasElement(_tagName: string, _schemaMetas: SchemaMetadata[]): boolean;
    getMappedPropName(propName: string): string;
    getDefaultComponentElementName(): string;
    securityContext(_tagName: string, _propName: string): any;
    validateProperty(_name: string): {
        error: boolean;
        msg?: string;
    };
    validateAttribute(_name: string): {
        error: boolean;
        msg?: string;
    };
    allKnownElementNames(): string[];
    normalizeAnimationStyleProperty(propName: string): string;
    normalizeAnimationStyleValue(_camelCaseProp: string, _userProvidedProp: string, val: string | number): {
        error: string;
        value: string;
    };
}
