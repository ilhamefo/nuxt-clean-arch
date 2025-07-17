import type { OAuthUrlResponse, Response, User, UserResponse, UserVCC, Role, Unit, UpdateUserPayload } from '../../core/domain/entities/User';
import type { UserRepository } from '../../core/domain/repositories/UserRepository';
import api from '../api/ApiClient';

export class UserService implements UserRepository {
  async login(email: string, password: string): Promise<User> {
    try {
      const { data } = await api.post('/auth/login', { email, password });
      return data;
    } catch (error: any) {
      throw error;
    }
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

  async searchUsers(keyword: string): Promise<Response<UserVCC> | null> {
    try {
      const { data } = await api.get('/search-user?keyword=' + keyword);
      return data ?? null;
    } catch (error: any) {
      throw error;
    }
  }

  async loadRoles(): Promise<Response<Role> | null> {
    try {
      const { data } = await api.get('/roles');
      return data ?? null;
    } catch (error: any) {
      throw error;
    }
  }

  async loadUnits(level: string): Promise<Response<Unit> | null> {
    try {
      const { data } = await api.get('/units?level=' + level);
      return data ?? null;
    } catch (error: any) {
      throw error;
    }
  }

  async update(id:string, payload: UpdateUserPayload): Promise<Response<boolean> | null> {
    try {
      const { data } = await api.post('/update/'+id, payload);
      return data ?? null;
    } catch (error: any) {
      throw error;
    }
  }
}
