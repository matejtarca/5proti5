import prisma from "@/services/prisma";
import { notFound, redirect } from "next/navigation";

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
      rounds: true,
    },
  });

  if (!game) {
    notFound();
  }

  const firstRoundId = game.rounds[0].id;

  if (!firstRoundId) {
    notFound();
  }

  redirect(`/game/${gameId}/round/${firstRoundId}`);
}
