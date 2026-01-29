import { MdLocalMovies } from 'react-icons/md';

const LoadingScreen = () => {
    return (
        <div 
            className="fixed inset-0 bg-gray-950 flex items-center justify-center z-50"
            style={{ 
                position: 'fixed', 
                inset: 0, 
                backgroundColor: '#030712', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                zIndex: 50 
            }}
        >
            {/* Animated background */}
            <div className="absolute inset-0 overflow-hidden" style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse" style={{ position: 'absolute', top: '25%', left: '25%', width: '24rem', height: '24rem', backgroundColor: 'rgba(147, 51, 234, 0.2)', borderRadius: '9999px', filter: 'blur(64px)' }} />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-600/20 rounded-full blur-3xl animate-pulse delay-75" style={{ position: 'absolute', bottom: '25%', right: '25%', width: '24rem', height: '24rem', backgroundColor: 'rgba(219, 39, 119, 0.2)', borderRadius: '9999px', filter: 'blur(64px)' }} />
            </div>

            {/* Loading content */}
            <div className="relative z-10 flex flex-col items-center space-y-6" style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
                {/* Logo with animation */}
                <div className="relative" style={{ position: 'relative' }}>
                    <MdLocalMovies style={{ fontSize: '4.5rem', color: '#a855f7' }} />
                    <div style={{ position: 'absolute', inset: 0, filter: 'blur(32px)', backgroundColor: 'rgba(168, 85, 247, 0.5)' }} />
                </div>

                {/* Brand name */}
                <div style={{ textAlign: 'center' }}>
                    <h1 style={{ fontSize: '2.25rem', fontWeight: 'bold', background: 'linear-gradient(to right, #a855f7, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        PrimeCine
                    </h1>
                    <p style={{ fontSize: '0.875rem', color: '#9ca3af', letterSpacing: '0.05em', marginTop: '0.5rem' }}>
                        Premium Seats. Prime Moments
                    </p>
                </div>

                {/* Loading spinner */}
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <div style={{ width: '0.75rem', height: '0.75rem', backgroundColor: '#a855f7', borderRadius: '9999px', animation: 'bounce 1s infinite' }} />
                    <div style={{ width: '0.75rem', height: '0.75rem', backgroundColor: '#c084fc', borderRadius: '9999px', animation: 'bounce 1s infinite 0.15s' }} />
                    <div style={{ width: '0.75rem', height: '0.75rem', backgroundColor: '#ec4899', borderRadius: '9999px', animation: 'bounce 1s infinite 0.3s' }} />
                </div>

                {/* Loading text */}
                <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                    Loading amazing experience...
                </p>
            </div>
        </div>
    );
};

export default LoadingScreen;
