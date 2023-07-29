import { books, locations } from '@prisma/client';
import { create } from 'zustand';
import { getBooks, getLocations } from './api';

interface State {
  books: books[];
  locations: locations[];
  addBook: (book: books) => void;
}

export const useStore = create<State>()((set, get) => ({
  books: [],
  locations: [],
  addBook: book => set({ books: [...get().books, book] }),
}));

getBooks().then(books => useStore.setState({ books }));
getLocations().then(locations => useStore.setState({ locations }));
