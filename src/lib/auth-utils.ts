
import { GoogleAuthProvider } from 'firebase/auth';
import { auth } from './firebase';

export function getAuthOrThrow() {
    if (!auth) {
        throw new Error("Firebase Auth not initialized");
    }
    return auth;
}

export function getProviderOrThrow() {
    return new GoogleAuthProvider();
}