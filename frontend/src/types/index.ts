export interface User {
    id: string;
    name: string;
    email: string;
}

export interface Client {
    id: string;
    name: string;
    email?: string;
    phone?: string;
    createdAt: string;
}

export interface Project {
    id: string;
    name: string;
    description?: string;
    status: 'ACTIVE' | 'COMPLETED'
    value?: number;
    paid: boolean;
    clientId: string;
    client: Client;
    tasks: Task[];
    createdAt: string;
}

export interface Task {
    id: string;
    title: string;
    status: 'TODO' | 'DOING' | 'DONE';
    priority: 'LOW' | 'MEDIUM' | 'HIGH';
    projectId: string;
    project: Project;
    createdAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}