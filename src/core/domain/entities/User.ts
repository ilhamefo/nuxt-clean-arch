export interface User {
  id: string;
  email: string;
  name: string;
  picture: string;
  created_at: string;
  updated_at: string;
  email_verified_at: string;
  verified_email: boolean;
}

export interface OAuthUrlResponse {
  data: {
    url: string;
  };
  message: string;
  status: number;
}

export interface UserResponse {
  data: {
    user: User;
  };
  message: string;
  status: number;
}

export interface Response<T = any> {
  data: T[];
  message: string;
  status: number;
}

export interface UserVCC {
  id: string;
  email: string;
  username: string;
  email_verified_at: string | null;
  api_token: string | null;
  last_login: string | null;
  full_name: string;
  password: string;
  jabatan: string;
  department: string;
  company: string;
  nip: string;
  level: number;
  unit_code: string;
  unit_name: string;
  status: number;
  is_blocked: boolean;
  rejected_at: string | null;
  remember_token: string | null;
  phone: string | null;
  created_at: string;
  updated_at: string | null;
  roles: Role[] | null;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  level: number;
  is_enabled: boolean;
  is_command_center: boolean;
  created_at: string;
  updated_at: string;
}

export interface Unit {
  label: string;
  code: string;
}

export interface UpdateUserPayload {
  email: string;
  full_name: string;
  jabatan: string;
  level: string | null;
  roles: string[];
  status: string | null;
  unit_code: string;
  unit_name: string;
  username: string;
  is_blocked: boolean;
  password: string | null;
  password_confirmation: string | null;
}

export interface UpdateIsBlockedPayload {
  id: string;
  is_blocked: boolean;
}

export interface SearchUserPayload {
  keyword: string;
  is_blocked: boolean;
}