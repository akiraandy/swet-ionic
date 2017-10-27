import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Events } from 'ionic-angular';

@Injectable()
export class UserService {    
  firstName: string;
  lastName: string;
  id: string;
  email: string;
  DoB: string;
  nameObserver: any;


  constructor(events: Events) {
  }

  setUser(args) {
      this.id = args["id"];
      this.firstName = args["first"];
      this.lastName = args["last"]; 
      this.email = args["email"];
      this.DoB = args["DoB"];
  }

  getUserName() {
      return this.firstName + ' ' + this.lastName;
  } 

  getUserFirstName() {
      return this.firstName;
  }

  getUserLastName() {
      return this.lastName;
  }


  
}