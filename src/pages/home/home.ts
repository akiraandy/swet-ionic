import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AngularFirestore } from 'angularfire2/firestore'

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController, private db: AngularFirestore) {
    
  }

  changeUserDate(){
    let user = this.db.collection('users').doc('Xc2BFlt27gh7xPK3qb2FpR9Nw2p1');

    var updateTimestamp = user.update({
      updated_at: this.db.firestore.FieldValue.serverTimeStamp()
    }).then(res => {
      console.log("Succes", res);
    })
    .catch(error => {
      console.log(error);
    });
  }

}


