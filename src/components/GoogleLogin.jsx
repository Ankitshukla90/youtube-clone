import React, { useState } from 'react';

const GoogleLogin = ({ onLogin, onCancel }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (step === 1 && email) {
      setStep(2);
    } else if (step === 2) {
      try {
        // CALL BACKEND LOGIN
        // Note: For this capstone, we are treating login/register as one flow for simplicity
        // In a real app, you'd have separate register/login endpoints
        const res = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }) 
        });
        
        const data = await res.json();
        
        if (res.ok) {
            onLogin(data); // Pass user data back to App
        } else {
            setError(data.message || "Login failed");
        }
      } catch (err) {
        setError("Server error. Is the backend running?");
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-white z-50 flex items-center justify-center font-sans">
      <div className="w-full max-w-[450px] p-10 border border-gray-200 rounded-lg shadow-sm bg-white">
        <h2 className="text-2xl font-medium text-center text-gray-800 mb-2">Sign in</h2>
        {error && <p className="text-red-500 text-center text-sm mb-4">{error}</p>}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {step === 1 ? (
            <input
              type="email" required
              className="w-full h-14 border border-gray-300 rounded px-3"
              placeholder="Email or phone"
              value={email} onChange={(e) => setEmail(e.target.value)}
            />
          ) : (
             <input
                type="password" required
                className="w-full h-14 border border-gray-300 rounded px-3"
                placeholder="Enter your password"
                value={password} onChange={(e) => setPassword(e.target.value)}
                autoFocus
              />
          )}

          <div className="flex justify-between items-center mt-8">
            <button type="button" onClick={onCancel} className="text-blue-600 font-medium">Cancel</button>
            <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded font-medium">Next</button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default GoogleLogin;