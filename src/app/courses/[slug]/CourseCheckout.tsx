// ============================================================
// COMPOSANT CLIENT — CHECKOUT D'UN COURS (MOBILE MONEY)
// ============================================================

"use client";

import { useState } from "react";
import { formatXof } from "@/lib/format";

interface Props {
  priceXof: number;
  courseSlug: string;
  courseTitle: string;
}

const PAYMENT_METHODS = [
  { id: "mtn_mobile_money", label: "MTN Mobile Money", icon: "🟡", color: "border-yellow-500" },
  { id: "orange_money", label: "Orange Money", icon: "🟠", color: "border-orange-500" },
  { id: "moov_money", label: "Moov Money", icon: "🔵", color: "border-blue-500" },
  { id: "fedapay", label: "FedaPay (carte)", icon: "💳", color: "border-purple-500" },
  { id: "kkiapay", label: "KkiaPay", icon: "⚡", color: "border-emerald-500" },
] as const;

export function CourseCheckout({ priceXof, courseSlug, courseTitle }: Props) {
  const [method, setMethod] = useState<string>("mtn_mobile_money");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<null | {
    ok: boolean;
    message: string;
    reference?: string;
  }>(null);

  async function handlePay(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseSlug,
          phoneNumber: phone,
          method,
        }),
      });
      const data = await res.json();
      if (data.ok) {
        setResult({
          ok: true,
          message: data.message,
          reference: data.payment?.reference,
        });
        setPhone("");
      } else {
        setResult({ ok: false, message: data.error ?? "Erreur de paiement" });
      }
    } catch (err) {
      setResult({
        ok: false,
        message: "Erreur réseau. Réessaie plus tard.",
      });
    } finally {
      setLoading(false);
    }
  }

  if (priceXof === 0) {
    return (
      <div className="rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 to-transparent p-6">
        <div className="text-xs font-bold uppercase tracking-wider text-emerald-400">
          Formation gratuite
        </div>
        <div className="mt-2 text-4xl font-black text-white">0 FCFA</div>
        <button className="mt-5 w-full rounded-xl bg-emerald-500 px-4 py-3.5 text-sm font-bold text-black transition hover:bg-emerald-400">
          Commencer gratuitement
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handlePay}
      className="rounded-2xl border border-neutral-800 bg-gradient-to-b from-neutral-900 to-neutral-950 p-6 shadow-xl"
    >
      <div className="flex items-baseline justify-between">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-neutral-500">
            Prix unique
          </div>
          <div className="text-3xl font-black text-white">
            {formatXof(priceXof)}
          </div>
        </div>
        <span className="rounded-full bg-orange-500/20 px-3 py-1 text-xs font-bold text-orange-400">
          -40% promo
        </span>
      </div>

      <div className="mt-5">
        <div className="mb-2 text-xs font-bold uppercase tracking-wider text-neutral-500">
          Méthode de paiement
        </div>
        <div className="space-y-2">
          {PAYMENT_METHODS.map((m) => (
            <label
              key={m.id}
              className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 px-3 py-2.5 text-sm transition ${
                method === m.id
                  ? `${m.color} bg-black/50`
                  : "border-neutral-800 hover:border-neutral-700"
              }`}
            >
              <input
                type="radio"
                name="method"
                value={m.id}
                checked={method === m.id}
                onChange={() => setMethod(m.id)}
                className="accent-orange-500"
              />
              <span className="text-lg">{m.icon}</span>
              <span className="font-semibold text-white">{m.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="mt-5">
        <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-neutral-500">
          Numéro Mobile Money
        </label>
        <input
          type="tel"
          required
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+229 01 00 00 00"
          className="w-full rounded-xl border border-neutral-800 bg-black px-4 py-3 text-white placeholder-neutral-500 outline-none transition focus:border-orange-500"
        />
        <p className="mt-1.5 text-[11px] text-neutral-500">
          Tu recevras une notification sur ton téléphone pour confirmer.
        </p>
      </div>

      <button
        type="submit"
        disabled={loading || !phone}
        className="mt-5 w-full rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 px-4 py-3.5 text-sm font-bold text-black shadow-lg shadow-orange-500/30 transition hover:from-orange-400 hover:to-amber-400 disabled:opacity-50"
      >
        {loading ? "⏳ Traitement..." : `Payer ${formatXof(priceXof)}`}
      </button>

      {result && (
        <div
          className={`mt-4 rounded-xl p-4 text-sm ${
            result.ok
              ? "bg-emerald-500/10 text-emerald-300"
              : "bg-red-500/10 text-red-300"
          }`}
        >
          <div className="font-bold">
            {result.ok ? "✓ Paiement réussi !" : "✗ Échec du paiement"}
          </div>
          <div className="mt-1 text-xs">{result.message}</div>
          {result.reference && (
            <div className="mt-2 font-mono text-[11px] text-neutral-400">
              Réf : {result.reference}
            </div>
          )}
        </div>
      )}

      <div className="mt-4 text-center text-[11px] text-neutral-500">
        🔒 Paiement sécurisé · {courseTitle}
      </div>
    </form>
  );
}
