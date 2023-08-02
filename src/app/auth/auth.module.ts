import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegisterComponent } from './register/register.component';
import { SigninComponent } from './signin/signin.component';
import { FormsModule, 
  Validator,
	ValidationErrors,
	FormGroup,
	NG_VALIDATORS,
	NgForm,
	Validators } from '@angular/forms';
import { __exportStar } from 'tslib';



@NgModule({
  declarations: [
    RegisterComponent,
    SigninComponent,
  ],
  imports: [
    CommonModule,
    FormsModule, 
  ]
})
export  class AuthModule { }
