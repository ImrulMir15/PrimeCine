import { Link } from 'react-router-dom';
import { MdLocalMovies } from 'react-icons/md';

const NotFound = () => {
    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="text-center space-y-6">
                <div className="relative inline-block">
                    <MdLocalMovies className="text-9xl text-purple-500/20" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-8xl font-bold gradient-text">404</span>
                    </div>
                </div>

                <h1 className="text-4xl font-display font-bold text-white">
                    Page Not Found
                </h1>

                <p className="text-gray-400 max-w-md mx-auto">
                    Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
                </p>

                <Link to="/" className="btn-glow inline-block">
                    Back to Home
                </Link>
            </div>
        </div>
    );
};

export default NotFound;
