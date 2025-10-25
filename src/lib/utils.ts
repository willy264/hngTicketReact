import type { Ticket } from "./types";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const mockUsers = [
  {
    id: "1",
    name: "Test User",
    email: "test@example.com",
    password: "password123", 
  },
];

const loadTickets = (): Ticket[] => {
  const savedTickets = localStorage.getItem('tickets');
  if (savedTickets) {
    return JSON.parse(savedTickets);
  }
  return [];
};

const saveTickets = (tickets: Ticket[]) => {
  localStorage.setItem('tickets', JSON.stringify(tickets));
};

let mockTickets: Ticket[] = loadTickets();

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
    const { password: _, ...userWithoutPassword } = newUser; // 
    return userWithoutPassword;
  },
};

export const mockTicketsApi = {
  list: async () => {
    await delay(500);
    mockTickets = loadTickets();
    return [...mockTickets];
  },

  create: async (ticket: Omit<typeof mockTickets[0], "id">) => {
    await delay(500);
    const newTicket = {
      ...ticket,
      id: String(Date.now()),
    };
    mockTickets.push(newTicket);
    saveTickets(mockTickets);
    return newTicket;
  },

  update: async (id: string, updates: Partial<typeof mockTickets[0]>) => {
    await delay(500);
    const index = mockTickets.findIndex((t) => t.id === id);
    if (index === -1) {
      throw new Error("Ticket not found");
    }
    mockTickets[index] = { ...mockTickets[index], ...updates };
    saveTickets(mockTickets);
    return mockTickets[index];
  },

  delete: async (id: string) => {
    await delay(500);
    const index = mockTickets.findIndex((t) => t.id === id);
    if (index === -1) {
      throw new Error("Ticket not found");
    }
    mockTickets.splice(index, 1); 
    saveTickets(mockTickets);
  },

  getStats: async () => {
    await delay(200);
    mockTickets = loadTickets();
    return {
      total: mockTickets.length,
      open: mockTickets.filter(t => t.status === 'open').length,
      inProgress: mockTickets.filter(t => t.status === 'in_progress').length,
      closed: mockTickets.filter(t => t.status === 'closed').length,
    };
  }
};
