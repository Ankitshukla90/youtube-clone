import React, { useState } from 'react';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const res = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }) 
        });
        const data = await res.json();
        if (res.ok) { onLogin(data); } else { setError(data.message || "Authentication failed"); }
    } catch (err) { setError("Server error"); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-[450px] p-10 border border-gray-200 rounded-lg shadow-sm bg-white">
        <h2 className="text-2xl font-medium text-center text-gray-800 mb-8">Sign in</h2>
        {error && <div className="bg-red-50 text-red-600 p-3 rounded text-sm mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-6">
             <input type="email" required className="w-full h-14 border border-gray-300 rounded px-3" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
             <input type="password" required className="w-full h-14 border border-gray-300 rounded px-3" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
          <button type="submit" className="w-full bg-blue-600 text-white px-6 py-2 rounded font-medium">Next</button>
        </form>
      </div>
    </div>
  );
};
export default Login;