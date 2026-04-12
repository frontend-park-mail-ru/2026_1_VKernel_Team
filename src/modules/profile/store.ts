export interface UserProfile {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  [key: string]: any;
}

export interface AppState {
  isAuthenticated: boolean;
  user: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  currentPage: string;
}
