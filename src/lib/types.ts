import type { ReactNode } from "react";

export interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: "default" | "outline" | "danger";
  [x: string]: any;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: "open" | "in_progress" | "closed";
  priority: "low" | "medium" | "high";
}

export interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
}