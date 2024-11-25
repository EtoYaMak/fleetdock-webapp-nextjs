import Link from "next/link";

export default function Home() {
  return (
    <main className="bg-gray-50 dark:bg-gray-900 min-h-screen flex items-center justify-center">
      <div className="container mx-auto px-6 text-center">
        {/* Hero Section */}
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
            Revolutionize Your Logistics
          </h1>
          <p className="mt-4 text-lg text-gray-700 dark:text-gray-300">
            Simplify freight management with cutting-edge technology. Whether
            you're a trucker or a broker, we've got you covered.
          </p>
          <div className="mt-6">
            <Link href="/signup">
              <a className="px-6 py-3 bg-blue-600 text-white text-lg font-medium rounded-md hover:bg-blue-700">
                Get Started
              </a>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
