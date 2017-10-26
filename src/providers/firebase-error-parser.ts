import { Injectable } from '@angular/core';
import { ToastController } from 'ionic-angular';
@Injectable()
export class FirebaseErrorParserProvider {

  constructor(public toast: ToastController) {
    
  }

  pop_toast(error: string) {
    console.log(error)
    let parsed_message = this.parse_auth_error(error)
    this.toast.create({
      message: parsed_message,
      duration: 3000
    }).present();
  }

  parse_auth_error(error) {
    let answer = ""
    switch(error.code) {
      case "auth/wrong-password": {
        answer = "Username or password was incorrect."
        break;
      }
      case "auth/weak-password": {
        answer = "Password should be at least 6 characters."
        break;
      }
      case "auth/user-not-found": {
        answer = "Username or password was incorrect."
        break;
      }
      case "auth/too-many-requests": {
        answer = "Too many requests. Please wait before submitting again."
        break;
      }
      case "auth/argument-error": {
        answer = "Please enter your email and password."
        break;
      }
      case "auth/invalid-email": {
        answer = "Please enter a valid email address."
        break;
      }
      case "auth/email-already-in-use": {
        answer = "That email is already in use."
        break;
      }
      default: {
        answer = "Something went wrong"
        break;
      }
    }
    return answer
  }
}
