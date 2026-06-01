import Link from "next/link";

export default function Hero() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-6 py-24 text-center">
      <p className="text-xs tracking-[0.3em] text-gray-400 uppercase mb-10">
        Revo111
      </p>
      <h1 className="text-4xl md:text-6xl font-bold text-black leading-[1.35] mb-10 max-w-3xl">
        「このままでいいのか」と思える人は、
        <br className="hidden sm:block" />
        まだ進める。
      </h1>
      <div className="text-sm md:text-base text-gray-600 mb-14 max-w-md leading-[2.2] space-y-5">
        <p>
          成功の形は、ひとつではありません。<br />
          お金も、肩書きも、実績も大切。<br />
          でも、それだけで人生が満たされるとは限らない。
        </p>
        <p>
          誰に必要とされ、誰と出会い、<br />
          何に自分の力を使うのか。
        </p>
        <p>
          Revo111は、あなたにとって大切なものを認めながら、<br />
          人生が広がる“次の関わり方”を見つける診断です。
        </p>
      </div>
      <Link
        href="/diagnosis"
        className="inline-flex items-center gap-2 bg-black text-white px-8 py-4 rounded-full text-base font-medium shadow-[0_18px_45px_rgba(0,0,0,0.18)] hover:bg-gray-800 transition-colors mb-4"
      >
        人生の次の関わり方を見つける
        <span aria-hidden>→</span>
      </Link>
      <Link
        href="/full-diagnosis"
        className="text-xs text-gray-400 hover:text-black transition-colors"
      >
        44問版モニター募集を見る
      </Link>
    </section>
  );
}
