import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import './LoginPage.css';

type LoginForm = {
  username: string;
  password: string;
};

type NewUser = {
  fullName: string;
  phone: string;
  email: string;
};

export default function LoginPage() {
  const { register, handleSubmit, reset } = useForm<LoginForm>();
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showCreateAccount, setShowCreateAccount] = useState(false);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [newUser, setNewUser] = useState<NewUser>({ fullName: '', phone: '', email: '' });

  const onSubmit = async (data: LoginForm) => {
    setLoading(true);
    setErrorMessage('');

    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Invalid username or password');
      }

      const result = await response.json();
      console.log('Login successful:', result);

      localStorage.setItem('authToken', result.token);
      localStorage.setItem('role', result.role);
      localStorage.setItem('username', result.username);
      localStorage.setItem('useridentificationnumber', result.useridentificationnumber);
      localStorage.setItem('lastLogin', new Date().toLocaleString());

      if (result.role === '01') {
        window.location.href = '/admin';
      } else if (result.role === '02') {
        window.location.href = '/userdashboard';
      } else {
        window.location.href = '/';
      }

      reset();
    } catch (error: any) {
      setErrorMessage(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = () => {
    alert(`Password reset instructions will be sent to: ${email}`);
    setShowForgotPassword(false);
    setEmail('');
  };

  const handleCreateAccount = () => {
    alert(`Thank you ${newUser.fullName}. Our Customer Service Team will contact you, or visit our nearest branch.`);
    setShowCreateAccount(false);
    setNewUser({ fullName: '', phone: '', email: '' });
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
        <h1 className="portal-title">Mortgage Application Portal</h1>
        <h2>Login</h2>

        <input {...register('username')} placeholder="Username" required />
        <input type="password" {...register('password')} placeholder="Password" required />

        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>

        {errorMessage && <p className="error-message">{errorMessage}</p>}

        <div className="login-links">
          <span onClick={() => setShowForgotPassword(true)}>Forgot Password?</span>
          <span onClick={() => setShowCreateAccount(true)}>Create Account</span>
        </div>
      </form>

      {showForgotPassword && (
        <div className="modal">
          <div className="modal-content">
            <h2>Reset Password</h2>
            <p>Enter your email to receive reset instructions:</p>
            <input
              type="email"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div className="modal-actions">
              <button onClick={handlePasswordReset}>Submit</button>
              <button className="close" onClick={() => setShowForgotPassword(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {showCreateAccount && (
        <div className="modal">
          <div className="modal-content">
            <h2>Create Account</h2>
            <input
              type="text"
              placeholder="Full Name"
              value={newUser.fullName}
              onChange={(e) => setNewUser({ ...newUser, fullName: e.target.value })}
            />
            <input
              type="text"
              placeholder="Phone Number"
              value={newUser.phone}
              onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
            />
            <input
              type="email"
              placeholder="Email"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            />
            <p className="info-text">
              Our Customer Service Team will contact you for further details, or visit our nearest branch.
              <br />
              Email Us on: <strong>info@mortgageportal.com</strong>
              <br />
              Telephone: <strong>+254723461757</strong>
            </p>
            <div className="modal-actions">
              <button onClick={handleCreateAccount}>Submit</button>
              <button className="close" onClick={() => setShowCreateAccount(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
