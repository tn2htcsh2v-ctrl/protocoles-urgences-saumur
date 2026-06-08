"use client";

import { useState } from "react";
import Link from "next/link";

type ViewMode = "face" | "dos";

type ZoneKey =
  | "cuirChevelu"
  | "visage"
  | "levre"
  | "paupiere"
  | "thorax"
  | "abdomen"
  | "bras"
  | "coude"
  | "main"
  | "doigt"
  | "jambe"
  | "genou"
  | "pied"
  | "nuque"
  | "dos"
  | "lombaires"
  | "fesse";

const zones: Record<
  ZoneKey,
  { label: string; fil: string; ablation: string; conseil: string }
> = {
  cuirChevelu: { label: "Cuir chevelu", fil: "3/0 ou agrafes", ablation: "7 à 10 jours", conseil: "Agrafes pratiques si plaie linéaire." },
  visage: { label: "Visage", fil: "5/0 ou 6/0", ablation: "5 jours", conseil: "Retrait précoce pour limiter les marques." },
  levre: { label: "Lèvre", fil: "5/0 ou 6/0", ablation: "5 jours", conseil: "Bien réaligner le vermillon." },
  paupiere: { label: "Paupière", fil: "6/0", ablation: "3 à 5 jours", conseil: "Avis spécialisé si bord libre, canal lacrymal ou plaie profonde." },
  thorax: { label: "Thorax", fil: "3/0 ou 4/0", ablation: "10 à 12 jours", conseil: "Adapter si forte tension cutanée." },
  abdomen: { label: "Abdomen", fil: "3/0 ou 4/0", ablation: "10 à 12 jours", conseil: "Délai plus long si plaie sous tension." },
  bras: { label: "Bras", fil: "4/0", ablation: "10 jours", conseil: "Allonger le délai près d’une articulation." },
  coude: { label: "Coude", fil: "3/0 ou 4/0", ablation: "12 à 14 jours", conseil: "Zone mobile : immobilisation courte si tension." },
  main: { label: "Main", fil: "4/0 ou 5/0", ablation: "10 à 12 jours", conseil: "Explorer mobilité, sensibilité et tendons." },
  doigt: { label: "Doigt", fil: "5/0", ablation: "10 à 12 jours", conseil: "Vérifier tendon, sensibilité, vascularisation." },
  jambe: { label: "Jambe", fil: "3/0 ou 4/0", ablation: "12 à 14 jours", conseil: "Cicatrisation souvent plus lente." },
  genou: { label: "Genou", fil: "3/0 ou 4/0", ablation: "12 à 14 jours", conseil: "Zone mobile : éviter une ablation trop précoce." },
  pied: { label: "Pied", fil: "3/0 ou 4/0", ablation: "12 à 14 jours", conseil: "Surveiller macération et appui." },
  nuque: { label: "Nuque", fil: "3/0 ou 4/0", ablation: "7 à 10 jours", conseil: "Adapter selon tension et pilosité." },
  dos: { label: "Dos", fil: "3/0 ou 4/0", ablation: "12 à 14 jours", conseil: "Zone souvent sous tension : éviter retrait trop précoce." },
  lombaires: { label: "Région lombaire", fil: "3/0 ou 4/0", ablation: "12 à 14 jours", conseil: "Attention aux mouvements et à la tension cutanée." },
  fesse: { label: "Fesse", fil: "3/0 ou 4/0", ablation: "12 à 14 jours", conseil: "Surveiller macération, frottements et tension." },
};

export default function SuturesPage() {
  const [view, setView] = useState<ViewMode>("face");
  const [selectedZone, setSelectedZone] = useState<ZoneKey>("visage");
  const selected = zones[selectedZone];

  function setViewMode(newView: ViewMode) {
    setView(newView);
    setSelectedZone(newView === "face" ? "visage" : "dos");
  }

  function isActive(zone: ZoneKey) {
    return selectedZone === zone;
  }

  function markerColor(zone: ZoneKey) {
    return isActive(zone) ? "#ef4444" : "#60a5fa";
  }

  function ZoneButton({
    zone,
    x,
    y,
    label,
  }: {
    zone: ZoneKey;
    x: number;
    y: number;
    label: string;
  }) {
    return (
      <g onClick={() => setSelectedZone(zone)} className="cursor-pointer">
        <circle
          cx={x}
          cy={y}
          r={isActive(zone) ? 20 : 17}
          fill={markerColor(zone)}
          stroke="white"
          strokeWidth="4"
        />
        <text
          x={x}
          y={y + 4}
          textAnchor="middle"
          fontSize="10"
          fontWeight="bold"
          fill="white"
        >
          {label}
        </text>
      </g>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100 p-4 text-slate-900">
      <div className="mx-auto max-w-md">
        <Link href="/outils" className="text-blue-700 font-semibold">
          ← Retour aux outils
        </Link>

        <h1 className="text-3xl font-bold mt-4 mb-2">✂️ Guide des sutures</h1>

        <p className="text-sm text-slate-600 mb-4">
          Clique sur une zone du corps pour afficher le calibre conseillé et le délai d’ablation.
        </p>

        <div className="grid grid-cols-2 gap-2 mb-4">
          <button
            type="button"
            onClick={() => setViewMode("face")}
            className={`rounded-2xl p-3 font-bold ${
              view === "face" ? "bg-blue-700 text-white" : "bg-white text-slate-700"
            }`}
          >
            Face
          </button>

          <button
            type="button"
            onClick={() => setViewMode("dos")}
            className={`rounded-2xl p-3 font-bold ${
              view === "dos" ? "bg-blue-700 text-white" : "bg-white text-slate-700"
            }`}
          >
            Dos
          </button>
        </div>

        <div className="bg-white rounded-3xl p-4 shadow mb-4">
          <svg viewBox="0 0 340 620" className="mx-auto h-[560px] max-h-[68vh] w-full">
            <rect width="340" height="620" rx="28" fill="#f8fafc" />

            <circle cx="170" cy="75" r="43" fill="#fed7aa" stroke="#334155" strokeWidth="5" />
            <rect x="151" y="115" width="38" height="35" rx="12" fill="#fed7aa" stroke="#334155" strokeWidth="5" />

            <path
              d="M103 150 C120 125 220 125 237 150 L252 318 C255 348 85 348 88 318 Z"
              fill={view === "face" ? "#bfdbfe" : "#c4b5fd"}
              stroke="#334155"
              strokeWidth="5"
            />

            <path d="M100 170 C60 205 50 300 64 390" fill="none" stroke="#fed7aa" strokeWidth="34" strokeLinecap="round" />
            <path d="M240 170 C280 205 290 300 276 390" fill="none" stroke="#fed7aa" strokeWidth="34" strokeLinecap="round" />
            <circle cx="64" cy="405" r="23" fill="#fed7aa" stroke="#334155" strokeWidth="5" />
            <circle cx="276" cy="405" r="23" fill="#fed7aa" stroke="#334155" strokeWidth="5" />
            <path d="M135 340 C124 405 119 470 114 555" fill="none" stroke="#bbf7d0" strokeWidth="40" strokeLinecap="round" />
            <path d="M205 340 C216 405 221 470 226 555" fill="none" stroke="#bbf7d0" strokeWidth="40" strokeLinecap="round" />
            <ellipse cx="108" cy="575" rx="36" ry="17" fill="#fed7aa" stroke="#334155" strokeWidth="5" />
            <ellipse cx="232" cy="575" rx="36" ry="17" fill="#fed7aa" stroke="#334155" strokeWidth="5" />

            {view === "face" ? (
              <>
                <ZoneButton zone="cuirChevelu" x={170} y={35} label="Crâne" />
                <ZoneButton zone="visage" x={170} y={74} label="Face" />
                <ZoneButton zone="paupiere" x={143} y={64} label="Œil" />
                <ZoneButton zone="levre" x={170} y={95} label="Lèvre" />
                <ZoneButton zone="thorax" x={170} y={205} label="Thorax" />
                <ZoneButton zone="abdomen" x={170} y={290} label="Abdo" />
                <ZoneButton zone="bras" x={67} y={270} label="Bras" />
                <ZoneButton zone="coude" x={60} y={335} label="Coude" />
                <ZoneButton zone="main" x={276} y={405} label="Main" />
                <ZoneButton zone="doigt" x={295} y={425} label="Doigt" />
                <ZoneButton zone="jambe" x={118} y={460} label="Jambe" />
                <ZoneButton zone="genou" x={222} y={460} label="Genou" />
                <ZoneButton zone="pied" x={232} y={575} label="Pied" />
              </>
            ) : (
              <>
                <ZoneButton zone="cuirChevelu" x={170} y={35} label="Crâne" />
                <ZoneButton zone="nuque" x={170} y={130} label="Nuque" />
                <ZoneButton zone="dos" x={170} y={215} label="Dos" />
                <ZoneButton zone="lombaires" x={170} y={300} label="Lomb." />
                <ZoneButton zone="bras" x={67} y={270} label="Bras" />
                <ZoneButton zone="coude" x={60} y={335} label="Coude" />
                <ZoneButton zone="main" x={276} y={405} label="Main" />
                <ZoneButton zone="fesse" x={170} y={350} label="Fesse" />
                <ZoneButton zone="jambe" x={118} y={460} label="Jambe" />
                <ZoneButton zone="genou" x={222} y={460} label="Genou" />
                <ZoneButton zone="pied" x={232} y={575} label="Pied" />
              </>
            )}
          </svg>
        </div>

        <div className="bg-slate-900 text-white rounded-3xl p-5 shadow-xl mb-4">
          <h2 className="text-2xl font-bold mb-3">{selected.label}</h2>

          <p className="text-lg mb-2">
            <span className="font-bold text-blue-300">Calibre conseillé :</span>{" "}
            {selected.fil}
          </p>

          <p className="text-lg mb-2">
            <span className="font-bold text-green-300">Ablation :</span>{" "}
            {selected.ablation}
          </p>

          <p className="text-sm text-slate-300 mt-4">💡 {selected.conseil}</p>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 text-sm text-yellow-900">
          <p className="font-bold mb-1">À adapter au contexte</p>
          <p>
            Les délais peuvent varier selon l’âge, la tension de la plaie,
            l’immunodépression, le diabète, l’infection, la localisation exacte
            et l’avis spécialisé.
          </p>
        </div>
      </div>
    </main>
  );
}