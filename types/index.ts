export type Role = "user" | "admin";

export interface UserProfile {
  uid: string;
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  role: Role;
  photoURL?: string | null;
  emailVerified?: boolean;
  createdAt?: any;
  updatedAt?: any;
}
