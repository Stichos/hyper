import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

export default function HelpSection() {
  const helpLinks = [
    {
      title: "FAQ",
      icon: "https://ext.same-assets.com/1999836307/1962410151.svg",
      href: "https://hyperlanexyz.notion.site/Frequently-Asked-Questions-FAQS-1c86d35200d6809683a4c49849f046b9",
    },
    {
      title: "Hyperlane Protocol",
      icon: "https://ext.same-assets.com/1999836307/3432608021.svg",
      href: "https://x.com/hyperlane",
    },
    {
      title: "Hyperlane Foundation",
      icon: "https://ext.same-assets.com/1999836307/3432608021.svg",
      href: "https://x.com/hyperlane_fdn",
    },
    {
      title: "Hyperlane",
      icon: "https://ext.same-assets.com/1999836307/1202226349.svg",
      href: "https://discord.com/invite/hyperlane",
    },
    {
      title: "Hyperlane Docs",
      icon: "https://ext.same-assets.com/1999836307/3426020059.svg",
      href: "https://docs.hyperlane.xyz/",
    },
    {
      title: "Hyperlane Foundation",
      icon: "https://ext.same-assets.com/1999836307/2934485440.svg",
      href: "https://www.hyperlane.foundation/",
    },
  ];

  return (
    <Card className="border-0 rounded-xl overflow-hidden">
      <CardContent className="p-6">
        <h2 className="text-xl font-bold mb-6">Need help?</h2>
        <div className="space-y-4">
          {helpLinks.map((link, i) => (
            <Link
              key={`${link.title}-${i}`}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md transition-colors"
            >
              <div className="flex items-center gap-3">
                <img src={link.icon} alt="" className="w-5 h-5" />
                <span className="font-medium">{link.title}</span>
              </div>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7 17L17 7M17 7H7M17 7V17"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
