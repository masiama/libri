import { books } from '@prisma/client';

export const API_ROOT = import.meta.env.VITE_API_ROOT;

export async function getBooks(): Promise<books[]> {
  const response = await fetch(`${API_ROOT}/books`);
  return response.json();
}
