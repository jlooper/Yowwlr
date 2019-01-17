import * as firebase from "../../firebase";
export declare namespace functions {
    class Functions {
        httpsCallable<I, O>(functionName: string): firebase.functions.HttpsCallable<I, O>;
    }
}
