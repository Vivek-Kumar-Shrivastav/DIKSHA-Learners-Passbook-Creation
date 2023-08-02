import { Component } from '@angular/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
    email : string= '';
    password : string ="";
    confirm_password : string ="";
    registerForm(){
      console.log("Registered");
    }
}
