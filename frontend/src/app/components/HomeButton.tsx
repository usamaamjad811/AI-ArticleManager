// src/app/components/HomeButton.tsx

import Link from 'next/link';

export default function HomeButton() {
  return (
    <Link href="/">
      <button className="bg-blue-500 text-white px-4 py-2 rounded-md shadow hover:bg-blue-600 mt-4">
        Home
      </button>
    </Link>
  );
}
