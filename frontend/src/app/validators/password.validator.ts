import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function validPassword(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const value: string = control.value || '';

        const hasUpperCase = /[A-Z]/.test(value);
        const hasDigit = /\d/.test(value);
        const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value);

        if (!hasUpperCase || !hasDigit || !hasSpecialChar) {
            return { invalidPassword: true };
        }
        return null;
    };
}

export function validConfirmPassword(): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
        const password = group.get('password');
        const confirmPassword = group.get('confirmPassword');

        if (!password || !confirmPassword) {
            return null;
        }

        // Don't override an existing error on confirmPassword that came from elsewhere
        if (confirmPassword.errors && !confirmPassword.errors['passwordMismatch']) {
            return null;
        }

        if (password.value !== confirmPassword.value) {
            confirmPassword.setErrors({ passwordMismatch: true });
            return { passwordMismatch: true };
        }

        confirmPassword.setErrors(null);
        return null;
    };
}
