import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === "onurali" && password === "1234") {
      setError(false);
      navigate("/dashboard");
    } else {
      setError(true);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Sol Panel */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center bg-white p-10 md:p-10 lg:p-24">
        <div className="w-full lg:max-w-sm">
          <h1 className="text-3xl font-bold mb-3">Welcome back</h1>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="username" className="block mb-1 text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block mb-1 text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 bg-purple-700 text-white rounded hover:bg-purple-800 transition"
            >
              Sign in
            </button>
            {error && (
              <p className="text-red-600 text-sm mt-2">Girdiğiniz bilgiler hatalı.</p>
            )}


          </form>

          <p className="text-sm mt-4">
            Don’t have an account? <Link to="/" className="text-purple-700 font-medium">Sign up</Link>
          </p>
        </div>
      </div>

      {/* Sağ Panel */}
      <div className="w-full lg:w-1/2 bg-purple-200  items-center justify-center hidden md:hidden lg:flex">
        <img src="crow.png" alt="illustration" className="w-full h-full" />
      </div>
    </div>
  );
}

export default Login;
