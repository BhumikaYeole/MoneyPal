
import Link from 'next/link'

export default function Custom404() {

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-50 px-4">
      <div className="text-center max-w-md">
        <h1 className="text-8xl font-bold text-blue-600">404</h1>
        <h2 className="mt-4 text-2xl font-semibold text-blue-800">Page Not Found</h2>
        <p className="mt-2 mb-2.5 text-blue-700">
          Sorry, the page you’re looking for doesn't exist or has been moved.
        </p>
        <Link href='/' className="mt-6 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-300"
      > Go to Home Page</Link>
        
      </div>
    </div>
  );
}


// 