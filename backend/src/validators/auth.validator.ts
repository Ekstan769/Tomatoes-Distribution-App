export const validateRegister = (data: any) => {
    const errors: string[] = [];

    if (!data.first_name) errors.push('First name is required');
    if (!data.last_name) errors.push('Last name is required');
    if (!data.email) errors.push('Email is required');
    if (!data.password) errors.push('Password is required');
    if (!data.password && data.password.length < 6) {
        errors.push('Password must be at least 6 characters');
    }
    return errors;
};