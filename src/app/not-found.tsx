import Link from "next/link";

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center text-white px-4"
      style={{ background: "linear-gradient(160deg, #002776 0%, #009739 60%, #0d4a28 100%)" }}
    >
      <div className="text-center max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-copa-yellow text-xl font-black text-copa-blue">
            CT
          </span>
          <span className="text-xl font-bold text-white">
            Copa<span className="text-copa-yellow">Turbo</span>
          </span>
        </div>

        {/* 404 */}
        <div
          className="text-9xl font-black leading-none mb-4"
          style={{ fontFamily: "'Bebas Neue', sans-serif", color: "#FEDD00" }}
        >
          404
        </div>

        <div className="text-6xl mb-6">⚽</div>

        <h1 className="text-2xl font-bold mb-3">
          Essa página saiu de campo!
        </h1>
        <p className="text-white/60 text-sm mb-8 leading-relaxed">
          A página que você está procurando não existe ou foi removida.
          Mas sua campanha pode estar pronta em menos de 2 minutos!
        </p>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="rounded-2xl px-6 py-3 font-bold text-copa-blue text-sm transition-all hover:opacity-90"
            style={{ background: "#FEDD00" }}
          >
            Ir para o início
          </Link>
          <Link
            href="/dashboard"
            className="rounded-2xl border border-white/20 px-6 py-3 font-bold text-white text-sm transition-all hover:bg-white/10"
          >
            Minhas campanhas
          </Link>
        </div>
      </div>

      <style>{`@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');`}</style>
    </div>
  );
}
