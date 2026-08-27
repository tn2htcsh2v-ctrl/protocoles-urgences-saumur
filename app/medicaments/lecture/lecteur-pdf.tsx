"use client";

import { useEffect, useRef, useState } from "react";
import type { PDFDocumentProxy, RenderTask } from "pdfjs-dist";

const PDF_URL = "/medicaments/livret-medicaments-urgence.pdf";
const WORKER_URL = "/pdf.worker.min.mjs";

type LecteurPdfProps = {
  pageInitiale: number;
  onPageChange?: (page: number, nombrePages: number) => void;
};

export default function LecteurPdf({ pageInitiale, onPageChange }: LecteurPdfProps) {
  const conteneurRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const renduRef = useRef<RenderTask | null>(null);
  const [documentPdf, setDocumentPdf] = useState<PDFDocumentProxy | null>(null);
  const [pageCourante, setPageCourante] = useState(pageInitiale);
  const [largeur, setLargeur] = useState(0);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState("");

  useEffect(() => {
    let actif = true;
    let documentCharge: PDFDocumentProxy | null = null;

    async function chargerDocument() {
      try {
        const pdfjs = await import("pdfjs-dist");
        pdfjs.GlobalWorkerOptions.workerSrc = WORKER_URL;
        documentCharge = await pdfjs.getDocument(PDF_URL).promise;

        if (!actif) {
          await documentCharge.destroy();
          return;
        }

        if (pageInitiale < 1 || pageInitiale > documentCharge.numPages) {
          throw new Error(`La page ${pageInitiale} n'existe pas dans ce document.`);
        }

        setDocumentPdf(documentCharge);
        onPageChange?.(pageInitiale, documentCharge.numPages);
      } catch (cause) {
        if (actif) {
          setErreur(cause instanceof Error ? cause.message : "Impossible de charger le PDF.");
          setChargement(false);
        }
      }
    }

    void chargerDocument();

    return () => {
      actif = false;
      renduRef.current?.cancel();
      if (documentCharge) void documentCharge.destroy();
    };
  }, [onPageChange, pageInitiale]);

  useEffect(() => {
    const conteneur = conteneurRef.current;
    if (!conteneur) return;

    const mesurer = () => setLargeur(Math.max(0, Math.floor(conteneur.clientWidth)));
    mesurer();

    const observateur = new ResizeObserver(mesurer);
    observateur.observe(conteneur);
    return () => observateur.disconnect();
  }, []);

  useEffect(() => {
    if (!documentPdf || !largeur || !canvasRef.current) return;

    let actif = true;
    const canvas = canvasRef.current;
    const pdf = documentPdf;
    setChargement(true);
    setErreur("");

    async function afficherPage() {
      try {
        renduRef.current?.cancel();
        const pagePdf = await pdf.getPage(pageCourante);
        if (!actif) return;

        const viewportOriginal = pagePdf.getViewport({ scale: 1 });
        const largeurDisponible = Math.max(280, largeur - 16);
        const echelleCss = largeurDisponible / viewportOriginal.width;
        const densite = Math.min(window.devicePixelRatio || 1, 2.5);
        const viewport = pagePdf.getViewport({ scale: echelleCss * densite });
        const contexte = canvas.getContext("2d", { alpha: false });
        if (!contexte) throw new Error("Le rendu canvas n'est pas disponible.");

        canvas.width = Math.ceil(viewport.width);
        canvas.height = Math.ceil(viewport.height);
        canvas.style.width = `${Math.floor(viewport.width / densite)}px`;
        canvas.style.height = `${Math.floor(viewport.height / densite)}px`;

        const rendu = pagePdf.render({ canvas, canvasContext: contexte, viewport });
        renduRef.current = rendu;
        await rendu.promise;

        if (actif) {
          setChargement(false);
          onPageChange?.(pageCourante, pdf.numPages);
        }
      } catch (cause) {
        if (!actif || (cause instanceof Error && cause.name === "RenderingCancelledException")) return;
        setErreur(cause instanceof Error ? cause.message : "Impossible d'afficher cette page.");
        setChargement(false);
      }
    }

    void afficherPage();

    return () => {
      actif = false;
      renduRef.current?.cancel();
    };
  }, [documentPdf, largeur, onPageChange, pageCourante]);

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-slate-200">
      <nav className="shrink-0 border-b border-slate-300 bg-slate-100 px-3 py-2" aria-label="Navigation dans le PDF">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-2">
          <button
            type="button"
            disabled={!documentPdf || pageCourante <= 1}
            onClick={() => setPageCourante((page) => Math.max(1, page - 1))}
            className="min-h-11 rounded-xl border border-slate-300 bg-white px-3 text-sm font-bold text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            ← <span className="hidden min-[390px]:inline">Page </span>précédente
          </button>

          <span className="shrink-0 text-xs font-bold text-slate-600" aria-live="polite">
            {pageCourante} / {documentPdf?.numPages ?? "…"}
          </span>

          <button
            type="button"
            disabled={!documentPdf || pageCourante >= documentPdf.numPages}
            onClick={() =>
              setPageCourante((page) => Math.min(documentPdf?.numPages ?? page, page + 1))
            }
            className="min-h-11 rounded-xl border border-slate-300 bg-white px-3 text-sm font-bold text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <span className="hidden min-[390px]:inline">Page </span>suivante →
          </button>
        </div>
      </nav>

      <div ref={conteneurRef} className="relative min-h-0 flex-1 overflow-auto overscroll-contain p-2 sm:p-4">
        {chargement && (
          <div className="absolute inset-x-0 top-6 z-10 mx-auto w-fit rounded-full bg-slate-900/80 px-4 py-2 text-sm font-semibold text-white">
            Chargement de la page…
          </div>
        )}

        {erreur && (
          <div role="alert" className="mx-auto mt-8 max-w-lg rounded-2xl border border-red-200 bg-red-50 p-5 text-center text-sm font-semibold text-red-800">
            {erreur}
          </div>
        )}

        <canvas
          ref={canvasRef}
          aria-label={`Page ${pageCourante} du livret médicamenteux`}
          className={`mx-auto block bg-white shadow-lg ${erreur ? "hidden" : ""}`}
        />
      </div>
    </div>
  );
}
