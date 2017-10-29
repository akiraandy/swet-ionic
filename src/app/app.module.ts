import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { FirebaseErrorParserProvider } from '../providers/firebase-error-parser';
import { FirebaseService } from '../services/firebase-service';
import { AngularFireDatabaseModule } from 'angularfire2/database';

import { UserService } from '../services/user-service';


const FIREBASE_CONFIG = {
  apiKey: "AIzaSyCI0IpbG1D3dqRXIZW0vCCu-l6MvfR4T5w",
  authDomain: "swet-2a86e.firebaseapp.com",
  databaseURL: "https://swet-2a86e.firebaseio.com",
  projectId: "swet-2a86e",
  storageBucket: "swet-2a86e.appspot.com",
  messagingSenderId: "832441574128"
};


@NgModule({
  declarations: [
    MyApp,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp, {
      spinner: 'crescent'
    }),
    AngularFireModule.initializeApp(FIREBASE_CONFIG),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireDatabaseModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
  ],
  providers: [
    UserService,
    StatusBar,
    SplashScreen,
    AngularFireAuth,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    FirebaseService,
    FirebaseErrorParserProvider,
    AngularFirestoreModule,
    AngularFireDatabaseModule,
  ]
})
export class AppModule {}
