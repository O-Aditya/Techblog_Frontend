import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Plus, BookDashed, LogOut, Home, Hash, Grid, User } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

interface NavBarProps {
  isAuthenticated: boolean;
  userProfile?: {
    name: string;
    avatar?: string;
  };
  onLogout: () => void;
}

const NavBar: React.FC<NavBarProps> = ({
  isAuthenticated,
  onLogout,
}) => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const menuItems = [
    { name: 'Posts', path: '/' },
    { name: 'Tags', path: '/tags' },
    { name: 'Categories', path: '/categories' },
    { name: 'About', path: '/about' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-background border-b border-border">
      <div className="app-layout py-4">
        <div className="flex items-center justify-between">
          {/* Logo/Brand */}
          <div className="flex items-center gap-8">
            <Link
              to="/"
              className="flex items-center gap-2 group no-underline"
            >
              <div className="w-8 h-8 rounded bg-foreground text-background flex items-center justify-center font-mono font-bold text-lg group-hover:bg-accent transition-colors">
                &gt;_
              </div>
              <span className="text-xl font-bold font-mono tracking-tight text-foreground group-hover:text-accent transition-colors">
                aditya.sh
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              <Link
                to="/"
                className={`p-2 rounded-md transition-colors ${isActive('/') ? 'text-accent bg-accent/10' : 'text-foreground hover:bg-muted/10 hover:text-accent'}`}
                title="Posts"
              >
                <Home size={20} />
              </Link>
              <Link
                to="/tags"
                className={`p-2 rounded-md transition-colors ${isActive('/tags') ? 'text-accent bg-accent/10' : 'text-foreground hover:bg-muted/10 hover:text-accent'}`}
                title="Tags"
              >
                <Hash size={20} />
              </Link>
              <Link
                to="/categories"
                className={`p-2 rounded-md transition-colors ${isActive('/categories') ? 'text-accent bg-accent/10' : 'text-foreground hover:bg-muted/10 hover:text-accent'}`}
                title="Categories"
              >
                <Grid size={20} />
              </Link>
              <Link
                to="/about"
                className={`p-2 rounded-md transition-colors ${isActive('/about') ? 'text-accent bg-accent/10' : 'text-foreground hover:bg-muted/10 hover:text-accent'}`}
                title="About"
              >
                <User size={20} />
              </Link>
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3">
            <ThemeToggle />

            {/* Desktop Auth Actions */}
            <div className="hidden md:flex items-center gap-3">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/posts/drafts"
                    className="px-3 py-1.5 text-sm border border-border rounded hover:border-accent hover:text-accent no-underline transition-colors"
                  >
                    <BookDashed className="w-4 h-4 inline mr-1" />
                    Drafts
                  </Link>
                  <Link
                    to="/posts/new"
                    className="px-3 py-1.5 text-sm bg-accent text-background rounded hover:opacity-90 no-underline transition-opacity"
                  >
                    <Plus className="w-4 h-4 inline mr-1" />
                    New Post
                  </Link>
                  <button
                    onClick={onLogout}
                    className="px-3 py-1.5 text-sm border border-border rounded hover:border-accent hover:text-accent transition-colors"
                  >
                    <LogOut className="w-4 h-4 inline mr-1" />
                    Logout
                  </button>
                </>
              ) : (
                <Link to="/login" className="px-3 py-1.5 text-sm bg-accent text-background rounded hover:opacity-90 no-underline transition-opacity">
                  Log In
                </Link>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden p-2 hover:bg-muted/20 rounded transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="w-5 h-5 text-foreground" />
              ) : (
                <Menu className="w-5 h-5 text-foreground" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pt-4 mt-4 border-t border-border">
            <div className="flex flex-col gap-3">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-4 py-2 text-sm font-medium no-underline transition-colors ${isActive(item.path)
                    ? 'text-accent bg-muted/20'
                    : 'text-foreground hover:text-accent hover:bg-muted/20'
                    }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}

              {/* Mobile Auth Actions */}
              <div className="border-t border-border pt-3 mt-2">
                {isAuthenticated ? (
                  <>
                    <Link
                      to="/posts/drafts"
                      className="block px-4 py-2 text-sm font-medium text-foreground hover:text-accent hover:bg-muted/20 no-underline"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <BookDashed className="w-4 h-4 inline mr-2" />
                      My Drafts
                    </Link>
                    <Link
                      to="/posts/new"
                      className="block px-4 py-2 text-sm font-medium text-foreground hover:text-accent hover:bg-muted/20 no-underline"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Plus className="w-4 h-4 inline mr-2" />
                      New Post
                    </Link>
                    <button
                      onClick={() => {
                        onLogout();
                        setIsMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm font-medium text-foreground hover:text-accent hover:bg-muted/20"
                    >
                      <LogOut className="w-4 h-4 inline mr-2" />
                      Logout
                    </button>
                  </>
                ) : (
                  <Link
                    to="/login"
                    className="block px-4 py-2 text-sm font-medium text-foreground hover:text-accent hover:bg-muted/20 no-underline"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Log In
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;