export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6">
      <h1 className="text-4xl font-bold mb-4">Kubys</h1>
      <p className="text-lg text-gray-600 mb-8 text-center max-w-md">
        Bags, veils, and scarves crafted for the modern woman.
      </p>
      <div className="flex gap-4">
        <a href="/browse" className="px-6 py-3 bg-black text-white rounded-lg">
          Browse Collection
        </a>
        <a href="/login" className="px-6 py-3 border border-gray-300 rounded-lg">
          Login
        </a>
      </div>
    </main>
  );
}