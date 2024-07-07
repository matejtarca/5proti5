"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import useSound from "use-sound";
// @ts-expect-error
import buzzerSound from "@/public/5proti5-buzzer.mp3";
// @ts-expect-error
import correctSound from "@/public/5proti5-correct.mp3";
import { setTeamScore } from "@/server/actions/setTeamScore";
import { useRouter } from "next/navigation";
import ErrorCircle from "@/components/ErrorCircle";
import ScoreBox from "@/components/ScoreBox";

type Props = {
  modifier: number;
  answers: {
    answer: string;
    points: number;
    index: number;
    id: number;
  }[];
  team1: {
    id: number;
    name: string;
    score: number;
  };
  team2: {
    id: number;
    name: string;
    score: number;
  };
  gameId: number;
  roundId: number;
  nextRoundId?: number;
};

export default function GameScreen(props: Props) {
  const { answers, team1, team2, modifier } = props;
  const teams = [team1, team2];

  const router = useRouter();

  const [currentScore, setCurrentScore] = useState(0);
  const [team1Errors, setTeam1Errors] = useState(0);
  const [team2Errors, setTeam2Errors] = useState(0);
  const [shownAnswers, setShownAnswers] = useState<number[]>([]);
  const [teamOnTurn, setTeamOnTurn] = useState<number | null>(null);
  const [showBigError, setShowBigError] = useState(false);
  const [isFinalAnswer, setIsFinalAnswer] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);

  const teamOnTurnRef = useRef(teamOnTurn);
  const isFinalAnswerRef = useRef(isFinalAnswer);
  const shownAnswersRef = useRef(shownAnswers);
  const gameEndedRef = useRef(gameEnded);

  useEffect(() => {
    teamOnTurnRef.current = teamOnTurn;
  }, [teamOnTurn]);

  useEffect(() => {
    shownAnswersRef.current = shownAnswers;
  }, [shownAnswers]);

  useEffect(() => {
    isFinalAnswerRef.current = isFinalAnswer;
  }, [isFinalAnswer]);

  useEffect(() => {
    gameEndedRef.current = gameEnded;
  }, [gameEnded]);

  const [playBuzzer] = useSound(buzzerSound);
  const [playCorrect] = useSound(correctSound);

  const sortedAnswers = useMemo(
    () => answers.sort((a, b) => a.index - b.index),
    [answers]
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (gameEndedRef.current && event.key === "n") {
        if (props.nextRoundId) {
          router.push(`/game/${props.gameId}/round/${props.nextRoundId}`);
        } else {
          router.push(`/game/${props.gameId}/end`);
        }
      }
      if (gameEndedRef.current) {
        return;
      }

      if (event.key >= "0" && event.key <= "9") {
        const index = Number(event.key);

        if (shownAnswersRef.current.includes(index)) {
          return;
        }

        const answer = sortedAnswers.find((a) => a.index === index);
        if (!answer) {
          return;
        }

        setShownAnswers((prev) => [...prev, index]);
        setCurrentScore((prev) => prev + answer.points);
      }

      if (event.key === "x") {
        if (teamOnTurnRef.current === 1) {
          if (isFinalAnswerRef.current) {
            setTeam1Errors(3);
          } else {
            setTeam1Errors((prev) => Math.min(prev + 1, 3));
          }
        }

        if (teamOnTurnRef.current === 2) {
          if (isFinalAnswerRef.current) {
            setTeam2Errors(3);
          } else {
            setTeam2Errors((prev) => Math.min(prev + 1, 3));
          }
        }

        if (teamOnTurnRef.current === null) {
          setShowBigError(true);
        }
      }

      if (event.key === "ArrowLeft" && teamOnTurnRef.current === null) {
        setTeamOnTurn(1);
      }

      if (event.key === "ArrowRight" && teamOnTurnRef.current === null) {
        setTeamOnTurn(2);
      }

      if (event.key === "r") {
        setTeamOnTurn(null);
        setTeam1Errors(0);
        setTeam2Errors(0);
        setShownAnswers([]);
        setCurrentScore(0);
        setIsFinalAnswer(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // when errors are added
  useEffect(() => {
    if (isFinalAnswer && team1Errors === 3 && team2Errors === 3) {
      const winningTeam = teamOnTurn === 1 ? 2 : 1;
      setTeamScore({
        teamId: teams[winningTeam - 1].id,
        score: currentScore * modifier,
        gameId: props.gameId,
        roundId: props.roundId,
      });
      setGameEnded(true);
    }
    if (team1Errors > 0 || team2Errors > 0) {
      playBuzzer();
    }
    if (teamOnTurn === 1 && team1Errors === 3 && !isFinalAnswer) {
      setTeamOnTurn(2);
      setIsFinalAnswer(true);
    }
    if (teamOnTurn === 2 && team2Errors === 3 && !isFinalAnswer) {
      setTeamOnTurn(1);
      setIsFinalAnswer(true);
    }
  }, [team1Errors, team2Errors]);

  // when answers are added
  useEffect(() => {
    if (gameEnded) {
      return;
    }
    if (shownAnswers.length > 0) {
      playCorrect();
    }

    if (
      (shownAnswers.length === answers.length || isFinalAnswer) &&
      teamOnTurn !== null
    ) {
      setTeamScore({
        teamId: teams[teamOnTurn - 1].id,
        score: currentScore * modifier,
        gameId: props.gameId,
        roundId: props.roundId,
      });
      setGameEnded(true);
    }
  }, [shownAnswers]);

  useEffect(() => {
    if (showBigError) {
      playBuzzer();

      setTimeout(() => {
        setShowBigError(false);
      }, 1000);
    }
  }, [showBigError]);

  return (
    <div className="flex flex-col w-screen items-center h-[99vh] ">
      <div className="grow-[2]"></div>
      <ScoreBox score={currentScore * modifier} />
      <div className="grow-[1]"></div>
      <div
        className="flex flex-col w-[1200px] text-3xl text-white"
        style={{ textShadow: "1px 1px 2px black" }}
      >
        {sortedAnswers.map((answer) => (
          <div
            className={`bg-orange-200 w-full border-x-4 pl-4 flex flex-row items-center mb-[2px] ${
              shownAnswers.includes(answer.index)
                ? "answer-line-shown"
                : "answer-line py-1"
            }`}
            key={answer.id}
          >
            <div>{answer.index}.</div>
            {shownAnswers.includes(answer.index) && (
              <>
                <div className="ml-4">{answer.answer}</div>
                <div className="flex-grow"></div>
                <div className="bg-[#FBB53C] py-1 w-[60px] text-right pr-2">
                  <div>{answer.points}</div>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
      <div className="w-[1200px] flex flex-row justify-end">
        <div
          className="flex flex-row w-[30%] bg-orange-200 border-x-4 border-purple-500 border-b-4 justify-between items-center text-white text-3xl answer-sum"
          style={{ textShadow: "1px 1px 2px black" }}
        >
          <div className="pl-4">Spolu</div>
          <div className="bg-[#FBB53C] py-1 w-[60px] text-right pr-2">
            {currentScore}
          </div>
        </div>
      </div>
      <div className="grow-[10]"></div>
      <div className="flex flex-row w-[1200px] justify-between items-end">
        <div className="flex flex-col items-center gap-2">
          <ScoreBox
            score={team1.score}
            errors={team1Errors}
            teamName={team1.name}
            teamOnTurn={teamOnTurn === 1}
          />
        </div>
        <div className="flex flex-col items-center gap-2">
          <ScoreBox
            score={team2.score}
            errors={team2Errors}
            errorsReversed
            teamName={team2.name}
            teamOnTurn={teamOnTurn === 2}
          />
        </div>
      </div>
      <div className="grow-[2]"></div>
      {showBigError && (
        <div className="absolute bottom-10">
          <ErrorCircle isLarge />
        </div>
      )}
    </div>
  );
}
