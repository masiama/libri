import Grid from './components/Grid';
import Header from './components/Header';

const App = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-800">
      <main className="container mx-auto px-4">
        <Header />
        <Grid />
      </main>
    </div>
  );
};

export default App;
