import type { MonitorQuestion } from "./monitorQuestions";
import {
  growthQuestions,
  matchQuestions,
  roleQuestions,
  teamQuestions,
} from "./monitorQuestions";

export interface Revo111Question extends MonitorQuestion {
  axis: "role" | "team" | "match" | "growth";
}

function withAxis(
  questions: MonitorQuestion[],
  axis: Revo111Question["axis"],
  startId: number
): Revo111Question[] {
  return questions.slice(0, 11).map((question, index) => ({
    ...question,
    id: startId + index,
    axis,
  }));
}

export const revo111Questions: Revo111Question[] = [
  ...withAxis(roleQuestions, "role", 1),
  ...withAxis(teamQuestions, "team", 12),
  ...withAxis(matchQuestions, "match", 23),
  ...withAxis(growthQuestions, "growth", 34),
];

export const REVO111_TOTAL_QUESTIONS = revo111Questions.length;
