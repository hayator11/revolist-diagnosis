import type { Metadata } from "next";
import Link from "next/link";
import { RESEARCH_PROJECTS } from "@/data/researchProjects";

export const metadata: Metadata = {
  title: "リサーチ診断 | レボリスト診断",
  description: "レボリスト診断の研究版プロジェクト一覧です。",
};

export default function ResearchPage() {
  const projects = Object.values(RESEARCH_PROJECTS);

  return (
    <div className="min-h-screen bg-white px-6 py-14">
      <div className="mx-auto max-w-3xl">
        <p className="mb-4 text-xs uppercase tracking-widest text-gray-400">Research</p>
        <h1 className="mb-4 text-3xl font-bold leading-tight text-black">
          レボリスト診断リサーチ
        </h1>
        <p className="mb-10 max-w-xl text-sm leading-relaxed text-gray-600">
          本線診断とは別枠で、診断ロジックや結果原稿を検証するための研究版です。
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          {projects.map((project) => {
            const href = `/research/${project.slug}`;
            const disabled = "comingSoon" in project && project.comingSoon;

            return (
              <article key={project.slug} className="rounded-lg border border-gray-200 p-5">
                <p className="mb-2 text-xs uppercase tracking-widest text-gray-400">
                  {project.shortTitle}
                </p>
                <h2 className="mb-3 text-lg font-bold text-black">{project.title}</h2>
                <p className="mb-5 text-sm leading-relaxed text-gray-600">
                  {project.description}
                </p>
                {disabled ? (
                  <p className="inline-flex rounded-full bg-gray-100 px-4 py-2 text-xs text-gray-500">
                    準備中
                  </p>
                ) : (
                  <Link
                    href={href}
                    className="inline-flex rounded-full bg-black px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-800"
                  >
                    はじめる
                  </Link>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}
