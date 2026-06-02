"use client";

import { useState } from "react";
import Link from "next/link";

export default function NihssPage() {
  const [conscience, setConscience] = useState(0);
  const [questions, setQuestions] = useState(0);
  const [ordres, setOrdres] = useState(0);
  const [regard, setRegard] = useState(0);
  const [champ, setChamp] = useState(0);
  const [facial, setFacial] = useState(0);
  const [brasG, setBrasG] = useState(0);
  const [brasD, setBrasD] = useState(0);
  const [jambeG, setJambeG] = useState(0);
  const [jambeD, setJambeD] = useState(0);
  const [ataxie, setAtaxie] = useState(0);
  const [sensibilite, setSensibilite] = useState(0);
  const [langage, setLangage] = useState(0);
  const [dysarthrie, setDysarthrie] = useState(0);
  const [negligence, setNegligence] = useState(0);

  const score =
    conscience +
    questions +
    ordres +
    regard +
    champ +
    facial +
    brasG +
    brasD +
    jambeG +
    jambeD +
    ataxie +
    sensibilite +
    langage +
    dysarthrie +
    negligence;

  return (
    <main className="min-h-screen bg-slate-100 p-4 pb-24 text-slate-900">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl p-6 text-slate-900">
        <Link href="/outils" className="inline-block mb-6 text-blue-600 font-semibold">
          ← Retour aux outils
        </Link>

        <h1 className="text-3xl font-bold mb-2">NIHSS</h1>

        <p className="text-gray-600 mb-6">
          Score neurologique de sévérité de l’AVC.
        </p>

        <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-6 text-center mb-6">
          <div className="text-lg text-gray-600">Score NIHSS</div>
          <div className="text-5xl font-bold text-indigo-700 mt-2">
            {score}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 mb-6">
          <h2 className="font-bold mb-2">Interprétation indicative</h2>

          {score === 0 && <p className="text-green-700">Aucun déficit mesurable</p>}
          {score >= 1 && score <= 4 && <p className="text-green-700">AVC mineur</p>}
          {score >= 5 && score <= 15 && <p className="text-orange-700">AVC modéré</p>}
          {score >= 16 && score <= 20 && <p className="text-red-700">AVC modéré à sévère</p>}
          {score >= 21 && <p className="text-red-800 font-bold">AVC sévère</p>}
        </div>

        <div className="space-y-5">
          <Champ
            titre="1a. Niveau de conscience"
            valeur={conscience}
            setValeur={setConscience}
            options={[
              [0, "0 - Alerte, réagit vivement"],
              [1, "1 - Somnolent, éveillable par stimulation mineure"],
              [2, "2 - Nécessite stimulations répétées ou douloureuses"],
              [3, "3 - Coma ou absence totale de réponse"],
            ]}
          />

          <Champ
            titre="1b. Questions"
            valeur={questions}
            setValeur={setQuestions}
            options={[
              [0, "0 - Répond correctement aux deux questions"],
              [1, "1 - Répond correctement à une question"],
              [2, "2 - Ne répond correctement à aucune question"],
            ]}
          />

          <Champ
            titre="1c. Ordres"
            valeur={ordres}
            setValeur={setOrdres}
            options={[
              [0, "0 - Exécute correctement les deux ordres"],
              [1, "1 - Exécute correctement un ordre"],
              [2, "2 - N’exécute aucun ordre"],
            ]}
          />

          <Champ
            titre="2. Regard"
            valeur={regard}
            setValeur={setRegard}
            options={[
              [0, "0 - Normal"],
              [1, "1 - Paralysie partielle du regard"],
              [2, "2 - Déviation forcée ou paralysie totale du regard"],
            ]}
          />

          <Champ
            titre="3. Champ visuel"
            valeur={champ}
            setValeur={setChamp}
            options={[
              [0, "0 - Aucun déficit visuel"],
              [1, "1 - Hémianopsie partielle"],
              [2, "2 - Hémianopsie complète"],
              [3, "3 - Cécité bilatérale"],
            ]}
          />

          <Champ
            titre="4. Paralysie faciale"
            valeur={facial}
            setValeur={setFacial}
            options={[
              [0, "0 - Motricité faciale normale"],
              [1, "1 - Paralysie mineure"],
              [2, "2 - Paralysie partielle"],
              [3, "3 - Paralysie complète d’un ou deux côtés"],
            ]}
          />

          <Champ
            titre="5a. Moteur bras gauche"
            valeur={brasG}
            setValeur={setBrasG}
            options={optionsMoteurBras}
          />

          <Champ
            titre="5b. Moteur bras droit"
            valeur={brasD}
            setValeur={setBrasD}
            options={optionsMoteurBras}
          />

          <Champ
            titre="6a. Moteur jambe gauche"
            valeur={jambeG}
            setValeur={setJambeG}
            options={optionsMoteurJambe}
          />

          <Champ
            titre="6b. Moteur jambe droite"
            valeur={jambeD}
            setValeur={setJambeD}
            options={optionsMoteurJambe}
          />

          <Champ
            titre="7. Ataxie des membres"
            valeur={ataxie}
            setValeur={setAtaxie}
            options={[
              [0, "0 - Absente"],
              [1, "1 - Présente dans un membre"],
              [2, "2 - Présente dans deux membres"],
            ]}
          />

          <Champ
            titre="8. Sensibilité"
            valeur={sensibilite}
            setValeur={setSensibilite}
            options={[
              [0, "0 - Normale"],
              [1, "1 - Perte sensitive légère à modérée"],
              [2, "2 - Perte sensitive sévère ou totale"],
            ]}
          />

          <Champ
            titre="9. Langage"
            valeur={langage}
            setValeur={setLangage}
            options={[
              [0, "0 - Pas d’aphasie"],
              [1, "1 - Aphasie légère à modérée"],
              [2, "2 - Aphasie sévère"],
              [3, "3 - Mutisme ou aphasie globale"],
            ]}
          />

          <Champ
            titre="10. Dysarthrie"
            valeur={dysarthrie}
            setValeur={setDysarthrie}
            options={[
              [0, "0 - Articulation normale"],
              [1, "1 - Dysarthrie légère à modérée"],
              [2, "2 - Dysarthrie sévère ou incompréhensible"],
            ]}
          />

          <Champ
            titre="11. Extinction / négligence"
            valeur={negligence}
            setValeur={setNegligence}
            options={[
              [0, "0 - Absente"],
              [1, "1 - Négligence ou extinction partielle"],
              [2, "2 - Négligence sévère"],
            ]}
          />
        </div>

        <div className="mt-8 text-sm text-gray-500">
          Aide au calcul uniquement. Ne remplace pas l’évaluation clinique.
        </div>
      </div>
    </main>
  );
}

const optionsMoteurBras: [number, string][] = [
  [0, "0 - Pas de chute, tient 10 secondes"],
  [1, "1 - Chute partielle avant 10 secondes"],
  [2, "2 - Effort contre la pesanteur mais chute"],
  [3, "3 - Pas d’effort contre la pesanteur"],
  [4, "4 - Aucun mouvement"],
];

const optionsMoteurJambe: [number, string][] = [
  [0, "0 - Pas de chute, tient 5 secondes"],
  [1, "1 - Chute partielle avant 5 secondes"],
  [2, "2 - Effort contre la pesanteur mais chute"],
  [3, "3 - Pas d’effort contre la pesanteur"],
  [4, "4 - Aucun mouvement"],
];

function Champ({
  titre,
  valeur,
  setValeur,
  options,
}: {
  titre: string;
  valeur: number;
  setValeur: (v: number) => void;
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