export default function Page() {
  return (
    <div className="container mx-auto p-8 text-center">
      <h1 className="text-4xl font-bold text-blue-600 mb-4">Welcome to AI Article Manager</h1>
      <p className="text-lg text-gray-700 mb-8">
        AI Article Manager is your go-to solution for managing and editing articles with the power of AI.
        Create, edit, and organize your content effortlessly!
      </p>
      <div className="flex justify-center space-x-4">
        <a href="/articles" className="bg-blue-500 text-white px-6 py-3 rounded-md shadow-md hover:bg-blue-600">
          View Articles
        </a>
        <a href="/articles/new" className="bg-green-500 text-white px-6 py-3 rounded-md shadow-md hover:bg-green-600">
          Create New Article
        </a>
      </div>
    </div>
  );
}
