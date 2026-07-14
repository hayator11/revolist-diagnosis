import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://revo.onokun.com"),
  title: "レボリスト診断",
  description:
    "人生が広がる次の関わり方を見つける診断です。仕事・副業・転職・仲間・活動の中で、あなたの力の使い方を見つけます。",
  openGraph: {
    title: "レボリスト診断",
    description: "人生が広がる次の関わり方を見つける診断です。",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="min-h-screen bg-white">
        {/* Nav */}
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-gray-100 bg-white/90 backdrop-blur-sm">
          <div className="mx-auto flex max-w-lg flex-col gap-3 px-6 py-3 sm:h-14 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:py-0">
            <div className="flex items-center justify-between">
              <Link href="/" className="text-sm font-bold tracking-tight text-black">
                REVOLIST
              </Link>
              <Link
                href="/diagnosis/entry"
                className="rounded-full bg-black px-4 py-2 text-xs text-white transition-colors hover:bg-gray-800 sm:hidden"
              >
                診断する
              </Link>
            </div>
            <div className="flex items-center justify-between gap-4 sm:justify-end">
              <Link
                href="/types"
                className="text-xs text-gray-500 transition-colors hover:text-black"
              >
                11タイプ
              </Link>
              <Link
                href="/team"
                className="text-xs text-gray-500 transition-colors hover:text-black"
              >
                チーム設計
              </Link>
              <Link
                href="/diagnosis/entry"
                className="hidden rounded-full bg-black px-4 py-2 text-xs text-white transition-colors hover:bg-gray-800 sm:block"
              >
                診断する
              </Link>
            </div>
          </div>
        </nav>

        {/* Content */}
        <main className="pt-24 sm:pt-14">{children}</main>
        <footer className="border-t border-gray-100 px-6 py-8 text-center text-xs text-gray-400">
          <div className="mx-auto flex max-w-lg flex-wrap items-center justify-center gap-x-4 gap-y-2">
            <span>Site map</span>
            <Link href="/types" className="transition-colors hover:text-black">
              11タイプ
            </Link>
            <Link href="/team" className="transition-colors hover:text-black">
              チーム設計
            </Link>
            <Link href="/revo" className="transition-colors hover:text-black">
              Revo
            </Link>
          </div>
        </footer>
      </body>
    </html>
  );
}
