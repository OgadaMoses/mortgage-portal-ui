import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import './LoginPage.css';

type LoginForm = {
  username: string;
  password: string;
};

export default function LoginPage() {
  const { register, handleSubmit } = useForm<LoginForm>();

  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showCreateAccount, setShowCreateAccount] = useState(false);
  const [email, setEmail] = useState('');
  const [newUser, setNewUser] = useState({
    fullName: '',
    phone: '',
    email: '',
  });

  const onSubmit = (data: LoginForm) => {
    console.log("Login form submitted:", data);
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

        <input {...register('username')} placeholder="Username" />
        <input type="password" {...register('password')} placeholder="Password" />
        <button type="submit">Login</button>

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
              <button className="close" onClick={() => setShowForgotPassword(false)}>
                Close
              </button>
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
              Email Us on: info@mortgageportal.com
              <br />
              Telephone: +254723461757
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
