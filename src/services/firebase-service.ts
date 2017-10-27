import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

import firebase from 'firebase';
import 'firebase/firestore';

@Injectable()
export class FirebaseService {

    private _DB : any;

    constructor() { 
        this._DB = firebase.firestore();
    }

    createAndPopulateDocument(collectionObj : string,
                              docID : string,
                              dataObj : any) : Promise<any>
    {
        return new Promise((resolve, reject) => 
        {
            this._DB
            .collection(collectionObj)
            .doc(docID)
            .set(dataObj, { merge: true})
            .then((data : any) => 
            {
            resolve(data);
            })
            .catch((error : any) => {
                reject(error);
            });
        });
    }

    getUser(userID : string) : Promise<any>
    {
        return new Promise((resolve, reject) => 
        {
            this._DB.collection("users").doc(userID)
            .get()
            .then((doc) =>
            {
                let user : any = {};
                user["id"] = doc.id,
                user["first"] = doc.data().firstName,
                user["last"] = doc.data().lastName,
                user["email"] = doc.data().email,
                user["DoB"] = doc.data().DoB
                resolve(user);
            })
            .catch(error => 
            {
                reject(error);
            });
        });
    }

    addUser(user) {
        const timestamp = firebase.firestore.FieldValue.serverTimestamp();
        this._DB.collection("users").doc(user.id).set({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            DoB: user.dateOfBirth,
            created_at: timestamp,
            updated_at: timestamp
        }).then(res => {
            console.log("User created with ID:", res);
        }).catch(error => {
            console.error("Error adding user: ", error);
        });
    }
}