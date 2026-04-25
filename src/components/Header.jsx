import React from 'react';

export const Header = ({ user, onLogout }) => {
  return (
    <header className="border-b border-border bg-background">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">A</span>
          </div>
          <h1 className="text-xl font-bold text-foreground">AuctionHub</h1>
        </div>
        
        <div className="flex items-center gap-4">
          {user && (
            <>
              <div className="text-right">
                <p className="text-sm font-semibold text-foreground">{user.fullName}</p>
                <p className="text-xs text-muted-foreground">{user.company}</p>
              </div>
              <button
                onClick={onLogout}
                className="px-3 py-2 text-sm bg-secondary text-foreground rounded hover:bg-secondary/80 transition-colors"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
