"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

type Obstacle = {
  emoji: string;
  name: string;
  action: "jump" | "slide";
};

const obstacles: Obstacle[] = [
  { emoji: "🛏️", name: "Brancard", action: "jump" },
  { emoji: "🍺", name: "Patient alcoolisé", action: "jump" },
  { emoji: "💉", name: "Seringues volantes", action: "slide" },
  { emoji: "📁", name: "Dossiers patients", action: "slide" },
];

export default function ArcadePage() {
  const [step, setStep] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [distance, setDistance] = useState(0);
  const [speed, setSpeed] = useState(2);
  const [jumping, setJumping] = useState(false);
  const [sliding, setSliding] = useState(false);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const [obstacleX, setObstacleX] = useState(100);
  const [currentObstacle, setCurrentObstacle] = useState<Obstacle>(obstacles[0]);
  const [highScores, setHighScores] = useState<number[]>([]);

  const lastTouchTime = useRef(0);

  const screens = [
    { title: "08h29", text: "La garde est sur le point de finir..." },
    { speaker: "Séverine", text: "La relève devrait déjà être là..." },
    { speaker: "Séverine", text: "Attends..." },
    { speaker: "Séverine", text: "Personne n'est venu pour te remplacer." },
    {
      speaker: "Séverine",
      text: "Vite ! Échappe-toi de l'hôpital avant qu'on te trouve un nouveau patient !",
    },
  ];

  const current = screens[step];

  const backgrounds = [
    "/arcade/game-background.png",
    "/arcade/waiting-room.png",
    "/arcade/radiology.png",
    "/arcade/dropzone.png",
  ];

  const currentGameBackground =
    backgrounds[Math.floor(distance / 250) % backgrounds.length];

  useEffect(() => {
    try {
      const savedScores = localStorage.getItem("saumur-run-scores");
      if (savedScores) {
        setHighScores(JSON.parse(savedScores));
      }
    } catch {
      setHighScores([]);
    }
  }, []);

  function chooseRandomObstacle() {
    const randomIndex = Math.floor(Math.random() * obstacles.length);
    setCurrentObstacle(obstacles[randomIndex]);
  }

  function saveScore() {
    const updatedScores = [...highScores, distance]
      .sort((a, b) => b - a)
      .slice(0, 10);

    setHighScores(updatedScores);

    try {
      localStorage.setItem("saumur-run-scores", JSON.stringify(updatedScores));
    } catch {}
  }

  function advanceIntro() {
    setStep((currentStep) => {
      if (currentStep >= screens.length - 1) {
        setGameStarted(true);
        return currentStep;
      }

      return currentStep + 1;
    });
  }
useEffect(() => {
  if (gameStarted) return;

  const timer = setTimeout(() => {
    advanceIntro();
  }, 2500);

  return () => clearTimeout(timer);
}, [step, gameStarted]);
  function handleIntroTouch(e: React.TouchEvent<HTMLButtonElement>) {
    e.preventDefault();
    e.stopPropagation();
    lastTouchTime.current = Date.now();
    advanceIntro();
  }

  function handleIntroClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    e.stopPropagation();

    if (Date.now() - lastTouchTime.current < 700) return;

    advanceIntro();
  }

  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const timer = setInterval(() => {
      setDistance((d) => d + 1);
    }, 100);

    return () => clearInterval(timer);
  }, [gameStarted, gameOver]);

  useEffect(() => {
    if (distance > 1000) {
      setSpeed(5);
    } else if (distance > 500) {
      setSpeed(4);
    } else if (distance > 250) {
      setSpeed(3);
    } else if (distance > 100) {
      setSpeed(2.5);
    } else {
      setSpeed(2);
    }
  }, [distance]);

  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const obstacleTimer = setInterval(() => {
      setObstacleX((x) => {
        if (x <= -10) {
          chooseRandomObstacle();
          return 110;
        }

        return x - speed;
      });
    }, 50);

    return () => clearInterval(obstacleTimer);
  }, [gameStarted, gameOver, speed]);

  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const isTouchingPlayer =
      currentObstacle.name === "Brancard"
        ? obstacleX > 7 && obstacleX < 10
        : obstacleX > 6 && obstacleX < 11;

    if (!isTouchingPlayer) return;

    if (currentObstacle.action === "jump" && !jumping) {
      saveScore();
      setGameOver(true);
    }

    if (currentObstacle.action === "slide" && !sliding) {
      saveScore();
      setGameOver(true);
    }
  }, [obstacleX, jumping, sliding, currentObstacle, gameStarted, gameOver]);

  function jump() {
    if (!jumping && !sliding && !gameOver) {
      setJumping(true);
      setTimeout(() => setJumping(false), 450);
    }
  }

  function slide() {
    if (!jumping && !sliding && !gameOver) {
      setSliding(true);
      setTimeout(() => setSliding(false), 800);
    }
  }

  function restartGame() {
    setDistance(0);
    setSpeed(2);
    setObstacleX(100);
    setJumping(false);
    setSliding(false);
    setGameOver(false);
    setGameStarted(true);
    setCurrentObstacle(obstacles[0]);
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;

      if (!gameStarted) {
        if (e.key === "Enter" || e.code === "Space") {
          advanceIntro();
        }
        return;
      }

      if (e.key === "ArrowUp" || e.code === "Space") {
        jump();
      }

      if (e.key === "ArrowDown") {
        slide();
      }

      if (e.key === "Enter" && gameOver) {
        restartGame();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [jumping, sliding, gameOver, gameStarted]);

  function handleTouchStart(e: React.TouchEvent<HTMLDivElement>) {
    setTouchStartY(e.touches[0].clientY);
  }

  function handleTouchEnd(e: React.TouchEvent<HTMLDivElement>) {
    if (touchStartY === null) return;

    const touchEndY = e.changedTouches[0].clientY;
    const difference = touchStartY - touchEndY;

    if (difference > 50) jump();
    if (difference < -50) slide();

    setTouchStartY(null);
  }

  if (gameStarted) {
    return (
      <main className="min-h-screen bg-slate-900 text-white p-4">
        <div className="max-w-4xl mx-auto">
          <Link href="/arcade" className="inline-block mb-6 text-blue-300 font-semibold">
            ← Recommencer l'intro
          </Link>

          <div className="bg-slate-800 rounded-3xl p-6 shadow-xl">
            <h1 className="text-3xl font-bold mb-6">🎮 Saumur Emergency Run</h1>

            <div className="bg-slate-700 rounded-2xl p-4 mb-4 flex justify-between gap-4">
              <div>
                <p className="text-xl font-bold">Distance : {distance} m</p>
                <p className="text-sm text-slate-300">Vitesse : {speed.toFixed(1)}</p>
              </div>

              <p className="text-sm text-slate-300">
                Obstacle : {currentObstacle.name}
              </p>
            </div>

            <div
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              className="h-64 bg-slate-600 rounded-2xl relative overflow-hidden touch-none"
            >
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${currentGameBackground})` }}
              />

              <div className="absolute bottom-0 left-0 right-0 h-4 bg-slate-300" />

              <div
                className={`absolute transition-all ${
                  jumping
                    ? "bottom-28 left-12 duration-200 ease-out"
                    : sliding
                    ? "bottom-0 left-12 duration-300"
                    : "bottom-0 left-12 translate-y-2 duration-500 ease-in"
                }`}
              >
                <img
                  src={sliding ? "/arcade/player-slide.png" : "/arcade/player.png"}
                  alt="Joueur"
                  className={`object-contain ${sliding ? "w-28 h-28" : "w-40 h-40"}`}
                />
              </div>

              <div
                className={`absolute transition-none ${
                  currentObstacle.action === "jump" ? "bottom-4" : "bottom-28"
                }`}
                style={{ left: `${obstacleX}%` }}
              >
                {currentObstacle.name === "Seringues volantes" ? (
                  <img src="/arcade/syringe.png" alt="Seringues" className="w-28 h-28 object-contain translate-y-10" />
                ) : currentObstacle.name === "Patient alcoolisé" ? (
                  <img src="/arcade/drunk-patient.png" alt="Patient alcoolisé" className="w-40 h-40 object-contain translate-y-8" />
                ) : currentObstacle.name === "Brancard" ? (
                  <img src="/arcade/stretcher.png" alt="Brancard" className="w-40 h-40 object-contain translate-y-12" />
                ) : currentObstacle.name === "Dossiers patients" ? (
                  <img src="/arcade/files.png" alt="Dossiers patients" className="w-24 h-24 object-contain translate-y-6" />
                ) : null}
              </div>

              {gameOver && (
                <div className="absolute inset-0 bg-black/70 flex items-center justify-center p-3">
                  <div className="bg-slate-900 rounded-3xl p-4 text-center shadow-xl max-w-sm w-full max-h-[95%] overflow-y-auto">
                    <div className="text-5xl mb-3">💀</div>

                    <h2 className="text-3xl font-bold mb-3">Garde terminée</h2>

                    <p className="text-xl mb-2">
                      Tu as parcouru{" "}
                      <span className="font-bold text-green-300">{distance} m</span>
                    </p>

                    <p className="text-sm text-slate-300 mb-4">
                      Obstacle fatal : {currentObstacle.name}
                    </p>

                    <div className="bg-slate-800 rounded-2xl p-3 mb-3 text-left">
                      <h3 className="text-lg font-bold mb-3 text-yellow-300">
                        🏆 Top 10
                      </h3>

                      {highScores.length === 0 ? (
                        <p className="text-sm text-slate-300">
                          Aucun record enregistré
                        </p>
                      ) : (
                        <ol className="space-y-1 text-sm">
                          {highScores.map((score, index) => (
                            <li key={index}>
                              {index + 1}. {score} m
                            </li>
                          ))}
                        </ol>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={restartGame}
                      className="w-full bg-green-600 hover:bg-green-700 rounded-2xl p-5 font-bold text-xl"
                    >
                      🔁 Rejouer
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6">
              <button
                type="button"
                onClick={jump}
                disabled={gameOver}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 rounded-2xl p-5 font-bold text-xl"
              >
                ⬆️ Sauter
              </button>

              <button
                type="button"
                onClick={slide}
                disabled={gameOver}
                className="bg-purple-600 hover:bg-purple-700 disabled:bg-slate-600 rounded-2xl p-5 font-bold text-xl"
              >
                ⬇️ Glissade
              </button>
            </div>

            <p className="mt-4 text-sm text-slate-300 text-center">
              Brancard / patient alcoolisé = sauter • Seringues / dossiers = glisser
              <br />
              Téléphone : swipe haut pour sauter, swipe bas pour glisser.
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-900 text-white p-4">
      <div className="max-w-5xl mx-auto">
        <Link href="/" className="inline-block mb-6 text-blue-300 font-semibold">
          ← Retour à l'accueil
        </Link>

        <div
          className="relative rounded-3xl overflow-hidden shadow-xl min-h-[620px] bg-cover bg-center"
          style={{ backgroundImage: "url('/arcade/background.png')" }}
        >
          <div className="absolute inset-0 bg-black/10 pointer-events-none" />

          <h1 className="absolute top-8 left-0 right-0 text-5xl font-bold text-center text-white drop-shadow-lg">
            🎮 Saumur Emergency Run
          </h1>

          <div className="absolute left-8 right-8 bottom-28 bg-white text-slate-900 border-4 border-slate-900 rounded-2xl p-5 shadow-xl min-h-[130px] z-10 flex items-center gap-5">
            {current.speaker && (
              <img
                src="/arcade/severine.png"
                alt="Séverine"
                className="w-24 h-24 object-contain flex-shrink-0"
              />
            )}

            <div>
              {current.title && (
                <h2 className="text-2xl font-bold mb-2">{current.title}</h2>
              )}

              {current.speaker && (
                <div className="text-pink-600 font-bold text-xl mb-2">
                  Séverine
                </div>
              )}

              <p className="text-2xl leading-relaxed font-semibold">
                {current.text}
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}