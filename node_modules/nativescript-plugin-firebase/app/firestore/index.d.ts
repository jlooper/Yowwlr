import * as firebase from "../../firebase";
export declare namespace firestore {
    class Firestore {
        collection(collectionPath: string): firebase.firestore.CollectionReference;
        doc(path: string): firebase.firestore.DocumentReference;
        FieldValue(): firebase.firestore.FieldValue;
        GeoPoint(latitude: number, longitude: number): firebase.firestore.GeoPoint;
        runTransaction<T>(updateFunction: (transaction: firebase.firestore.Transaction) => Promise<any>): Promise<void>;
        batch(): firebase.firestore.WriteBatch;
    }
}
