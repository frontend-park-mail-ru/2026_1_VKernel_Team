// ДОБАВИТЬ ЭТУ СТРОКУ В САМОЕ НАЧАЛО:
import type { User } from '@/types'; 

export interface AppState {
    isAuthenticated: boolean;
    user: User | null; 
    isLoading: boolean;
    error: string | null;
    currentPage: string;
}

