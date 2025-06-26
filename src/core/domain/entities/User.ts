// User entity represents the core user data structure
export interface User {
  id: string;
  username: string;
  token?: string;
}

export interface OAuthUrlResponse {
  data: {
    url: string;
  };
  message: string;
  status: number;
}