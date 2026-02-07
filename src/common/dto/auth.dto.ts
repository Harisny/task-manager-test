export class RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export class LoginRequest {
  email: string;
  password: string;
}

export class LoginResponse {
  accessToken: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export type AuthUser = {
  id: string;
  email: string;
  name: string;
};
