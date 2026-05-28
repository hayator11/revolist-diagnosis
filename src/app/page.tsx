import Link from "next/link";
import Hero from "@/components/Hero";
import TypeCard from "@/components/TypeCard";
import { revoTypeList } from "@/data/revotypes";

export default function HomePage() {
  return (
    <>
      {/* ファーストビュー */}
      <Hero />

      {/* セクション2: 性格ではなく役割を見る */}
      <section className="px-6 py-20 max-w-lg mx-auto text-center border-t border-gray-100">
        <p className="text-xs tracking-widest text-gray-400 uppercase mb-4">
          Philosophy
        </p>
        <h2 className="text-3xl font-bold text-black mb-6 leading-snug">
          性格ではなく、
          <br />
          役割を見る。
        </h2>
        <p className="text-sm text-gray-600 leading-relaxed">
          人はひとつのタイプに固定されるものではありません。
          環境、出会い、活動によって、役割は育っていきます。
        </p>
      </section>

      {/* セクション3: 違いは組み合わせるためにある */}
      <section className="px-6 py-20 bg-gray-50">
        <div className="max-w-lg mx-auto text-center">
          <p className="text-xs tracking-widest text-gray-400 uppercase mb-4">
            Difference
          </p>
          <h2 className="text-3xl font-bold text-black mb-6 leading-snug">
            違いは、欠点ではなく
            <br />
            組み合わせるためにある。
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            あなたに眠っている力は、誰かとの出会いで開花するかもしれません。
            あなたが自然に持っている力も、誰かの未来を支える力になります。
          </p>
        </div>
      </section>

      {/* セクション4: 受け取る。渡す。循環する。 */}
      <section className="px-6 py-20 max-w-lg mx-auto text-center">
        <p className="text-xs tracking-widest text-gray-400 uppercase mb-4">
          Circulation
        </p>
        <h2 className="text-3xl font-bold text-black mb-6 leading-snug">
          受け取る。渡す。
          <br />
          循環する。
        </h2>
        <p className="text-sm text-gray-600 leading-relaxed">
          人は、受け取りながら、誰かに何かを渡しています。
          応援、安心、熱量、情報、表現、仕組み。
          その循環が、人と人の輪をつくります。
        </p>
      </section>

      {/* 11タイプ プレビュー */}
      <section className="px-6 py-20 bg-black">
        <div className="max-w-lg mx-auto">
          <div className="text-center mb-10">
            <p className="text-xs tracking-widest text-gray-500 uppercase mb-3">
              11 Types
            </p>
            <h2 className="text-3xl font-bold text-white mb-3">
              11のタイプがある。
            </h2>
            <p className="text-sm text-gray-400">
              どのタイプも、欠けているものではなく、独自の力を持つ存在です。
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-8">
            {revoTypeList.slice(0, 6).map((type) => (
              <div
                key={type.key}
                className="border border-gray-700 rounded-xl p-4"
              >
                <p className="text-white text-sm font-bold mb-1">{type.name}</p>
                <p className="text-gray-500 text-xs leading-snug">
                  {type.catchcopy}
                </p>
              </div>
            ))}
          </div>
          <Link
            href="/types"
            className="block w-full text-center py-4 rounded-2xl border border-gray-700 text-gray-300 text-sm hover:border-white hover:text-white transition-colors"
          >
            11タイプをすべて見る →
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-24 max-w-lg mx-auto text-center">
        <h2 className="text-3xl font-bold text-black mb-4 leading-snug">
          あなたの現在地を
          <br />
          見つけよう。
        </h2>
        <p className="text-sm text-gray-500 mb-8 leading-relaxed">
          21問・約3分で、あなたのメインタイプが分かります。
        </p>
        <Link
          href="/diagnosis"
          className="inline-flex items-center gap-2 bg-black text-white px-8 py-4 rounded-full text-base font-medium hover:bg-gray-800 transition-colors"
        >
          ライト診断をはじめる →
        </Link>
      </section>
    </>
  );
}
