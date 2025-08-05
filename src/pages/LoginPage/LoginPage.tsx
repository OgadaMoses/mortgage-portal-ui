import React from 'react';
import { useForm } from 'react-hook-form';
import './LoginPage.css';

type LoginForm = {
  username: string;
  password: string;
};

export default function LoginPage() {
  const { register, handleSubmit } = useForm<LoginForm>();

  const onSubmit = (data: LoginForm) => {
    console.log("Login form submitted:", data);
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
        <h1 className="portal-title">Mortgage Application Portal</h1>
        <h2>Login</h2>

        <input {...register('username')} placeholder="Username" />
        <input type="password" {...register('password')} placeholder="Password" />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
