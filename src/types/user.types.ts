export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  mobile: string;
  createdAt: string;
}

export interface RegistrationFormData {
  name: string;
  username: string;
  email: string;
  mobile: string;
}
