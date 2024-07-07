"use server";

import prisma from "@/services/prisma";
import { revalidatePath } from "next/cache";

type SetTeamScoreProps = {
  teamId: number;
  roundId: number;
  gameId: number;
  score: number;
};

export async function setTeamScore({
  teamId,
  score,
  gameId,
  roundId,
}: SetTeamScoreProps) {
  await prisma.team.update({
    where: {
      id: teamId,
      gameId,
    },
    data: {
      score: {
        increment: score,
      },
    },
  });

  revalidatePath(`/game/${gameId}/round/${roundId}`);
}
