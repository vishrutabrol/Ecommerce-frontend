import type { User } from '../types/user'

type AuthResponse = {
    success: boolean;
};

export const fakeSignup = async (user: User): Promise<AuthResponse> => {
    return new Promise((resolve) => {
        setTimeout(() => resolve({ success: true }), 1000)
    })
}

export const fakeLogin = async (user: User): Promise<AuthResponse> => {
    return new Promise((resolve) => {
        setTimeout(() => resolve({ success: true }), 1000)
    })
}