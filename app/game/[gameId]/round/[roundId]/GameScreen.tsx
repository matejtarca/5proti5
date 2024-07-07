"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Props = {
  question: string;
  modifier: number;
  answers: {
    answer: string;
    points: number;
    index: number;
    id: number;
  }[];
  team1: {
    name: string;
    score: number;
  };
  team2: {
    name: string;
    score: number;
  };
};

function ScoreBox({ score, errors }: { score: number; errors?: number }) {
  return (
    <div
      className="bg-orange-400 text-white w-[200px] text-center text-5xl border-purple-500 border-4"
      style={{ textShadow: "1px 1px 2px black" }}
    >
      {score}
    </div>
  );
}

function ErrorCircle() {
  return (
    <div
      className="w-[50px] h-[50px] bg-red-500 rounded-full flex items-center justify-center text-3xl text-white border-purple-500 border-4"
      style={{ textShadow: "1px 1px 2px black" }}
    >
      X
    </div>
  );
}

function Spacer({ className }: { className: string }) {
  return <div className={className} />;
}

export default function GameScreen(props: Props) {
  const { question, answers, team1, team2, modifier } = props;
  const [currentScore, setCurrentScore] = useState(0);
  const [team1Errors, setTeam1Errors] = useState(0);
  const [team2Errors, setTeam2Errors] = useState(0);
  const [shownAnswers, setShownAnswers] = useState<number[]>([]);
  const [teamOnTurn, setTeamOnTurn] = useState(1);

  const teamOnTurnRef = useRef(teamOnTurn);

  useEffect(() => {
    teamOnTurnRef.current = teamOnTurn;
  }, [teamOnTurn]);

  const sortedAnswers = useMemo(
    () => answers.sort((a, b) => a.index - b.index),
    [answers]
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key >= "0" && event.key <= "9") {
        const index = Number(event.key);
        if (shownAnswers.includes(index)) {
          return;
        }

        const answer = sortedAnswers.find((a) => a.index === index);
        if (!answer) {
          return;
        }

        setShownAnswers((prev) => [...prev, index]);
        setCurrentScore((prev) => prev + answer.points);

        setTeamOnTurn((prev) => (prev === 1 ? 2 : 1));
      }

      if (event.key === "x") {
        if (teamOnTurnRef.current === 1) {
          setTeam1Errors((prev) => Math.min(prev + 1, 3));
        } else {
          setTeam2Errors((prev) => Math.min(prev + 1, 3));
        }

        setTeamOnTurn((prev) => (prev === 1 ? 2 : 1));
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className="flex flex-col w-screen items-center h-[99vh] bg-orange-100">
      <div className="grow-[2]"></div>
      <ScoreBox score={currentScore * modifier} />
      <div className="grow-[1]"></div>
      <div
        className="flex flex-col w-[80vw] text-3xl text-white border-b-4 border-purple-500"
        style={{ textShadow: "1px 1px 2px black" }}
      >
        {sortedAnswers.map((answer) => (
          <div
            className="bg-orange-200 w-full border-t-4 border-purple-500 border-x-4 pl-4 py-1 flex flex-row items-center"
            key={answer.id}
          >
            <div>{answer.index}.</div>
            {shownAnswers.includes(answer.index) && (
              <>
                <div className="ml-4">{answer.answer}</div>
                <div className="flex-grow"></div>
                <div className="mr-4">{answer.points}</div>
              </>
            )}
          </div>
        ))}
      </div>
      <div className="w-[80%] flex flex-row justify-end">
        <div
          className="flex flex-row w-[30%] bg-orange-200 border-x-4 border-purple-500 border-b-4 justify-between items-center text-white text-3xl"
          style={{ textShadow: "1px 1px 2px black" }}
        >
          <div className="pl-4">Spolu</div>
          <div className="bg-orange-100 py-1 pr-4 pl-6">{currentScore}</div>
        </div>
      </div>
      <div className="grow-[10]"></div>
      <div className="flex flex-row w-[80%] justify-between items-end">
        <div className="flex flex-col items-center gap-2">
          <div className={`${teamOnTurn === 1 ? "font-bold" : ""}`}>
            {team1.name}
          </div>
          <div className="flex flex-row w-full justify-start gap-4 pl-2">
            {team1Errors > 0 &&
              Array(team1Errors)
                .fill(0)
                .map((_, i) => <ErrorCircle key={i} />)}
          </div>
          <ScoreBox score={team1.score} errors={team1Errors} />
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className={`${teamOnTurn === 2 ? "font-bold" : ""}`}>
            {team2.name}
          </div>
          <div className="flex flex-row-reverse w-full justify-start gap-4 pl-2">
            {team2Errors > 0 &&
              Array(team2Errors)
                .fill(0)
                .map((_, i) => <ErrorCircle key={i} />)}
          </div>
          <ScoreBox score={team2.score} errors={team2Errors} />
        </div>
      </div>
      <div className="grow-[2]"></div>
    </div>
  );
}
