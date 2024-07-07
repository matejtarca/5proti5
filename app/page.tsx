import prisma from "@/services/prisma";
import Image from "next/image";
import Link from "next/link";

export default async function Home() {
  const game = await prisma.game.findFirst();
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1
        className="text-white text-6xl"
        style={{ textShadow: "1px 1px 2px black" }}
      >
        5 proti 5
      </h1>
      {game && (
        <Link
          href={`/game/${game.id}`}
          className="text-white text-6xl"
          style={{ textShadow: "1px 1px 2px black" }}
        >
          Start game
        </Link>
      )}
    </main>
  );
}
