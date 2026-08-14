export interface LoginForm {
    username: string;
    password: string;
}
export interface User {
    id: string;
    email: string;
    username: string;
    displayName?: string;
}