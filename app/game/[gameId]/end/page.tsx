import ScoreBox from "@/components/ScoreBox";
import prisma from "@/services/prisma";
import { notFound } from "next/navigation";
import WinningEffect from "./WinningEffect";

export default async function Page({
  params: { gameId },
}: {
  params: { gameId: string };
}) {
  const game = await prisma.game.findUnique({
    where: {
      id: Number(gameId),
    },
    include: {
      teams: true,
    },
  });

  if (!game) {
    notFound();
  }

  return (
    <main className="flex min-h-screen flex-col items-center gap-24 p-24 text-white">
      <h1 className="text-8xl" style={{ textShadow: "1px 1px 2px black" }}>
        Výsledky
      </h1>

      <div className="flex flex-row justify-around w-[80%]">
        <div className="flex flex-col items-center gap-2">
          <ScoreBox score={game.teams[0].score} teamName={game.teams[0].name} />
        </div>

        <div className="flex flex-col items-center gap-2">
          <ScoreBox score={game.teams[1].score} teamName={game.teams[1].name} />
        </div>
      </div>
      <WinningEffect />
    </main>
  );
}
