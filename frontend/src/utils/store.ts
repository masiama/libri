import { books } from '@prisma/client';
import { create } from 'zustand';
import { getBooks } from './api';

interface State {
  books: books[];
  addBook: (book: books) => void;
}

export const useStore = create<State>()((set, get) => ({
  books: [],
  addBook: book => set({ books: [...get().books, book] }),
}));

getBooks().then(books => useStore.setState({ books }));
