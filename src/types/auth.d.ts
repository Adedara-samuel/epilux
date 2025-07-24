// types/auth.d.ts
import { User } from 'firebase/auth';

declare module 'firebase/auth' {
    interface User {
        role?: string;
    }
}