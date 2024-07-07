import prisma from "@/services/prisma";
import { notFound } from "next/navigation";
import GameScreen from "./GameScreen";

export default async function Page({
  params: { gameId, roundId },
}: {
  params: { gameId: string; roundId: string };
}) {
  const round = await prisma.round.findUnique({
    where: {
      id: Number(roundId),
      gameId: Number(gameId),
    },
    include: {
      answers: true,
      game: {
        include: {
          teams: true,
        },
      },
    },
  });

  if (!round) {
    notFound();
  }

  const nextRoundIndex = round.index + 1;

  const nextRound = await prisma.round.findUnique({
    where: {
      gameId_index: {
        gameId: Number(gameId),
        index: nextRoundIndex,
      },
    },
  });

  return (
    <GameScreen
      answers={round.answers}
      team1={round.game?.teams[0] ?? { name: "Team 1", score: 0, id: 1 }}
      team2={round.game?.teams[1] ?? { name: "Team 2", score: 0, id: 2 }}
      modifier={round.modifier ?? 1}
      gameId={Number(gameId)}
      roundId={Number(roundId)}
      nextRoundId={nextRound?.id}
    />
  );
}
