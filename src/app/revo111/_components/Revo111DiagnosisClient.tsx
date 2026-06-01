"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import MonitorQuestion from "@/components/MonitorQuestion";
import {
  REVO111_TOTAL_QUESTIONS,
  revo111Questions,
} from "@/data/revo111Questions";
import { encodeRevo111Answers } from "@/lib/calculateRevo111Result";
import {
  communityInterestOptions,
  currentInterestOptions,
  discoveryDetailOptions,
  getDeviceLabel,
  getTrackingParams,
  interestedProjectsOptions,
  joinMotivationOptions,
  monitorDiscoveryChannelOptions,
  possibleContributionOptions,
  publishConsentOptions,
  referralContextOptions,
  referredOptions,
  type RevoResearchPayload,
} from "@/data/revoResearch";

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-500 mb-2">{label}</label>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 focus:border-gray-400 focus:outline-none"
      >
        <option value="">未回答</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

function TextField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-500 mb-2">{label}</label>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-gray-700 placeholder-gray-300 focus:border-gray-400 focus:outline-none"
      />
    </div>
  );
}

function TextAreaField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-500 mb-2">{label}</label>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        rows={3}
        className="w-full resize-none rounded-2xl border border-gray-200 px-4 py-3 text-sm text-gray-700 placeholder-gray-300 focus:border-gray-400 focus:outline-none"
      />
    </div>
  );
}

function MultiSelectField({
  label,
  values,
  options,
  onToggle,
}: {
  label: string;
  values: string[];
  options: string[];
  onToggle: (value: string) => void;
}) {
  return (
    <div>
      <p className="text-xs font-medium text-gray-500 mb-3">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const selected = values.includes(option);
          return (
            <button
              key={option}
              type="button"
              onClick={() => onToggle(option)}
              className={`rounded-full border px-3 py-2 text-xs transition-colors ${
                selected
                  ? "border-black bg-black text-white"
                  : "border-gray-200 text-gray-600 hover:border-gray-400"
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function toggleValue(values: string[], value: string) {
  return values.includes(value)
    ? values.filter((item) => item !== value)
    : [...values, value];
}

export default function Revo111DiagnosisClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [started, setStarted] = useState(false);
  const [discoveryChannel, setDiscoveryChannel] = useState("");
  const [discoveryDetail, setDiscoveryDetail] = useState("");
  const [joinMotivation, setJoinMotivation] = useState<string[]>([]);
  const [impressivePhrase, setImpressivePhrase] = useState("");
  const [isReferred, setIsReferred] = useState("");
  const [referrerName, setReferrerName] = useState("");
  const [referrerUrl, setReferrerUrl] = useState("");
  const [referralContext, setReferralContext] = useState("");
  const [referrerPublishConsent, setReferrerPublishConsent] = useState("");
  const [currentInterest, setCurrentInterest] = useState<string[]>([]);
  const [interestedProjects, setInterestedProjects] = useState<string[]>([]);
  const [communityInterest, setCommunityInterest] = useState("");
  const [possibleContribution, setPossibleContribution] = useState<string[]>([]);
  const [expectationText, setExpectationText] = useState("");

  const handleAnswer = useCallback(
    (value: number) => {
      const newAnswers = [...answers];
      newAnswers[currentIndex] = value;
      setAnswers(newAnswers);

      if (currentIndex < revo111Questions.length - 1) {
        setTimeout(() => setCurrentIndex((index) => index + 1), 180);
      } else {
        const encoded = encodeRevo111Answers(newAnswers);
        const tracking = getTrackingParams(searchParams);
        const research: RevoResearchPayload = {
          formType: "monitor_44",
          discoveryChannel,
          discoveryDetail,
          joinMotivation,
          impressivePhrase,
          isReferred,
          referrerName,
          referrerUrl,
          referrerSlug: tracking.referrerSlug,
          referralContext,
          referrerPublishConsent,
          currentInterest,
          interestedProjects,
          communityInterest,
          monitorInterest: "44問版モニター診断",
          possibleContribution,
          expectationText,
          utmSource: tracking.utmSource,
          utmMedium: tracking.utmMedium,
          utmCampaign: tracking.utmCampaign,
          pagePath: window.location.pathname,
          device: getDeviceLabel(),
          ctaClicked: "monitor_44_start",
        };

        window.sessionStorage.setItem(
          `revo111-research:${encoded}`,
          JSON.stringify(research),
        );
        router.push(`/revo111/result/${encoded}`);
      }
    },
    [
      answers,
      communityInterest,
      currentIndex,
      currentInterest,
      discoveryChannel,
      discoveryDetail,
      expectationText,
      impressivePhrase,
      interestedProjects,
      isReferred,
      joinMotivation,
      possibleContribution,
      referralContext,
      referrerName,
      referrerPublishConsent,
      referrerUrl,
      router,
      searchParams,
    ]
  );

  if (!started) {
    return (
      <div className="min-h-screen px-6 py-14">
        <div className="max-w-lg mx-auto text-center">
        <p className="text-xs tracking-widest text-gray-400 uppercase mb-4">
          Revo111 Monitor
        </p>
        <h1 className="text-3xl font-bold text-black mb-4 leading-snug">
          Revo111 44問モニター診断
        </h1>
        <p className="text-sm text-gray-600 leading-relaxed mb-6 max-w-xs">
          感想提供と改善協力を前提に、役割・成長・仲間・活動の循環を見つける診断です。
        </p>
        <ul className="text-xs text-gray-500 mb-10 space-y-1 text-left">
          <li>・ 44問・約5分の診断です</li>
          <li>・ 結果ページで感想フォームに協力してください</li>
          <li>・ 正解も不正解もありません</li>
          <li>・ 今の自分に近い感覚で答えてください</li>
          <li>・ 役割は固定ではなく、育っていくものです</li>
        </ul>
        <div className="rounded-3xl border border-gray-100 p-5 text-left mb-8 space-y-6">
          <p className="text-xs text-gray-400 leading-relaxed">
            ここから先は任意のリサーチ項目です。未回答でも診断へ進めます。
          </p>
          <SelectField
            label="Revo111をどこで知りましたか？"
            value={discoveryChannel}
            options={monitorDiscoveryChannelOptions}
            onChange={setDiscoveryChannel}
          />
          <SelectField
            label="最初に見た場所をもう少し詳しく教えてください"
            value={discoveryDetail}
            options={discoveryDetailOptions}
            onChange={setDiscoveryDetail}
          />
          <MultiSelectField
            label="参加・診断してみようと思った一番のきっかけは何ですか？"
            values={joinMotivation}
            options={joinMotivationOptions}
            onToggle={(value) => setJoinMotivation((items) => toggleValue(items, value))}
          />
          <TextAreaField
            label="特に印象に残った言葉や内容があれば教えてください"
            value={impressivePhrase}
            onChange={setImpressivePhrase}
            placeholder="印象に残った言葉やページなど"
          />
          <SelectField
            label="誰かの紹介でRevo111を知りましたか？"
            value={isReferred}
            options={referredOptions}
            onChange={setIsReferred}
          />
          {isReferred === "はい" && (
            <>
              <TextField
                label="ご縁をつないでくれた人のお名前・ニックネーム"
                value={referrerName}
                onChange={setReferrerName}
                placeholder="例：はやと"
              />
              <TextField
                label="ご縁をつないでくれた人のSNSやURL 任意"
                value={referrerUrl}
                onChange={setReferrerUrl}
                placeholder="https://..."
              />
              <SelectField
                label="紹介された場所やきっかけを教えてください"
                value={referralContext}
                options={referralContextOptions}
                onChange={setReferralContext}
              />
              <SelectField
                label="ご縁をつないでくれた人として記録してもよいですか？"
                value={referrerPublishConsent}
                options={publishConsentOptions}
                onChange={setReferrerPublishConsent}
              />
            </>
          )}
          <MultiSelectField
            label="今、特に気になっていることを教えてください 任意"
            values={currentInterest}
            options={currentInterestOptions}
            onToggle={(value) => setCurrentInterest((items) => toggleValue(items, value))}
          />
          <MultiSelectField
            label="Revo111の中で興味があるものを教えてください"
            values={interestedProjects}
            options={interestedProjectsOptions}
            onToggle={(value) => setInterestedProjects((items) => toggleValue(items, value))}
          />
          <SelectField
            label="コミュニティに参加してみたい気持ちはありますか？"
            value={communityInterest}
            options={communityInterestOptions}
            onChange={setCommunityInterest}
          />
          <MultiSelectField
            label="自分にできそうな関わり方があれば教えてください"
            values={possibleContribution}
            options={possibleContributionOptions}
            onToggle={(value) => setPossibleContribution((items) => toggleValue(items, value))}
          />
          <TextAreaField
            label="Revo111やレボリストLabに期待することがあれば教えてください"
            value={expectationText}
            onChange={setExpectationText}
            placeholder="期待していること、見てみたいことなど"
          />
        </div>
        <button
          onClick={() => setStarted(true)}
          className="bg-black text-white px-8 py-4 rounded-full text-base font-medium hover:bg-gray-800 transition-colors"
        >
          44問診断をはじめる
        </button>
        <Link href="/full-diagnosis" className="text-xs text-gray-400 hover:text-black transition-colors mt-6">
          モニター募集ページへ戻る
        </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto">
      <MonitorQuestion
        question={revo111Questions[currentIndex]}
        totalQuestions={REVO111_TOTAL_QUESTIONS}
        onAnswer={handleAnswer}
        currentAnswer={answers[currentIndex]}
        accentColor="#111111"
      />
      {currentIndex > 0 && (
        <div className="px-6 pb-8 text-center">
          <button
            onClick={() => setCurrentIndex((index) => index - 1)}
            className="text-xs text-gray-400 hover:text-black transition-colors"
          >
            ← 前の質問に戻る
          </button>
        </div>
      )}
    </div>
  );
}
