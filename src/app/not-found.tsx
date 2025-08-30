import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Not Found</h2>
        <p className="mb-4 text-muted-foreground">Could not find the requested resource</p>
        <Link 
          href="/" 
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-block"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}