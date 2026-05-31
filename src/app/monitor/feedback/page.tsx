"use client";

import { useState } from "react";
import Link from "next/link";

const DIAG_OPTIONS = ["Revo Role", "Revo Team", "Revo Match", "Revo Growth", "すべて"];
const YES_NO_OPTIONS = ["はい", "どちらとも言えない", "いいえ"];

const FORMSPREE_ID = process.env.NEXT_PUBLIC_FORMSPREE_ID ?? "meeddgby";
const FORMSPREE_ENDPOINT = `https://formspree.io/f/${FORMSPREE_ID}`;

export default function FeedbackPage() {
  const [triedDiags, setTriedDiags] = useState<string[]>([]);
  const [mostFun, setMostFun] = useState("");
  const [mostAccurate, setMostAccurate] = useState("");
  const [mostFuture, setMostFuture] = useState("");
  const [mostShareable, setMostShareable] = useState("");
  const [usefulForFunding, setUsefulForFunding] = useState("");
  const [usefulForMatching, setUsefulForMatching] = useState("");
  const [memorableWords, setMemorableWords] = useState("");
  const [unclear, setUnclear] = useState("");
  const [wantToAdd, setWantToAdd] = useState("");
  const [want111, setWant111] = useState("");
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const toggleTried = (val: string) => {
    setTriedDiags((prev) =>
      prev.includes(val) ? prev.filter((v) => v !== val) : [...prev, val]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setError("");

    const payload = {
      試した診断: triedDiags.join("、") || "未回答",
      一番面白かった診断: mostFun || "未回答",
      一番当たっていた診断: mostAccurate || "未回答",
      一番未来を感じた診断: mostFuture || "未回答",
      一番人に見せたい診断: mostShareable || "未回答",
      Revo_Fundingで使えそうな診断: usefulForFunding || "未回答",
      仲間探しで使えそうな診断: usefulForMatching || "未回答",
      心に残った言葉: memorableWords || "なし",
      わかりにくかった部分: unclear || "なし",
      追加してほしい項目: wantToAdd || "なし",
      "111問版を試したいか": want111 || "未回答",
      名前またはSNS: name || "匿名",
      連絡先: contact || "なし",
    };

    try {
      const formData = new FormData();
      for (const [key, value] of Object.entries(payload)) {
        formData.append(key, String(value));
      }

      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: formData,
      });

      // Google Spreadsheetsにも同時送信
      fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setSubmitted(true);
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data?.error ?? `送信に失敗しました（${res.status}）。もう一度お試しください。`);
      }
    } catch (err) {
      console.error("Formspree送信エラー:", err);
      const msg = err instanceof Error ? err.message : String(err);
      setError(`送信エラー: ${msg}`);
    } finally {
      setSending(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <div className="max-w-sm mx-auto">
          <div className="w-16 h-16 rounded-full bg-black flex items-center justify-center mx-auto mb-6">
            <svg viewBox="0 0 24 24" className="w-8 h-8 fill-white">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-black mb-3">ありがとうございます。</h2>
          <p className="text-sm text-gray-500 leading-relaxed mb-10">
            あなたの感想は、111問フル診断の開発に活かされます。
            <br />
            Revo OSの共同開発者として、参加してくれてありがとうございます。
          </p>
          <Link
            href="/monitor"
            className="inline-block px-8 py-4 rounded-full bg-black text-white text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            モニタートップに戻る
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen px-6 py-12">
      <div className="max-w-lg mx-auto">
        <div className="mb-10">
          <p className="text-xs tracking-widest text-gray-400 uppercase mb-3">Monitor Feedback</p>
          <h1 className="text-3xl font-bold text-black mb-3">感想を送る</h1>
          <p className="text-sm text-gray-500 leading-relaxed">
            あなたの率直な感想が、111問フル診断の開発に活かされます。
            <br />
            全項目任意です。気になるところだけでも大丈夫です。
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-10">
          <div>
            <label className="block text-sm font-medium text-black mb-3">
              1. 試した診断はどれですか？
              <span className="text-xs text-gray-400 font-normal ml-2">（複数選択可）</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {DIAG_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => toggleTried(opt)}
                  className={`text-sm px-4 py-2 rounded-full border transition-colors ${
                    triedDiags.includes(opt)
                      ? "bg-black text-white border-black"
                      : "border-gray-200 text-gray-600 hover:border-gray-400"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {[
            { q: "2. 一番面白かった診断はどれですか？", val: mostFun, set: setMostFun },
            { q: "3. 一番「当たっている」と感じた診断はどれですか？", val: mostAccurate, set: setMostAccurate },
            { q: "4. 一番「未来を感じた」診断はどれですか？", val: mostFuture, set: setMostFuture },
            { q: "5. 一番、人に見せたくなった診断はどれですか？", val: mostShareable, set: setMostShareable },
            { q: "6. Revo Fundingなどのプロジェクト作りに使えそうだと思った診断はどれですか？", val: usefulForFunding, set: setUsefulForFunding },
            { q: "7. 仲間探しに使えそうだと思った診断はどれですか？", val: usefulForMatching, set: setUsefulForMatching },
          ].map(({ q, val, set }) => (
            <div key={q}>
              <label className="block text-sm font-medium text-black mb-3">{q}</label>
              <div className="flex flex-wrap gap-2">
                {DIAG_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => set(opt)}
                    className={`text-sm px-4 py-2 rounded-full border transition-colors ${
                      val === opt
                        ? "bg-black text-white border-black"
                        : "border-gray-200 text-gray-600 hover:border-gray-400"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          ))}

          {[
            { q: "8. 結果ページで心に残った言葉はありますか？", val: memorableWords, set: setMemorableWords, placeholder: "印象に残った言葉や文章があれば..." },
            { q: "9. わかりにくかった部分はありますか？", val: unclear, set: setUnclear, placeholder: "質問の意味がわからなかったなど..." },
            { q: "10. 追加してほしい質問や項目はありますか？", val: wantToAdd, set: setWantToAdd, placeholder: "こんな視点もほしい、など..." },
          ].map(({ q, val, set, placeholder }) => (
            <div key={q}>
              <label className="block text-sm font-medium text-black mb-2">{q}</label>
              <textarea
                value={val}
                onChange={(e) => set(e.target.value)}
                placeholder={placeholder}
                rows={3}
                className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm text-black placeholder-gray-300 focus:outline-none focus:border-gray-400 resize-none"
              />
            </div>
          ))}

          <div>
            <label className="block text-sm font-medium text-black mb-3">
              11. 111問版ができたら試してみたいですか？
            </label>
            <div className="flex gap-2">
              {YES_NO_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setWant111(opt)}
                  className={`flex-1 text-sm py-3 rounded-2xl border transition-colors ${
                    want111 === opt
                      ? "bg-black text-white border-black"
                      : "border-gray-200 text-gray-600 hover:border-gray-400"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                12. 任意：名前またはSNSアカウント
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="@username など"
                className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm text-black placeholder-gray-300 focus:outline-none focus:border-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                13. 任意：連絡先
              </label>
              <input
                type="text"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="メールアドレス、SNSなど"
                className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm text-black placeholder-gray-300 focus:outline-none focus:border-gray-400"
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-2xl px-4 py-3">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="pt-4">
            <button
              type="submit"
              disabled={sending}
              className="w-full py-4 rounded-full bg-black text-white text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {sending ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  送信中…
                </>
              ) : (
                "感想を送る"
              )}
            </button>
            <p className="text-xs text-gray-400 text-center mt-3">
              送信内容は111問フル診断の開発にのみ使用されます。
            </p>
          </div>
        </form>

        <div className="mt-10 text-center">
          <Link href="/monitor" className="text-xs text-gray-400 hover:text-black transition-colors">
            ← モニタートップに戻る
          </Link>
        </div>
      </div>
    </main>
  );
}
