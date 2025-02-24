function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">Hello ICP</h1>

          {/* Card */}
          <div className="bg-white shadow-lg rounded-lg p-6">
            <p className="text-gray-600 text-center mb-4">Welcome to your Internet Computer dapp</p>
            <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md transition duration-200">
              Click me!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
