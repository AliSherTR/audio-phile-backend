export interface User {
    id: number;
    email: string;
    name: string;
    role: "ADMIN" | "USER";
    password: string;
    image: string;
}
