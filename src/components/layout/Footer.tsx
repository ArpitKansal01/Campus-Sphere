
import { Link } from "react-router-dom";
import { Github, Twitter, Instagram } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-muted/40">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center">
              <span className="font-bold text-xl campus-gradient-text">CampusSphere</span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">
              The all-in-one platform for college communities to connect, discover events, 
              find opportunities, and succeed together.
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase">
              Platform
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/events" className="text-sm text-muted-foreground hover:text-foreground">
                  Events
                </Link>
              </li>
              <li>
                <Link to="/groups" className="text-sm text-muted-foreground hover:text-foreground">
                  Student Groups
                </Link>
              </li>
              <li>
                <Link to="/jobs" className="text-sm text-muted-foreground hover:text-foreground">
                  Job Board
                </Link>
              </li>
              <li>
                <Link to="/ai-tutor" className="text-sm text-muted-foreground hover:text-foreground">
                  AI Tutor
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase">
              Connect
            </h3>
            <ul className="mt-4 space-y-2">
              <li className="flex items-center">
                <Github className="h-5 w-5 mr-2 text-muted-foreground" />
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
                  GitHub
                </a>
              </li>
              <li className="flex items-center">
                <Twitter className="h-5 w-5 mr-2 text-muted-foreground" />
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
                  Twitter
                </a>
              </li>
              <li className="flex items-center">
                <Instagram className="h-5 w-5 mr-2 text-muted-foreground" />
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
                  Instagram
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} CampusSphere. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground">
              Terms
            </Link>
            <Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground">
              Privacy
            </Link>
            <Link to="/contact" className="text-sm text-muted-foreground hover:text-foreground">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
