import React, { useState } from 'react';

const Login = ({ onLogin, onCancel }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
        const res = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData) 
        });
        
        const data = await res.json();
        
        if (res.ok) {
            onLogin(data);
        } else {
            setError(data.message || "Authentication failed");
        }
    } catch (err) {
        setError("Unable to connect to server");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 font-roboto relative">
      
      {/* GO BACK HOME LOGO */}
      <div 
        className="absolute top-8 left-8 flex items-center gap-1 cursor-pointer" 
        onClick={onCancel}
        title="Go back to Home"
      >
        <div className="text-red-600">
           <svg viewBox="0 0 24 24" width="30" height="30" fill="currentColor">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
           </svg>
        </div>
        <span className="text-xl font-bold tracking-tighter font-sans -ml-1">YouTube</span>
      </div>

      <div className="w-full max-w-[448px] p-10 bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col">
        
        {/* Google Logo */}
        <div className="flex justify-center mb-4">
            <svg viewBox="0 0 24 24" width="48" height="48" xmlns="http://www.w3.org/2000/svg">
                <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z" />
                <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.464 63.239 -14.754 63.239 Z" />
                <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.734 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z" />
                <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.799 L -6.734 42.379 C -8.804 40.449 -11.514 39.239 -14.754 39.239 C -19.464 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z" />
                </g>
            </svg>
        </div>

        {/* Headings */}
        <h2 className="text-2xl font-normal text-center text-gray-900 mb-2">
            {isRegistering ? "Create your Google Account" : "Sign in"}
        </h2>
        <p className="text-base text-center text-gray-800 mb-8">
            to continue to YouTube
        </p>

        {/* Error Message */}
        {error && (
            <div className="bg-red-50 text-red-700 px-4 py-3 rounded mb-6 text-sm flex items-center gap-2">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
                {error}
            </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* INPUT: Username (Only for Register) */}
            {isRegistering && (
                <div className="relative group">
                    <input
                        type="text"
                        name="username"
                        required
                        className="peer w-full h-14 border border-gray-300 rounded px-3 pt-3 text-gray-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 placeholder-transparent"
                        placeholder="Username"
                        value={formData.username}
                        onChange={handleChange}
                    />
                    <label className="absolute left-3 top-[-10px] bg-white px-1 text-xs text-blue-600 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-[-10px] peer-focus:text-xs peer-focus:text-blue-600">
                        Username
                    </label>
                </div>
            )}

            {/* INPUT: Email */}
            <div className="relative group">
                <input
                    type="email"
                    name="email"
                    required
                    className="peer w-full h-14 border border-gray-300 rounded px-3 pt-3 text-gray-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 placeholder-transparent"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                />
                <label className="absolute left-3 top-[-10px] bg-white px-1 text-xs text-blue-600 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-[-10px] peer-focus:text-xs peer-focus:text-blue-600">
                    Email
                </label>
            </div>

            {/* INPUT: Password */}
            <div className="relative group">
                <input
                    type="password"
                    name="password"
                    required
                    className="peer w-full h-14 border border-gray-300 rounded px-3 pt-3 text-gray-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 placeholder-transparent"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                />
                <label className="absolute left-3 top-[-10px] bg-white px-1 text-xs text-blue-600 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-[-10px] peer-focus:text-xs peer-focus:text-blue-600">
                    Password
                </label>
            </div>

            <div className="flex justify-between items-center mt-10">
                <button 
                    type="button" 
                    onClick={() => {
                        setIsRegistering(!isRegistering);
                        setError('');
                        setFormData({ username: '', email: '', password: '' });
                    }}
                    className="text-blue-600 font-medium text-sm hover:bg-blue-50 px-2 py-2 rounded transition-colors"
                >
                    {isRegistering ? "Sign in instead" : "Create account"}
                </button>
                <button 
                    type="submit" 
                    className="bg-blue-600 text-white px-6 py-2 rounded-[4px] font-medium hover:bg-blue-700 transition-colors shadow-sm"
                >
                    {isRegistering ? "Register" : "Next"}
                </button>
            </div>
        </form>
      </div>
      
      {/* Footer Text */}
      <div className="fixed bottom-4 flex gap-6 text-xs text-gray-600">
         <span>Help</span>
         <span>Privacy</span>
         <span>Terms</span>
      </div>
    </div>
  );
};
export default Login;