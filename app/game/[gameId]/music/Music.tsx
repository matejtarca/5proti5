"use client";

import useSound from "use-sound";
// @ts-expect-error
import music from "@/public/5proti5-music-between.mp3";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Music({
  gameId,
  nextRoundId,
}: {
  gameId: number;
  nextRoundId: number;
}) {
  const [play] = useSound(music);
  const router = useRouter();

  useEffect(() => {
    const timeoutRedirect = setTimeout(() => {
      router.push(`/game/${gameId}/round/${nextRoundId}`);
    }, 10500);

    play();

    return () => {
      clearTimeout(timeoutRedirect);
    };
  }, [play]);
  return null;
}
