'use client';

import { ConnectKitButton } from "connectkit";
import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <header className="w-full p-4">
      <div className="hyperlane-container flex justify-between items-center">
        <Link href="/" className="flex items-center">
          <Image
            src="https://ext.same-assets.com/1999836307/1042642129.svg"
            alt="Hyperlane Logo"
            width={40}
            height={40}
          />
          <span className="ml-2 text-white text-2xl font-bold">Hyperlane</span>
        </Link>

        <ConnectKitButton />
      </div>
    </header>
  );
}
