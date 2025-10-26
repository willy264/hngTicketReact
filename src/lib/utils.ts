import type { Ticket } from "./types";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const mockUsers = [
  {
    id: "1",
    name: "Test User",
    email: "test@example.com",
    password: "password123",
  },
];

const loadTickets = (userId: string): Ticket[] => {
  const savedTickets = localStorage.getItem(`tickets_${userId}`);
  return savedTickets ? JSON.parse(savedTickets) : [];
};

const saveTickets = (tickets: Ticket[], userId: string) => {
  localStorage.setItem(`tickets_${userId}`, JSON.stringify(tickets));
};

let currentUserId: string | null = null;
const userTickets: { [key: string]: Ticket[] } = {};

export const setCurrentUser = (userId: string) => {
  currentUserId = userId;
  if (!userTickets[userId]) {
    userTickets[userId] = loadTickets(userId);
  }
};

export const mockAuthApi = {
  login: async (email: string, password: string) => {
    await delay(500);
    const user = mockUsers.find(
      (u) => u.email === email && u.password === password
    );
    if (!user) {
      throw new Error("Invalid credentials");
    }
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },

  signup: async (name: string, email: string, password: string) => {
    await delay(500);
    if (mockUsers.some((u) => u.email === email)) {
      throw new Error("Email already exists");
    }
    const newUser = {
      id: String(mockUsers.length + 1),
      name,
      email,
      password,
    };
    mockUsers.push(newUser);
    const { password: _, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  },
};

export const mockTicketsApi = {
  list: async () => {
    await delay(500);
    if (!currentUserId) throw new Error("No user logged in");
    if (!userTickets[currentUserId]) {
      userTickets[currentUserId] = loadTickets(currentUserId);
    }
    return [...userTickets[currentUserId]];
  },

  create: async (ticket: Omit<Ticket, "id">) => {
    await delay(500);
    if (!currentUserId) throw new Error("No user logged in");
    const newTicket = {
      ...ticket,
      id: String(Date.now()),
      userId: currentUserId,
    };
    if (!userTickets[currentUserId]) {
      userTickets[currentUserId] = loadTickets(currentUserId);
    }
    userTickets[currentUserId].push(newTicket);
    saveTickets(userTickets[currentUserId], currentUserId);
    return newTicket;
  },

  update: async (id: string, updates: Partial<Ticket>) => {
    await delay(500);
    if (!currentUserId) throw new Error("No user logged in");
    if (!userTickets[currentUserId]) {
      userTickets[currentUserId] = loadTickets(currentUserId);
    }
    const index = userTickets[currentUserId].findIndex(
      (t) => t.id === id && t.userId === currentUserId
    );
    if (index === -1) {
      throw new Error("Ticket not found");
    }
    userTickets[currentUserId][index] = {
      ...userTickets[currentUserId][index],
      ...updates,
    };
    saveTickets(userTickets[currentUserId], currentUserId);
    return userTickets[currentUserId][index];
  },

  delete: async (id: string) => {
    await delay(500);
    if (!currentUserId) throw new Error("No user logged in");
    if (!userTickets[currentUserId]) {
      userTickets[currentUserId] = loadTickets(currentUserId);
    }
    const index = userTickets[currentUserId].findIndex(
      (t) => t.id === id && t.userId === currentUserId
    );
    if (index === -1) {
      throw new Error("Ticket not found");
    }
    userTickets[currentUserId].splice(index, 1);
    saveTickets(userTickets[currentUserId], currentUserId);
  },

  getStats: async () => {
    await delay(200);
    if (!currentUserId) throw new Error("No user logged in");
    if (!userTickets[currentUserId]) {
      userTickets[currentUserId] = loadTickets(currentUserId);
    }
    const tickets = userTickets[currentUserId];
    return {
      total: tickets.length,
      open: tickets.filter((t) => t.status === "open").length,
      inProgress: tickets.filter((t) => t.status === "in_progress").length,
      closed: tickets.filter((t) => t.status === "closed").length,
    };
  },
};