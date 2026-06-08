"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Obstacle = {
  name: string;
  action: "jump" | "slide";
};

const obstacles: Obstacle[] = [
  { name: "Brancard", action: "jump" },
  { name: "Patient alcoolisé", action: "jump" },
  { name: "Seringues volantes", action: "slide" },
  { name: "Dossiers patients", action: "slide" },
];

export default function ArcadePage() {
  const [step, setStep] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [distance, setDistance] = useState(0);
  const [speed, setSpeed] = useState(0.9);
  const [jumping, setJumping] = useState(false);
  const [sliding, setSliding] = useState(false);
  const [obstacleX, setObstacleX] = useState(160);
  const [currentObstacle, setCurrentObstacle] = useState<Obstacle>(obstacles[0]);
  const [highScores, setHighScores] = useState<number[]>([]);

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
    backgrounds[Math.floor(distance / 220) % backgrounds.length];

  useEffect(() => {
    try {
      const savedScores = localStorage.getItem("saumur-run-scores");
      if (savedScores) setHighScores(JSON.parse(savedScores));
    } catch {
      setHighScores([]);
    }
  }, []);

  useEffect(() => {
    if (gameStarted) return;

    const timer = setTimeout(() => {
      if (step < screens.length - 1) {
        setStep((s) => s + 1);
      } else {
        setGameStarted(true);
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, [step, gameStarted]);

  function chooseRandomObstacle() {
    setCurrentObstacle(obstacles[Math.floor(Math.random() * obstacles.length)]);
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

  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const timer = setInterval(() => {
      setDistance((d) => d + 1);
    }, 120);

    return () => clearInterval(timer);
  }, [gameStarted, gameOver]);

  useEffect(() => {
  if (distance > 1200) setSpeed(2.8);
  else if (distance > 900) setSpeed(2.4);
  else if (distance > 600) setSpeed(2.0);
  else if (distance > 300) setSpeed(1.6);
  else setSpeed(1.3);
}, [distance]);

  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const timer = setInterval(() => {
      setObstacleX((x) => {
        if (x <= -30) {
          chooseRandomObstacle();
          return 160;
        }

        return x - speed;
      });
    }, 45);

    return () => clearInterval(timer);
  }, [gameStarted, gameOver, speed]);

  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const touchingPlayer =
  currentObstacle.name === "Brancard"
    ? obstacleX > 8 && obstacleX < 11
    : obstacleX > 9 && obstacleX < 14;

    if (!touchingPlayer) return;

    if (currentObstacle.action === "jump" && !jumping) {
      saveScore();
      setGameOver(true);
    }

    if (currentObstacle.action === "slide" && !sliding) {
      saveScore();
      setGameOver(true);
    }
  }, [obstacleX, currentObstacle, jumping, sliding, gameStarted, gameOver]);

  function jump() {
    if (jumping || sliding || gameOver) return;

    setJumping(true);
    setTimeout(() => setJumping(false), 620);
  }

  function slide() {
    if (jumping || sliding || gameOver) return;

    setSliding(true);
    setTimeout(() => setSliding(false), 750);
  }

  function restartGame() {
    setDistance(0);
    setSpeed(0.9);
    setObstacleX(160);
    setJumping(false);
    setSliding(false);
    setGameOver(false);
    setGameStarted(true);
    setCurrentObstacle(obstacles[0]);
  }

  if (!gameStarted) {
    return (
      <main className="min-h-screen bg-slate-900 text-white p-3">
        <div className="mx-auto max-w-md">
          <Link href="/" className="inline-block mb-3 text-blue-300 font-semibold">
            ← Retour
          </Link>

          <div
            className="relative h-[82vh] rounded-3xl overflow-hidden shadow-xl bg-cover bg-center"
            style={{ backgroundImage: "url('/arcade/background.png')" }}
          >
            <div className="absolute inset-0 bg-black/10" />

            <h1 className="absolute top-8 left-4 right-4 text-4xl font-bold text-center text-white drop-shadow-lg">
              🎮 Saumur Emergency Run
            </h1>

            <div className="absolute left-4 right-4 bottom-8 bg-white text-slate-900 border-4 border-slate-900 rounded-2xl p-4 shadow-xl min-h-[150px] z-10">
              <div className="flex items-center gap-3">
                {current.speaker && (
                  <img
                    src="/arcade/severine.png"
                    alt="Séverine"
                    className="w-20 h-20 object-contain flex-shrink-0"
                  />
                )}

                <div>
                  {current.title && (
                    <h2 className="text-2xl font-bold mb-2">{current.title}</h2>
                  )}

                  {current.speaker && (
                    <div className="text-pink-600 font-bold text-lg mb-1">
                      Séverine
                    </div>
                  )}

                  <p className="text-xl leading-snug font-semibold">
                    {current.text}
                  </p>
                </div>
              </div>

              <p className="text-center text-xs text-slate-500 mt-3">
                L’intro avance automatiquement...
              </p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-900 text-white p-3 overflow-hidden">
      <div className="mx-auto max-w-md">
        <div className="flex justify-between items-center mb-3">
          <Link href="/arcade" className="text-blue-300 font-semibold text-sm">
            ← Intro
          </Link>

          <div className="text-right">
            <p className="text-2xl font-bold">{distance} m</p>
            <p className="text-xs text-slate-300">Vitesse {speed.toFixed(1)}</p>
          </div>
        </div>

        <div className="bg-slate-800 rounded-3xl p-3 shadow-xl">
          <div className="text-center mb-2">
            <h1 className="text-2xl font-bold">🎮 Saumur Emergency Run</h1>
            <p className="text-xs text-slate-300">
              {currentObstacle.action === "jump"
                ? "Obstacle bas : saute !"
                : "Obstacle haut : baisse-toi !"}
            </p>
          </div>

          <div className="h-[48vh] min-h-[330px] max-h-[430px] bg-slate-600 rounded-2xl relative overflow-hidden touch-none">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${currentGameBackground})` }}
            />

            <div className="absolute bottom-[45px] left-0 right-0 h-8 bg-slate-300" />

            <div
              className={`absolute left-[10%] transition-all ${
                jumping
  ? "bottom-[185px] duration-200 ease-out"
  : sliding
  ? "bottom-[64px] duration-200"
  : "bottom-[82px] duration-300 ease-in"
              }`}
            >
              <img
                src={sliding ? "/arcade/player-slide.png" : "/arcade/player.png"}
                alt="Joueur"
                className={`object-contain ${
                  sliding ? "w-20 h-20" : "w-24 h-24"
                }`}
              />
            </div>

            <div
              className={`absolute transition-none ${
                currentObstacle.action === "jump"
  ? "bottom-[58px]"
  : "bottom-[205px]"
              }`}
              style={{ left: `${obstacleX}%` }}
            >
              {currentObstacle.name === "Seringues volantes" ? (
                <img
                  src="/arcade/syringe.png"
                  alt="Seringues"
                  className="w-20 h-20 object-contain"
                />
              ) : currentObstacle.name === "Patient alcoolisé" ? (
                <img
                  src="/arcade/drunk-patient.png"
                  alt="Patient alcoolisé"
                  className="w-24 h-24 object-contain"
                />
              ) : currentObstacle.name === "Brancard" ? (
                <img
                  src="/arcade/stretcher.png"
                  alt="Brancard"
                  className="w-28 h-28 object-contain"
                />
              ) : currentObstacle.name === "Dossiers patients" ? (
                <img
                  src="/arcade/files.png"
                  alt="Dossiers patients"
                  className="w-16 h-16 object-contain"
                />
              ) : null}
            </div>

            {gameOver && (
              <div className="absolute inset-0 bg-black/75 flex items-center justify-center p-3 z-30">
                <div className="bg-slate-900 rounded-3xl p-4 text-center shadow-xl w-full max-h-[95%] overflow-y-auto">
                  <div className="text-5xl mb-2">💀</div>

                  <h2 className="text-3xl font-bold mb-2">Garde terminée</h2>

                  <p className="text-xl mb-2">
                    Score :{" "}
                    <span className="font-bold text-green-300">
                      {distance} m
                    </span>
                  </p>

                  <p className="text-sm text-slate-300 mb-3">
                    Obstacle fatal : {currentObstacle.name}
                  </p>

                  <div className="bg-slate-800 rounded-2xl p-3 mb-3 text-left">
                    <h3 className="text-lg font-bold mb-2 text-yellow-300">
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
                    onTouchStart={restartGame}
                    className="w-full bg-green-600 active:bg-green-800 rounded-2xl p-5 font-bold text-2xl"
                  >
                    🔁 Rejouer
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 mt-3">
            <button
              type="button"
              onClick={jump}
              onTouchStart={jump}
              disabled={gameOver}
              className="bg-blue-600 active:bg-blue-800 disabled:bg-slate-600 rounded-2xl p-6 font-bold text-2xl select-none"
            >
              ⬆️ Sauter
            </button>

            <button
              type="button"
              onClick={slide}
              onTouchStart={slide}
              disabled={gameOver}
              className="bg-purple-600 active:bg-purple-800 disabled:bg-slate-600 rounded-2xl p-6 font-bold text-2xl select-none"
            >
              ⬇️ Baisser
            </button>
          </div>

          <p className="mt-2 text-xs text-slate-300 text-center">
            Brancard / patient = sauter • Seringues / dossiers = baisser
          </p>
        </div>
      </div>
    </main>
  );
}