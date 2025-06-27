// UserService implements UserRepository using ApiClient
import type { OAuthUrlResponse, User, UserResponse } from '../../core/domain/entities/User';
import type { UserRepository } from '../../core/domain/repositories/UserRepository';
import api from '../api/ApiClient';

export class UserService implements UserRepository {
  async login(username: string, password: string): Promise<User> {
    const { data } = await api.post('/login', { username, password });
    return data;
  }

  async logout(): Promise<void> {
    await api.post('/logout');
  }

  async getCurrentUser(): Promise<User | null> {
    const { data } = await api.get('/me');
    return data ?? null;
  }

  async register(email: string, password: string): Promise<User> {
    const { data } = await api.post('/register', { email, password });
    return data;
  }

  async loginWithGoogle(): Promise<OAuthUrlResponse> {
    const { data } = await api.get('/auth/google/login-url');
    return data;
  }

  async googleAuthCallback(code: string, state: string): Promise<OAuthUrlResponse> {
    const { data } = await api.get(`/auth/google/callback?code=${code}&state=${state}`);
    return data;
  }

  async fetchUser(): Promise<UserResponse | null> {
    const { data } = await api.get('/me');

    return data ?? null;
  }

  async refreshToken(): Promise<UserResponse | null> {
    const { data } = await api.get('/refresh-token');

    return data ?? null;
  }
}
