import React, { useState } from 'react';

const GoogleLogin = ({ onLogin, onCancel }) => {
  const [email, setEmail] = useState('');
  const [step, setStep] = useState(1); // 1: Email, 2: Password

  const handleSubmit = (e) => {
    e.preventDefault();
    if (step === 1 && email) {
      setStep(2);
    } else if (step === 2) {
      // Simulate login success
      onLogin({
          id: "user_" + Date.now(),
          name: "Demo User",
          email: email,
          avatar: "[https://api.dicebear.com/7.x/avataaars/svg?seed=Felix](https://api.dicebear.com/7.x/avataaars/svg?seed=Felix)"
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-white z-50 flex items-center justify-center font-sans">
      <div className="w-full max-w-[450px] p-10 border border-gray-200 rounded-lg shadow-sm bg-white">
        {/* Google Logo */}
        <div className="flex justify-center mb-6">
          <svg viewBox="0 0 24 24" width="48" height="48" xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)">
            <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
              <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z" />
              <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.464 63.239 -14.754 63.239 Z" />
              <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.734 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z" />
              <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.799 L -6.734 42.379 C -8.804 40.449 -11.514 39.239 -14.754 39.239 C -19.464 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z" />
            </g>
          </svg>
        </div>
        
        <h2 className="text-2xl font-medium text-center text-gray-800 mb-2">Sign in</h2>
        <p className="text-base text-center text-gray-600 mb-8">to continue to YouTube Clone</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {step === 1 ? (
            <div className="relative">
              <input
                type="email"
                required
                className="peer w-full h-14 border border-gray-300 rounded px-3 pt-4 text-gray-900 placeholder-transparent focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                id="email"
                placeholder="Email or phone"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <label 
                htmlFor="email"
                className="absolute left-3 top-1 text-xs text-gray-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-1 peer-focus:text-xs peer-focus:text-blue-600"
              >
                Email or phone
              </label>
            </div>
          ) : (
             <div className="relative">
              <input
                type="password"
                required
                className="peer w-full h-14 border border-gray-300 rounded px-3 pt-4 text-gray-900 placeholder-transparent focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                id="password"
                placeholder="Enter your password"
                autoFocus
              />
              <label 
                htmlFor="password"
                className="absolute left-3 top-1 text-xs text-gray-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-1 peer-focus:text-xs peer-focus:text-blue-600"
              >
                Enter your password
              </label>
            </div>
          )}

          <div className="flex justify-between items-center mt-8">
            <button 
              type="button" 
              className="text-blue-600 font-medium text-sm hover:bg-blue-50 px-2 py-1 rounded"
              onClick={onCancel}
            >
              Create account
            </button>
            <button 
              type="submit" 
              className="bg-blue-600 text-white px-6 py-2 rounded font-medium hover:bg-blue-700 transition-colors"
            >
              Next
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default GoogleLogin;
