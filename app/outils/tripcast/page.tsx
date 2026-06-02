"use client";

import { useState } from "react";
import Link from "next/link";

export default function TripcastPage() {
  const [trauma, setTrauma] = useState(1);
  const [immobilisation, setImmobilisation] = useState(0);
  const [age, setAge] = useState(0);
  const [sexe, setSexe] = useState(0);
  const [bmi, setBmi] = useState(0);
  const [atcdFamilial, setAtcdFamilial] = useState(0);
  const [atcdPersonnel, setAtcdPersonnel] = useState(0);
  const [hormones, setHormones] = useState(0);
  const [cancer, setCancer] = useState(0);
  const [grossesse, setGrossesse] = useState(0);
  const [immobilisationRecente, setImmobilisationRecente] = useState(0);
  const [chirurgie, setChirurgie] = useState(0);
  const [comorbidite, setComorbidite] = useState(0);
  const [varices, setVarices] = useState(0);

  const score =
    trauma +
    immobilisation +
    age +
    sexe +
    bmi +
    atcdFamilial +
    atcdPersonnel +
    hormones +
    cancer +
    grossesse +
    immobilisationRecente +
    chirurgie +
    comorbidite +
    varices;

  const hautRisque = score >= 7;

  return (
    <main className="min-h-screen bg-slate-100 p-4 pb-24 text-slate-900">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl p-6 text-slate-900">
        <Link href="/outils" className="inline-block mb-6 text-blue-600 font-semibold">
          ← Retour aux outils
        </Link>

        <h1 className="text-3xl font-bold mb-2 text-slate-900">
          Score TRiP(cast)
        </h1>

        <p className="text-gray-600 mb-6">
          Risque thromboembolique après traumatisme du membre inférieur avec immobilisation.
        </p>

        <div
          className={`rounded-2xl p-6 mb-6 text-center border ${
            hautRisque ? "bg-red-50 border-red-200" : "bg-green-50 border-green-200"
          }`}
        >
          <div className="text-lg text-gray-600">Score total</div>

          <div
            className={`text-5xl font-bold mt-2 ${
              hautRisque ? "text-red-700" : "text-green-700"
            }`}
          >
            {score}
          </div>

          <div className="mt-3 font-semibold text-slate-900">
            {hautRisque ? "Haut risque" : "Bas risque"}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 mb-6">
          <h2 className="text-xl font-bold mb-3 text-slate-900">
            Interprétation
          </h2>

          {hautRisque ? (
            <div className="text-red-700">
              <p className="font-bold mb-2">🔴 Haut risque : score ≥ 7</p>
              <p>
                Risque thromboembolique plus élevé. Une thromboprophylaxie est à discuter
                selon le contexte clinique, le risque hémorragique et le protocole local.
              </p>
            </div>
          ) : (
            <div className="text-green-700">
              <p className="font-bold mb-2">🟢 Bas risque : score &lt; 7</p>
              <p>
                Risque thromboembolique faible. Une thromboprophylaxie systématique n’est
                généralement pas nécessaire, à adapter au contexte clinique.
              </p>
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5 mb-6 text-slate-900">
          <h2 className="text-xl font-bold mb-3">
            Classification du traumatisme
          </h2>

          <div className="space-y-4 text-sm">
            <div>
              <p className="font-bold text-green-700">
                🟢 Traumatisme faible risque — 1 point
              </p>
              <ul className="list-disc ml-5 mt-1">
                <li>Entorse de cheville</li>
                <li>Entorse du genou</li>
                <li>Lésion musculaire</li>
                <li>Contusion simple</li>
              </ul>
            </div>

            <div>
              <p className="font-bold text-orange-700">
                🟠 Traumatisme risque intermédiaire — 2 points
              </p>
              <ul className="list-disc ml-5 mt-1">
                <li>Fracture isolée du pied</li>
                <li>Fracture isolée de la cheville</li>
                <li>Fracture isolée du tibia distal</li>
              </ul>
            </div>

            <div>
              <p className="font-bold text-red-700">
                🔴 Traumatisme haut risque — 3 points
              </p>
              <ul className="list-disc ml-5 mt-1">
                <li>Rupture du tendon d'Achille</li>
                <li>Fracture tibiale proximale</li>
                <li>Fracture du plateau tibial</li>
                <li>Fracture plurifocale du membre inférieur</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <Champ
            titre="Traumatisme"
            valeur={trauma}
            setValeur={setTrauma}
            options={[
              [1, "1 - Traumatisme faible risque"],
              [2, "2 - Traumatisme risque intermédiaire"],
              [3, "3 - Traumatisme haut risque"],
            ]}
          />

          <Champ
            titre="Immobilisation"
            valeur={immobilisation}
            setValeur={setImmobilisation}
            options={[
              [0, "0 - Attelle/autre avec appui plantaire"],
              [1, "1 - Botte pied libre ou semi-rigide sans appui"],
              [2, "2 - Plâtre jambe"],
              [3, "3 - Plâtre cruro-pédieux"],
            ]}
          />

          <Champ
            titre="Âge"
            valeur={age}
            setValeur={setAge}
            options={[
              [0, "0 - < 35 ans"],
              [1, "1 - 35 à 54 ans"],
              [2, "2 - 55 à 74 ans"],
              [3, "3 - ≥ 75 ans"],
            ]}
          />

          <Champ
            titre="Sexe"
            valeur={sexe}
            setValeur={setSexe}
            options={[
              [0, "0 - Femme"],
              [1, "1 - Homme"],
            ]}
          />

          <Champ
            titre="IMC"
            valeur={bmi}
            setValeur={setBmi}
            options={[
              [0, "0 - < 25"],
              [1, "1 - 25 à 34"],
              [2, "2 - ≥ 35"],
            ]}
          />

          <Champ titre="Antécédent familial de MTEV au 1er degré" valeur={atcdFamilial} setValeur={setAtcdFamilial} options={ouiNon(2)} />
          <Champ titre="Antécédent personnel de MTEV ou thrombophilie majeure" valeur={atcdPersonnel} setValeur={setAtcdPersonnel} options={ouiNon(4)} />
          <Champ titre="Contraception orale ou traitement œstrogénique" valeur={hormones} setValeur={setHormones} options={ouiNon(4)} />
          <Champ titre="Cancer dans les 5 dernières années" valeur={cancer} setValeur={setCancer} options={ouiNon(3)} />
          <Champ titre="Grossesse ou post-partum" valeur={grossesse} setValeur={setGrossesse} options={ouiNon(3)} />
          <Champ titre="Autre immobilisation récente / alitement / vol > 6 h / paralysie MI" valeur={immobilisationRecente} setValeur={setImmobilisationRecente} options={ouiNon(2)} />
          <Champ titre="Chirurgie dans les 3 derniers mois" valeur={chirurgie} setValeur={setChirurgie} options={ouiNon(2)} />
          <Champ titre="Comorbidité : insuffisance cardiaque, PR, IRC, BPCO ou MICI" valeur={comorbidite} setValeur={setComorbidite} options={ouiNon(1)} />
          <Champ titre="Insuffisance veineuse chronique / varices" valeur={varices} setValeur={setVarices} options={ouiNon(1)} />
        </div>

        <div className="mt-8 text-sm text-gray-500">
          Aide au calcul uniquement. Ne remplace pas l’évaluation clinique ni le protocole local.
        </div>
      </div>
    </main>
  );
}

function ouiNon(points: number): [number, string][] {
  return [
    [0, "0 - Non"],
    [points, `${points} - Oui`],
  ];
}

function Champ({
  titre,
  valeur,
  setValeur,
  options,
}: {
  titre: string;
  valeur: number;
  setValeur: (valeur: number) => void;
  options: [number, string][];
}) {
  return (
    <section>
      <h2 className="text-lg font-bold mb-2 text-slate-900">{titre}</h2>
      <select
        value={valeur}
        onChange={(e) => setValeur(Number(e.target.value))}
        className="w-full border border-gray-300 rounded-xl p-4 text-lg bg-white text-slate-900"
      >
        {options.map(([value, label]) => (
          <option key={label} value={value}>
            {label}
          </option>
        ))}
      </select>
    </section>
  );
}