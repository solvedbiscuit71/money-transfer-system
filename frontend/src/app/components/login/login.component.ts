import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AccountMaskDirective } from 'app/directives/account-mask.directive';
import { validConfirmPassword, validPassword } from 'app/validators/password.validator';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [ReactiveFormsModule, CommonModule, AccountMaskDirective],
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent {
    loginForm!: FormGroup;
    signupForm!: FormGroup;
    submitted = signal(false);
    isLoading = signal(false);
    showLoginForm = signal(true);
    errorMessage = signal("");

    constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) { }

    ngOnInit() {
        this.loginForm = this.fb.group({
            username: ['', [Validators.required, Validators.minLength(14), Validators.maxLength(14)]],
            password: ['', [Validators.required, Validators.minLength(8)]]
        });

        this.signupForm = this.fb.group({
            firstName: ['', [Validators.required]],
            lastName: ['', [Validators.required]],
            password: ['', [Validators.required, Validators.minLength(8), validPassword()]],
            confirmPassword: ['', [Validators.required]]
        }, 
        { validators: validConfirmPassword() });
    }

    onChangeForm(showLogin: boolean) {
        this.submitted.set(false)
        this.showLoginForm.set(showLogin)
    }

    onLogin() {
        // set to true
        this.submitted.set(true)

        if (this.loginForm.valid) {
            this.isLoading.set(true)
            this.errorMessage.set("")
            const { username, password } = this.loginForm.value;
            this.authService.login(username, password).subscribe({
                next: (response) => {
                    if (response.ok) {
                        this.router.navigate(['/transactions']);
                    } else {
                        this.errorMessage.set("Invalid credentials")
                    }
                    this.isLoading.set(false)
                },
                error: (err) => {
                    this.errorMessage.set("Invalid credentials")
                    this.isLoading.set(false)
                }
            });
        }
    }

    onSignUp() {
        // set to true
        this.submitted.set(true)

        if (this.signupForm.valid) {
            this.isLoading.set(true)
            this.errorMessage.set("")
            const { firstName, lastName, password } = this.signupForm.value;
            const holderName = firstName + ' ' + lastName;

            this.authService.signup(holderName, password).subscribe({
                next: () => {
                    this.isLoading.set(false)
                    this.router.navigate(['/transactions']);
                },
                error: () => {
                    this.errorMessage.set("Failed, Try again")
                    this.isLoading.set(false)
                }
            });
        }
    }
}
