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
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b border-gray-100">
          <div className="max-w-lg mx-auto px-6 h-14 flex items-center justify-between">
            <Link href="/" className="text-sm font-bold text-black tracking-tight">
              REVOLIST
            </Link>
            <div className="flex items-center gap-4">
              <Link
                href="/types"
                className="text-xs text-gray-500 hover:text-black transition-colors hidden sm:block"
              >
                11タイプ
              </Link>
              <Link
                href="/team"
                className="text-xs text-gray-500 hover:text-black transition-colors hidden sm:block"
              >
                チーム設計
              </Link>
              <Link
                href="/revo"
                className="text-xs text-gray-500 hover:text-black transition-colors"
              >
                Revo
              </Link>
              <Link
                href="/diagnosis/entry"
                className="text-xs bg-black text-white px-4 py-2 rounded-full hover:bg-gray-800 transition-colors"
              >
                診断する
              </Link>
            </div>
          </div>
        </nav>

        {/* Content */}
        <main className="pt-14">{children}</main>
      </body>
    </html>
  );
}
