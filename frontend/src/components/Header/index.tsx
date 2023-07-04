const Header = () => {
  return (
    <header className="sticky top-0 z-50">
      <nav className="border-gray-200 bg-white bg-opacity-80 py-2.5 dark:bg-gray-800 dark:bg-opacity-80">
        <div className="mx-auto flex max-w-screen-xl flex-wrap items-center justify-between">
          <a
            href="/"
            className="whitespace-nowrap text-xl font-semibold dark:text-white"
          >
            Libri
          </a>
          <div className="flex items-center gap-2 lg:order-2">
            <button className="rounded-lg px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-gray-300 dark:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-800 lg:px-5 lg:py-2.5">
              Check book
            </button>
            <button className="bg-primary-700 hover:bg-primary-800 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 rounded-lg px-4 py-2 text-sm font-medium text-white focus:outline-none focus:ring-4 lg:px-5 lg:py-2.5">
              Add book
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
