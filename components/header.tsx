'use client';

import Link from 'next/link';
import { User } from '@/lib/types';
import { useRouter } from 'next/navigation';

interface HeaderProps {
  user: User | null;
}

export default function Header({ user }: HeaderProps) {
  const router = useRouter();

  const handleLogout = () => {
    sessionStorage.removeItem('currentUser');
    router.push('/signup');
  };

  return (
    <header className="border-b border-border bg-background sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">R</span>
          </div>
          <div>
            <p className="text-xs font-bold tracking-wider text-foreground">REVERSE</p>
            <p className="text-xs tracking-wider text-muted-foreground">AUCTION OS</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex items-center gap-6">
          <Link
            href="/dashboard"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
          >
            ⊟ Dashboard
          </Link>
          <Link
            href="#"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
          >
            + New RFQ
          </Link>
        </nav>

        {/* User Info */}
        <div className="flex items-center gap-6">
          {user && (
            <div className="text-right">
              <p className="text-sm font-semibold text-foreground">{user.fullName}</p>
              <p className="text-xs text-muted-foreground">
                {user.role === 'buyer' ? 'BUYER' : 'SUPPLIER'} • {user.company}
              </p>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="text-foreground hover:text-accent transition-colors"
            title="Logout"
          >
            ↗
          </button>
        </div>
      </div>
    </header>
  );
}
