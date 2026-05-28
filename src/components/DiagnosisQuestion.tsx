"use client";

const ANSWER_LABELS = [
  "まったく\n当てはまらない",
  "あまり\n当てはまらない",
  "どちらとも\n言えない",
  "やや\n当てはまる",
  "とても\n当てはまる",
];

interface Props {
  question: { id: number; text: string };
  totalQuestions: number;
  onAnswer: (value: number) => void;
  currentAnswer?: number;
}

export default function DiagnosisQuestion({
  question,
  totalQuestions,
  onAnswer,
  currentAnswer,
}: Props) {
  const progress = ((question.id - 1) / totalQuestions) * 100;

  return (
    <div className="min-h-screen flex flex-col px-6 py-10">
      {/* Progress */}
      <div className="mb-8">
        <div className="flex justify-between text-xs text-gray-400 mb-2">
          <span>{question.id} / {totalQuestions}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-black rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="flex-1 flex flex-col justify-center">
        <p className="text-xs tracking-widest text-gray-400 uppercase mb-4">
          Question {question.id}
        </p>
        <h2 className="text-2xl md:text-3xl font-medium text-black leading-relaxed mb-12">
          {question.text}
        </h2>

        {/* Answer buttons */}
        <div className="flex flex-col gap-3">
          {[1, 2, 3, 4, 5].map((value) => {
            const isSelected = currentAnswer === value;
            return (
              <button
                key={value}
                onClick={() => onAnswer(value)}
                className={`
                  w-full py-4 px-5 rounded-2xl text-left transition-all duration-200
                  flex items-center gap-4
                  ${
                    isSelected
                      ? "bg-black text-white"
                      : "bg-gray-50 text-gray-700 hover:bg-gray-100 active:bg-gray-200"
                  }
                `}
              >
                <span
                  className={`
                    w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-bold shrink-0
                    ${isSelected ? "border-white text-white" : "border-gray-300 text-gray-400"}
                  `}
                >
                  {value}
                </span>
                <span className="text-sm font-medium whitespace-pre-line">
                  {ANSWER_LABELS[value - 1]}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
