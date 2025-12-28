import { TodoProvider } from './context/TodoContext';
import { Input } from './components/Input';
import { Board } from './components/Board';
import { CheckSquare } from 'lucide-react';

function App() {
  return (
    <TodoProvider>
      <div className="min-h-screen bg-[#0f1115] text-white font-sans flex flex-col">
        <div className="w-full h-full flex flex-col p-4 md:p-8">
          <header className="mb-6 md:mb-8 text-center space-y-2 shrink-0">
            <div className="flex items-center justify-center gap-3 mb-2">
              <div className="p-2 md:p-3 bg-purple-600 rounded-xl shadow-lg shadow-purple-900/20">
                <CheckSquare className="w-6 h-6 md:w-8 md:h-8 text-white" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                Task Flow
              </h1>
            </div>
            <p className="text-sm md:text-base text-gray-400">Manage your tasks with style and efficiency</p>
          </header>

          <Input />

          <main className="flex-1 min-h-0">
            <Board />
          </main>
        </div>
      </div>
    </TodoProvider>
  );
}

export default App;
