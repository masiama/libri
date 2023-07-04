import { useStore } from '../../utils/store';

const Grid = () => {
  const books = useStore(store => store.books);

  return (
    <div className="grid grid-cols-2 gap-4 py-4 md:grid-cols-4 lg:grid-cols-7">
      {books.map(book => (
        <div key={book.isbn} className="text-center dark:text-white">
          <div className="h-[200px]">
            {book.thumbnail && (
              <img
                className="mx-auto h-full rounded-lg"
                src={book.thumbnail}
                alt={book.title}
              />
            )}
          </div>
          <div className="mt-2">{book.title}</div>
          {book.author && <div className="mt-2 opacity-50">{book.author}</div>}
        </div>
      ))}
    </div>
  );
};

export default Grid;
