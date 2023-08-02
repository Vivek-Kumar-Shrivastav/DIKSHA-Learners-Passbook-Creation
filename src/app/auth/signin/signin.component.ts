import { Component } from '@angular/core';
import { NgForm, PatternValidator } from '@angular/forms';


@Component({
  selector: 'app-signup',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent {

  emailId :string ='';
  password :string ='';
  signIn(form : NgForm){
    console.log("Signned In: ",form.form.value);
  }
  getEmail(){

  }
}
