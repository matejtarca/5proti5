import prisma from "@/services/prisma";
import { notFound } from "next/navigation";

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
    <main className="flex min-h-screen flex-col items-center justify-between p-24 text-white">
      5 proti 5
    </main>
  );
}
