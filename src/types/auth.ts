export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  school: string;
  department: string;
}

export interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  login: () => void;
  logout: () => void;
}
