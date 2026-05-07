export interface Admin {
  id: string;
  full_name: string;
  phone_number: string;
  password: string;
  is_active: boolean;
  must_change_password: boolean;
  last_login?: Date;
  created_at: Date;
}

export interface AdminLoginRequest {
  phone_number: string;
  password: string;
}

export interface AdminLoginResponse {
  admin: Omit<Admin, 'password'>;
  success: boolean;
  message: string;
}
