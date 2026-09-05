export default function Register() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6">
      <h1 className="text-3xl font-bold mb-6">Create Your Kubys Account</h1>
      <form className="flex flex-col gap-4 w-full max-w-sm">
        <input type="email" placeholder="Email" className="border border-gray-300 rounded-lg px-4 py-2" />
        <input type="password" placeholder="Password" className="border border-gray-300 rounded-lg px-4 py-2" />
        <button type="submit" className="bg-black text-white rounded-lg px-4 py-2">
          Register
        </button>
      </form>
    </main>
  );
}