import Link from "next/link";

export default function Hero() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-6 py-20 text-center">
      <p className="text-xs tracking-[0.3em] text-gray-400 uppercase mb-6">
        Revolist Diagnosis
      </p>
      <h1 className="text-5xl md:text-7xl font-bold text-black leading-tight mb-6">
        レボリスト
        <br />
        診断
      </h1>
      <p className="text-xl md:text-2xl text-gray-700 font-light mb-8 max-w-lg leading-relaxed">
        あなたは、誰と組むと
        <br />
        未来を動かせるか。
      </p>
      <p className="text-sm text-gray-500 mb-12 max-w-sm leading-relaxed">
        「あなたは何者か」で終わりません。
        <br />
        どう動くか、誰と組むか、
        <br />
        どんなチームを作れるか——まで答えます。
      </p>
      <Link
        href="/diagnosis"
        className="inline-flex items-center gap-2 bg-black text-white px-8 py-4 rounded-full text-base font-medium hover:bg-gray-800 transition-colors mb-4"
      >
        ライト診断をはじめる
        <span aria-hidden>→</span>
      </Link>
      <Link
        href="/monitor"
        className="text-xs text-gray-400 hover:text-black transition-colors"
      >
        Revo OS β版（4診断）を試す
      </Link>
    </section>
  );
}
