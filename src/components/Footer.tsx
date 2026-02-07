import { Github } from 'lucide-react';

const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="mt-auto border-t border-border">
            <div className="app-layout py-6">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-muted text-center md:text-left">
                        © {currentYear}  Blog. All rights reserved.
                    </p>
                    <div className="flex items-center gap-4 text-sm text-muted">
                        <a
                            href="https://github.com/O-Aditya/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-accent transition-colors no-underline flex items-center gap-1"
                        >
                            <Github size={16} />
                            <span>GitHub</span>
                        </a>
                        <span>|</span>
                        <a
                            href="#"
                            className="hover:text-accent transition-colors no-underline"
                        >
                            Privacy Policy
                        </a>
                        <span>|</span>
                        <a
                            href="#"
                            className="hover:text-accent transition-colors no-underline"
                        >
                            Terms of Service
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
