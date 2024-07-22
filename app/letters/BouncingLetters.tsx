"use client";

import React, { useEffect, useRef } from "react";

type Letter = {
  char: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
};

const colors = [
  "#FF0000", // Red
  "#0000FF", // Blue
  "#00FFFF", // Cyan
  "#FF00FF", // Magenta
  "#000000", // Black
  "#00FF00", // Green
];

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

const BouncingLetters = ({ text }: { text: string }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const letters = useRef<Letter[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Initialize letters
    letters.current = text.split("").map((char, index) => ({
      char,
      x: clamp(Math.random() * width, 0, width - 40),
      y: clamp(Math.random() * height + 30, 40, height),
      vx: clamp(Math.random(), 0.3, 1) * 4,
      vy: clamp(Math.random(), 0.3, 1) * 4,
      color: colors[index % colors.length],
    }));

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      letters.current.forEach((letter) => {
        // Move letter
        letter.x += letter.vx;
        letter.y += letter.vy;

        // Bounce off edges
        if (letter.x < 0 || letter.x > width - 40) letter.vx *= -1;
        if (letter.y < 40 || letter.y > height) letter.vy *= -1;

        // Draw letter
        ctx.font = "60px Arial";
        ctx.fillStyle = letter.color;
        ctx.fillText(letter.char, letter.x, letter.y);
      });

      requestAnimationFrame(animate);
    };

    animate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <canvas ref={canvasRef} width={700} height={700} />;
};

export default BouncingLetters;
