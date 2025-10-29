export type Producer = {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  website?: string;
  description?: string;
  wines?: Wine[];
}

type Wine = {
  id: string;
  name: string;
}