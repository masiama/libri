import { books, locations } from '@prisma/client';

import { Type } from '../../../src/types';

export const API_ROOT = import.meta.env.VITE_API_ROOT;

export async function getLocations(): Promise<locations[]> {
  const response = await fetch(`${API_ROOT}/locations`);
  return response.json();
}

export async function getBooks(): Promise<books[]> {
  const response = await fetch(`${API_ROOT}/books`);
  return response.json();
}

export async function getBook(
  isbn: string,
): Promise<{ data: books } | { error: string }> {
  const response = await fetch(`${API_ROOT}/book/${isbn}`);
  return response.json();
}

export async function saveBook(data: {
  type: Type;
  isbn: string;
  title?: string;
  author?: string;
  locationId: string;
}): Promise<books | { error: string }> {
  const { isbn, ...body } = data;
  try {
    const response = await fetch(`${API_ROOT}/book/${isbn}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    return response.json();
  } catch (e) {
    console.error(e);
    return { error: 'Failed to add book' };
  }
}
