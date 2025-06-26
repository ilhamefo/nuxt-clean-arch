// UserRepository defines the contract for user authentication
import type { User } from '../entities/User';

export interface UserRepository {
  login(username: string, password: string): Promise<User>;
  logout(): Promise<void>;
  getCurrentUser(): Promise<User | null>;
}
