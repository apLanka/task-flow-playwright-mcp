'use client';

import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { AuthForm } from '@/components/AuthForm';
import { TaskManager } from '@/components/TaskManager';

function AppContent() {
  const { user } = useAuth();

  if (!user) {
    return <AuthForm />;
  }

  return <TaskManager />;
}

export default function Home() {
  return (
      <AuthProvider>
        <AppContent />
      </AuthProvider>
  );
}