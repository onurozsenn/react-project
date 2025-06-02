function Login() {
  return (
    <div className="flex min-h-screen">
      {/* Sol Panel */}
      <div className="w-1/2 flex flex-col justify-center items-center bg-white p-24">
        <div className="w-full max-w-sm">
          <h1 className="text-3xl font-bold mb-2">Welcome back</h1>

          <form className="space-y-4">
            <div>
              <label htmlFor="email" className="block mb-1 text-sm font-medium text-gray-700">Email address</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Email address"
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block mb-1 text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Password"
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
            <button type="submit" className="w-full py-2 bg-purple-700 text-white rounded hover:bg-purple-800 transition">Sign in</button>
          </form>
        </div>
      </div>
      {/* Sağ Panel */}
      <div className="w-1/2 bg-purple-200 flex items-center justify-center ">
        <img src="crow.png" alt="illustration" className="w-full h-full" />
      </div>
    </div>
  );
}

export default Login;