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