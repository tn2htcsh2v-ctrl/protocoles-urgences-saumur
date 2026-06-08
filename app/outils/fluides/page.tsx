"use client";

import Link from "next/link";
import { useState } from "react";

type Onglet = "ascite" | "pleural" | "lcr" | "articulaire";

export default function FluidesPage() {
  const [onglet, setOnglet] = useState<Onglet>("ascite");

  return (
    <main className="min-h-screen bg-slate-100 p-4 pb-24 text-slate-900">
      <div className="mx-auto max-w-3xl rounded-3xl bg-white p-6 shadow-xl">
        <Link href="/outils" className="mb-6 inline-block font-semibold text-blue-600">
          ← Retour aux outils
        </Link>

        <h1 className="mb-2 text-3xl font-bold">🧪 Interprétation des fluides</h1>
        <p className="mb-6 text-sm text-slate-600">
          Aide à l’interprétation biologique. À confronter au contexte clinique.
        </p>

        <div className="mb-6 grid grid-cols-2 gap-2">
          <Bouton actif={onglet === "ascite"} onClick={() => setOnglet("ascite")}>Ascite</Bouton>
          <Bouton actif={onglet === "pleural"} onClick={() => setOnglet("pleural")}>Pleural</Bouton>
          <Bouton actif={onglet === "lcr"} onClick={() => setOnglet("lcr")}>LCR</Bouton>
          <Bouton actif={onglet === "articulaire"} onClick={() => setOnglet("articulaire")}>Articulaire</Bouton>
        </div>

        {onglet === "ascite" && <Ascite />}
        {onglet === "pleural" && <Pleural />}
        {onglet === "lcr" && <LCR />}
        {onglet === "articulaire" && <Articulaire />}
      </div>
    </main>
  );
}

function Bouton({ actif, onClick, children }: any) {
  return (
    <button
      onClick={onClick}
      className={`rounded-2xl p-3 font-bold ${
        actif ? "bg-cyan-600 text-white" : "bg-slate-100 text-slate-700"
      }`}
    >
      {children}
    </button>
  );
}

function Champ({ label, value, setValue, placeholder }: any) {
  return (
    <label className="block">
      <span className="mb-1 block font-semibold">{label}</span>
      <input
        type="number"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-300 p-3"
      />
    </label>
  );
}

function Selecteur({ label, value, setValue, options }: any) {
  return (
    <label className="block">
      <span className="mb-1 block font-semibold">{label}</span>
      <select
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full rounded-xl border border-slate-300 p-3"
      >
        {options.map((option: any) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function Resultat({ children }: any) {
  return (
    <div className="mt-6 rounded-2xl bg-slate-100 p-4 text-slate-900">
      <h2 className="mb-2 text-xl font-bold">Interprétation</h2>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function Alerte({ children }: any) {
  return (
    <div className="rounded-2xl bg-red-100 p-3 font-semibold text-red-800">
      {children}
    </div>
  );
}

function Info({ children }: any) {
  return (
    <div className="rounded-2xl bg-blue-100 p-3 text-blue-900">
      {children}
    </div>
  );
}

/* ASCITE */

function Ascite() {
  const [albumineSerum, setAlbumineSerum] = useState("");
  const [albumineAscite, setAlbumineAscite] = useState("");
  const [pnn, setPnn] = useState("");
  const [protides, setProtides] = useState("");
  const [aspect, setAspect] = useState("clair");

  const saag = Number(albumineSerum) - Number(albumineAscite);
  const hasSaag = albumineSerum !== "" && albumineAscite !== "";
  const hasPnn = pnn !== "";
  const hasProtides = protides !== "";

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-bold">Liquide d’ascite</h2>

      <Selecteur
        label="Aspect macroscopique"
        value={aspect}
        setValue={setAspect}
        options={[
          { value: "clair", label: "Clair / citrin" },
          { value: "trouble", label: "Trouble" },
          { value: "hemorragique", label: "Hémorragique" },
        ]}
      />

      <Champ label="Albumine sérique g/L" value={albumineSerum} setValue={setAlbumineSerum} />
      <Champ label="Albumine ascite g/L" value={albumineAscite} setValue={setAlbumineAscite} />
      <Champ label="PNN / mm³" value={pnn} setValue={setPnn} />
      <Champ label="Protides ascite g/L" value={protides} setValue={setProtides} />

      <Resultat>
        {aspect === "trouble" && <Alerte>Aspect trouble : infection ou liquide très cellulaire à évoquer.</Alerte>}
        {aspect === "hemorragique" && <Alerte>Aspect hémorragique : traumatique, néoplasique ou autre cause à discuter.</Alerte>}

        {hasSaag && <p>SAAG : <b>{saag.toFixed(1)} g/L</b></p>}

        {hasSaag && (
          <p>
            {saag >= 11
              ? "SAAG ≥ 11 g/L : ascite liée à une hypertension portale probable."
              : "SAAG < 11 g/L : ascite non liée à l’hypertension portale à évoquer."}
          </p>
        )}

        {hasPnn && (
          Number(pnn) >= 250 ? (
            <Alerte>PNN ≥ 250/mm³ : péritonite bactérienne spontanée à évoquer fortement.</Alerte>
          ) : (
            <p>PNN &lt; 250/mm³ : pas d’argument cytologique fort pour PBS.</p>
          )
        )}

        {hasProtides && (
          <p>
            {Number(protides) < 25
              ? "Protides ascite < 25 g/L : ascite pauvre en protides, souvent compatible avec cirrhose."
              : "Protides ascite ≥ 25 g/L : ascite riche en protides, discuter cause cardiaque, néoplasique ou inflammatoire."}
          </p>
        )}

        <Info>
          En cas de fièvre, douleur abdominale, encéphalopathie, choc ou décompensation de cirrhose :
          ne pas se rassurer uniquement sur les chiffres.
        </Info>
      </Resultat>
    </section>
  );
}

/* PLEURAL */

function Pleural() {
  const [protPleural, setProtPleural] = useState("");
  const [protSerum, setProtSerum] = useState("");
  const [ldhPleural, setLdhPleural] = useState("");
  const [ldhSerum, setLdhSerum] = useState("");
  const [ldhLimite, setLdhLimite] = useState("");
  const [ph, setPh] = useState("");
  const [glucose, setGlucose] = useState("");
  const [aspect, setAspect] = useState("clair");
  const [gram, setGram] = useState("non");

  const completLight = protPleural && protSerum && ldhPleural && ldhSerum && ldhLimite;

  const crit1 = Number(protPleural) / Number(protSerum) > 0.5;
  const crit2 = Number(ldhPleural) / Number(ldhSerum) > 0.6;
  const crit3 = Number(ldhPleural) > (2 / 3) * Number(ldhLimite);
  const exsudat = crit1 || crit2 || crit3;

  const pleuralComplique =
    aspect === "purulent" ||
    gram === "positif" ||
    (ph !== "" && Number(ph) < 7.2) ||
    (glucose !== "" && Number(glucose) < 3.3);

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-bold">Liquide pleural</h2>

      <Selecteur
        label="Aspect"
        value={aspect}
        setValue={setAspect}
        options={[
          { value: "clair", label: "Clair / citrin" },
          { value: "trouble", label: "Trouble" },
          { value: "purulent", label: "Purulent" },
          { value: "hemorragique", label: "Hémorragique" },
        ]}
      />

      <Champ label="Protéines pleurales g/L" value={protPleural} setValue={setProtPleural} />
      <Champ label="Protéines sériques g/L" value={protSerum} setValue={setProtSerum} />
      <Champ label="LDH pleural UI/L" value={ldhPleural} setValue={setLdhPleural} />
      <Champ label="LDH sérique UI/L" value={ldhSerum} setValue={setLdhSerum} />
      <Champ label="Limite supérieure normale LDH sérique UI/L" value={ldhLimite} setValue={setLdhLimite} />
      <Champ label="pH pleural" value={ph} setValue={setPh} />
      <Champ label="Glucose pleural mmol/L" value={glucose} setValue={setGlucose} />

      <Selecteur
        label="Gram / culture rapide"
        value={gram}
        setValue={setGram}
        options={[
          { value: "non", label: "Négatif / non disponible" },
          { value: "positif", label: "Positif" },
        ]}
      />

      <Resultat>
        {completLight ? (
          <>
            <p>{crit1 ? "✅" : "❌"} Protéines pleurales / sériques &gt; 0,5</p>
            <p>{crit2 ? "✅" : "❌"} LDH pleural / sérique &gt; 0,6</p>
            <p>{crit3 ? "✅" : "❌"} LDH pleural &gt; 2/3 limite normale sérique</p>
            <p className="font-bold">
              {exsudat ? "Exsudat selon les critères de Light." : "Transsudat probable."}
            </p>
          </>
        ) : (
          <p>Remplis les champs protéines + LDH pour appliquer les critères de Light.</p>
        )}

        {pleuralComplique && (
          <Alerte>
            Épanchement pleural compliqué / empyème à évoquer : avis spécialisé et drainage à discuter.
          </Alerte>
        )}

        {ph !== "" && Number(ph) < 7.2 && <p>pH &lt; 7,20 : argument de gravité dans un contexte infectieux.</p>}
        {glucose !== "" && Number(glucose) < 3.3 && <p>Glucose bas : compatible avec infection compliquée, néoplasie ou rhumatisme inflammatoire.</p>}
        {aspect === "hemorragique" && <p>Aspect hémorragique : discuter traumatisme, néoplasie, EP ou cause iatrogène.</p>}
      </Resultat>
    </section>
  );
}

/* LCR */

function LCR() {
  const [leuco, setLeuco] = useState("");
  const [pnn, setPnn] = useState("");
  const [hematies, setHematies] = useState("");
  const [proteines, setProteines] = useState("");
  const [glucoseLcr, setGlucoseLcr] = useState("");
  const [glycemie, setGlycemie] = useState("");
  const [lactates, setLactates] = useState("");
  const [gram, setGram] = useState("non");

  const ratio = glucoseLcr && glycemie ? Number(glucoseLcr) / Number(glycemie) : null;

  const correctionLeuco =
    leuco && hematies
      ? Math.max(0, Number(leuco) - Number(hematies) / 500)
      : null;

  const bacterien =
    gram === "positif" ||
    Number(leuco) > 1000 ||
    Number(pnn) > 50 ||
    Number(proteines) > 1 ||
    (ratio !== null && ratio < 0.4) ||
    Number(lactates) >= 3.5;

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-bold">Liquide céphalo-rachidien</h2>

      <Champ label="Leucocytes / mm³" value={leuco} setValue={setLeuco} />
      <Champ label="% PNN" value={pnn} setValue={setPnn} />
      <Champ label="Hématies / mm³" value={hematies} setValue={setHematies} />
      <Champ label="Protéines g/L" value={proteines} setValue={setProteines} />
      <Champ label="Glucose LCR mmol/L" value={glucoseLcr} setValue={setGlucoseLcr} />
      <Champ label="Glycémie mmol/L" value={glycemie} setValue={setGlycemie} />
      <Champ label="Lactates LCR mmol/L" value={lactates} setValue={setLactates} />

      <Selecteur
        label="Gram"
        value={gram}
        setValue={setGram}
        options={[
          { value: "non", label: "Négatif / non disponible" },
          { value: "positif", label: "Positif" },
        ]}
      />

      <Resultat>
        {ratio !== null && <p>Ratio glucose LCR / glycémie : <b>{ratio.toFixed(2)}</b></p>}

        {correctionLeuco !== null && (
          <p>
            Leucocytes corrigés approximatifs si ponction traumatique :{" "}
            <b>{correctionLeuco.toFixed(0)} / mm³</b>
          </p>
        )}

        {hematies !== "" && Number(hematies) > 500 && (
          <Info>
            Ponction possiblement traumatique : correction indicative seulement, ne doit pas rassurer à tort.
          </Info>
        )}

        {bacterien ? (
          <Alerte>
            Profil inquiétant : méningite bactérienne à couvrir selon contexte clinique.
          </Alerte>
        ) : (
          <p className="font-bold">
            Profil plutôt rassurant ou viral possible selon clinique.
          </p>
        )}

        {gram === "positif" && <Alerte>Gram positif : urgence infectieuse jusqu’à preuve du contraire.</Alerte>}
        {lactates !== "" && Number(lactates) >= 3.5 && <p>Lactates élevés : argument en faveur d’une origine bactérienne.</p>}
        {ratio !== null && ratio < 0.4 && <p>Hypoglycorachie relative : argument en faveur d’une méningite bactérienne, tuberculeuse ou fongique.</p>}
      </Resultat>
    </section>
  );
}

/* ARTICULAIRE */

function Articulaire() {
  const [leuco, setLeuco] = useState("");
  const [pnn, setPnn] = useState("");
  const [aspect, setAspect] = useState("clair");
  const [cristaux, setCristaux] = useState("non");
  const [gram, setGram] = useState("non");
  const [culture, setCulture] = useState("non");

  const inflam = Number(leuco) >= 2000;
  const septiqueFort =
    gram === "positif" ||
    culture === "positive" ||
    Number(leuco) >= 50000 ||
    Number(pnn) >= 90 ||
    aspect === "purulent";

  const septiquePossible =
    Number(leuco) >= 25000 || Number(pnn) >= 75;

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-bold">Liquide articulaire</h2>

      <Selecteur
        label="Aspect"
        value={aspect}
        setValue={setAspect}
        options={[
          { value: "clair", label: "Clair" },
          { value: "trouble", label: "Trouble" },
          { value: "purulent", label: "Purulent" },
          { value: "hemorragique", label: "Hémorragique" },
        ]}
      />

      <Champ label="Leucocytes / mm³" value={leuco} setValue={setLeuco} />
      <Champ label="% PNN" value={pnn} setValue={setPnn} />

      <Selecteur
        label="Cristaux"
        value={cristaux}
        setValue={setCristaux}
        options={[
          { value: "non", label: "Non vus" },
          { value: "urate", label: "Urates : goutte" },
          { value: "cppd", label: "Pyrophosphate : chondrocalcinose" },
        ]}
      />

      <Selecteur
        label="Gram"
        value={gram}
        setValue={setGram}
        options={[
          { value: "non", label: "Négatif / non disponible" },
          { value: "positif", label: "Positif" },
        ]}
      />

      <Selecteur
        label="Culture"
        value={culture}
        setValue={setCulture}
        options={[
          { value: "non", label: "Négative / non disponible" },
          { value: "positive", label: "Positive" },
        ]}
      />

      <Resultat>
        {leuco && pnn ? (
          <>
            <p>{inflam ? "Liquide inflammatoire." : "Liquide plutôt mécanique / non inflammatoire."}</p>

            {septiqueFort ? (
              <Alerte>Arthrite septique à évoquer fortement.</Alerte>
            ) : septiquePossible ? (
              <Alerte>Arthrite septique possible : à ne pas exclure selon contexte.</Alerte>
            ) : (
              <p>Pas d’argument cytologique majeur pour arthrite septique.</p>
            )}

            {cristaux === "urate" && <p>Cristaux d’urate : compatible avec goutte.</p>}
            {cristaux === "cppd" && <p>Cristaux de pyrophosphate : compatible avec chondrocalcinose.</p>}

            {cristaux !== "non" && (
              <Info>
                La présence de cristaux n’exclut pas une infection associée.
              </Info>
            )}

            {aspect === "hemorragique" && <p>Aspect hémorragique : discuter traumatisme, hémarthrose ou ponction traumatique.</p>}
          </>
        ) : (
          <p>Remplis les leucocytes et le % PNN.</p>
        )}
      </Resultat>
    </section>
  );
}