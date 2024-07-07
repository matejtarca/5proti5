import { notFound } from "next/navigation";
import Music from "./Music";
import prisma from "@/services/prisma";

export default async function Page({
  params: { gameId },
  searchParams,
}: {
  params: { gameId: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  if (!searchParams?.nextRoundId) {
    notFound();
  }
  const round = await prisma.round.findUnique({
    where: {
      id: Number(searchParams.nextRoundId),
    },
  });

  if (!round) {
    notFound();
  }
  return (
    <>
      <Music
        gameId={Number(gameId)}
        nextRoundId={Number(searchParams.nextRoundId)}
      />
      <main className="flex min-h-screen flex-col items-center justify-center gap-24 p-24 text-white">
        <h1 className="text-9xl" style={{ textShadow: "1px 1px 2px black" }}>
          {round.index}. kolo
        </h1>
      </main>
    </>
  );
}
