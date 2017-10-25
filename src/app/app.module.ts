import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { WelcomePage } from '../pages/welcome/welcome';
import { LoginPage } from '../pages/login/login';
import { SignupPage } from '../pages/signup/signup';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { TabsPage } from '../pages/tabs/tabs';
import { WorkoutPage } from '../pages/workout/workout';
import { StatsPage } from '../pages/stats/stats';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { FirebaseErrorParserProvider } from '../providers/firebase-error-parser/firebase-error-parser';

const FIREBASE_CONFIG = {
  apiKey: "AIzaSyCI0IpbG1D3dqRXIZW0vCCu-l6MvfR4T5w",
  authDomain: "swet-2a86e.firebaseapp.com",
  databaseURL: "https://swet-2a86e.firebaseio.com",
  projectId: "swet-2a86e",
  storageBucket: "",
  messagingSenderId: "832441574128"
};


@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,
    WelcomePage,
    LoginPage,
    SignupPage,
    TabsPage,
    StatsPage,
    WorkoutPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(FIREBASE_CONFIG),
    AngularFireDatabaseModule,
    AngularFireAuthModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    WelcomePage,
    LoginPage,
    SignupPage,
    HomePage,
    ListPage,
    TabsPage,
    StatsPage,
    WorkoutPage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    AngularFireAuth,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    FirebaseErrorParserProvider,
  ]
})
export class AppModule {}
