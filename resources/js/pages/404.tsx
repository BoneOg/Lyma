import React from 'react';
import { Link } from '@inertiajs/react';
import Layout from '@/components/layout';

const NotFound: React.FC = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-[#3f411a] text-white flex items-center justify-center py-12 px-4 font-lexend">
        <div className="max-w-2xl w-full text-center">
          {/* 404 Number */}
          <div className="mb-8">
            <h1 className="text-9xl font-thin text-[#f6f5c6] mb-4">404</h1>
            <div className="w-24 h-[1px] bg-[#f6f5c6] mx-auto"></div>
          </div>

          {/* Error Message */}
          <div className="mb-4">
            <h2 className="text-3xl mb-4 font-light text-[#f6f5c6]">
              Page Not Found
            </h2>
            <p className="text-lg font-light text-white/80 mb-4">
              The page you're looking for doesn't exist or has been moved.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <Link
              href="/"
              className="inline-block bg-[#f6f5c6] text-[#3f411a] hover:bg-white px-8 py-3 rounded-none font-light transition-all duration-200"
            >
              Go Back Home
            </Link>
            
				<div className="text-sm font-light text-white/60">
					<p>Or you can try:</p>
					<div className="mt-2 grid grid-cols-[1fr_auto_1fr] items-center gap-4 w-full max-w-md mx-auto">
						<Link href="/reservation" className="text-[#f6f5c6] hover:text-white transition-colors justify-self-end">
							Make a Reservation
						</Link>
						<span aria-hidden="true" className="inline-block w-px h-5 bg-white/40"></span>
						<Link href="/contact" className="text-[#f6f5c6] hover:text-white transition-colors justify-self-start">
							Contact Us
						</Link>
					</div>
				</div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound; 