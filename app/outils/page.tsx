import Link from "next/link";

export default function OutilsPage() {
  return (
    <main className="min-h-screen bg-slate-100 p-4 pb-24 text-slate-900">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl p-6 text-slate-900">
        <Link
          href="/"
          className="inline-block mb-6 text-blue-600 font-semibold"
        >
          ← Retour à l'accueil
        </Link>

        <h1 className="text-3xl font-bold mb-6 text-slate-900">
          Outils
        </h1>

        <div className="space-y-4">
          <a
            href="https://opioconvert.fr"
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-purple-600 text-white p-5 rounded-2xl font-bold text-lg"
          >
            💊 Opioconvert
          </a>

          <Link
            href="/outils/glasgow"
            className="block bg-blue-600 text-white p-5 rounded-2xl font-bold text-lg"
          >
            🧠 Score de Glasgow
          </Link>

          <Link
            href="/outils/nihss"
            className="block bg-indigo-600 text-white p-5 rounded-2xl font-bold text-lg"
          >
            🧠 NIHSS
          </Link>

          <Link
            href="/outils/sutures"
            className="block bg-emerald-600 text-white p-5 rounded-2xl font-bold text-lg"
          >
            ✂️ Guide de suture
          </Link>

          <Link
            href="/outils/fluides"
            className="block bg-cyan-600 text-white p-5 rounded-2xl font-bold text-lg"
          >
            🧪 Interprétation des fluides
          </Link>

          <Link
            href="/outils/tripcast"
            className="block bg-orange-600 text-white p-5 rounded-2xl font-bold text-lg"
          >
            🦵 Score TRiP(cast)
          </Link>
        </div>
      </div>
    </main>
  );
}