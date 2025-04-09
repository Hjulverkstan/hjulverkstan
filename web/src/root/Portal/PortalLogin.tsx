import React, { useState } from 'react';

import { Input } from '@components/shadcn/Input';
import { useAuth } from '@components/Auth';
import { Button } from '@components/shadcn/Button';

export default function Login() {
  const { logIn } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (event: React.FormEvent) => {
    event.preventDefault();
    logIn(username, password);
  };

  return (
    <div className="flex h-full items-center justify-center">
      <form className="space-y-2 max-w-64" onSubmit={handleLogin}>
        <h3 className="mb-4">Login to Hjulverkstan Portal</h3>
        <Input
          type="text"
          placeholder="username"
          aria-label="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <Input
          type="password"
          placeholder="password"
          aria-label="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button className="w-full" id="submit" type="submit">
          Login
        </Button>
      </form>
    </div>
  );
}
