export class RegisterUserRequest {
  username: string;
  name: string;
  phone: string;
  email: string;
  role: string;
  password: string;
}

export class LoginUserRequest {
  email: string;
  password: string;
}

export class UserResponse {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  token: string | null;
  role: string;
}

export class UserUpdateRequest {
  name: string;
  phone: string;
  email: string;
  username: string;
}
