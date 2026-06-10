"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import AppShell from "@/components/AppShell";
import PricingCards from "@/components/PricingCards";
import CampaignCreative from "@/components/CampaignCreative";
import { FAQ_ITEMS, HOW_IT_WORKS_STEPS, MOCK_EXAMPLE_CAMPAIGNS, createMockCampaign } from "@/data/mock";

// ── Contador Copa 2026 ────────────────────────────────────────────────────────
const COPA_START = new Date("2026-06-11T13:00:00-03:00");

function useCountdown(target: Date) {
  const [diff, setDiff] = useState(target.getTime() - Date.now());
  useEffect(() => {
    const t = setInterval(() => setDiff(target.getTime() - Date.now()), 1000);
    return () => clearInterval(t);
  }, [target]);
  if (diff <= 0) return null;
  return {
    d: Math.floor(diff / 86400000),
    h: Math.floor((diff % 86400000) / 3600000),
    m: Math.floor((diff % 3600000) / 60000),
    s: Math.floor((diff % 60000) / 1000),
  };
}

// ── Hook de animação ao entrar na tela ───────────────────────────────────────
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

// ── Componente de seção animada ───────────────────────────────────────────────
function AnimatedSection({ children, className = "", delay = 0 }: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const { ref, inView } = useInView();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(32px)",
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

// ── Depoimentos ───────────────────────────────────────────────────────────────
const TESTIMONIALS = [
  {
    name: "Ricardo Oliveira",
    business: "Bar do Ricardão · São Paulo",
    avatar: "RO",
    text: "Em 3 minutos minha campanha estava pronta. Lotei o bar no jogo do Brasil!",
    stars: 5,
  },
  {
    name: "Fernanda Costa",
    business: "Adega Boa Vista · Campinas",
    avatar: "FC",
    text: "Nunca tinha feito marketing antes. Agora faço campanha pra todo jogo. Simples demais!",
    stars: 5,
  },
  {
    name: "Marcos Teixeira",
    business: "Hamburgueria do Marco · BH",
    avatar: "MT",
    text: "O link da promoção viralizou no grupo do bairro. Melhor investimento que fiz.",
    stars: 5,
  },
];

export default function HomePage() {
  const demoCampaign = createMockCampaign();
  const countdown = useCountdown(COPA_START);

  return (
    <AppShell>

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-copa-blue text-white">
        <div className="absolute inset-0 bg-hero-pattern" />
        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24 lg:py-32">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div
              style={{
                animation: "heroFadeIn 0.8s ease both",
              }}
            >
              <span className="inline-flex items-center gap-2 rounded-full bg-copa-green/20 px-4 py-1.5 text-sm font-medium text-copa-yellow">
                ⚽ Para bares, adegas e comércios locais
              </span>
              <h1 className="mt-6 text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                Crie campanhas para os jogos da Copa em{" "}
                <span className="text-copa-yellow">menos de 2 minutos</span>
              </h1>
              <p className="mt-6 text-lg text-white/80 sm:text-xl">
                Gere post, story, banner, link e QR Code para divulgar promoções do seu bar,
                adega ou lanchonete nos dias de jogo.
              </p>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Link href="/criar" className="btn-primary text-center text-base">
                  Criar minha campanha
                </Link>
                <Link href="/#como-funciona" className="btn-secondary text-center">
                  Ver como funciona
                </Link>
              </div>
              <p className="mt-6 text-sm text-white/50">
                Sem precisar de designer. Foco em trazer mais clientes no dia do jogo.
              </p>
            </div>
            <div
              className="hidden lg:block"
              style={{ animation: "heroFadeIn 0.8s 0.2s ease both" }}
            >
              <div className="rotate-2 transform rounded-2xl shadow-2xl transition-transform hover:rotate-0">
                <CampaignCreative data={demoCampaign} variant="post" />
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-slate-50 to-transparent" />
      </section>

      {/* ── Contador Copa 2026 ────────────────────────────────────────────── */}
      {countdown && (
        <section className="bg-copa-blue py-10 text-white">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 text-center">
            <AnimatedSection>
              <p className="text-copa-yellow font-bold text-sm uppercase tracking-widest mb-4">
                ⚽ Copa do Mundo 2026 começa em
              </p>
              <div className="grid grid-cols-4 gap-3 sm:gap-6">
                {[
                  { val: countdown.d, label: "Dias" },
                  { val: countdown.h, label: "Horas" },
                  { val: countdown.m, label: "Min" },
                  { val: countdown.s, label: "Seg" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-2xl py-4 text-center"
                    style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)" }}
                  >
                    <div className="text-4xl font-black text-copa-yellow leading-none">
                      {String(item.val).padStart(2, "0")}
                    </div>
                    <div className="text-xs text-white/50 mt-1 uppercase tracking-wider">{item.label}</div>
                  </div>
                ))}
              </div>
              <p className="mt-6 text-white/60 text-sm">
                Sua promoção precisa estar pronta antes do apito inicial.{" "}
                <Link href="/criar" className="text-copa-yellow font-bold hover:underline">
                  Crie agora →
                </Link>
              </p>
            </AnimatedSection>
          </div>
        </section>
      )}

      {/* ── Como funciona ─────────────────────────────────────────────────── */}
      <section id="como-funciona" className="py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <AnimatedSection className="text-center">
            <h2 className="section-title">Como funciona</h2>
            <p className="section-subtitle mx-auto">
              Três passos para ter sua promoção pronta antes do apito inicial.
            </p>
          </AnimatedSection>
          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {HOW_IT_WORKS_STEPS.map((item, i) => (
              <AnimatedSection key={item.step} delay={i * 100}>
                <div className="card text-center h-full">
                  <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-copa-yellow text-xl font-black text-copa-blue">
                    {item.step}
                  </span>
                  <h3 className="mt-4 text-lg font-bold text-copa-blue">{item.title}</h3>
                  <p className="mt-2 text-sm text-slate-600">{item.description}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── Quanto você pode ganhar ───────────────────────────────────────── */}
      <section className="bg-copa-blue text-white py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <AnimatedSection className="text-center mb-14">
            <h2 className="text-3xl font-black sm:text-4xl">
              Quanto você pode ganhar com a Copa?
            </h2>
            <p className="mt-4 text-white/70 text-lg">
              Bares que divulgam promoções no dia do jogo faturam muito mais.
            </p>
          </AnimatedSection>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { icon: "👥", num: "+40%", label: "mais clientes", desc: "Bares com promoção divulgada atraem em média 40% mais pessoas nos dias de jogo." },
              { icon: "💰", num: "R$ 800", label: "faturamento extra por jogo", desc: "Uma campanha bem feita pode gerar de R$ 500 a R$ 1.500 em vendas adicionais." },
              { icon: "⚡", num: "2 min", label: "para criar sua campanha", desc: "Preencha os dados, escolha o plano e compartilhe. Sem designer, sem complicação." },
            ].map((item, i) => (
              <AnimatedSection key={item.label} delay={i * 120}>
                <div
                  className="rounded-2xl p-6 text-center h-full"
                  style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)" }}
                >
                  <div className="text-4xl mb-3">{item.icon}</div>
                  <div className="text-4xl font-black text-copa-yellow mb-1">{item.num}</div>
                  <div className="text-sm font-bold text-white/80 mb-3">{item.label}</div>
                  <p className="text-xs text-white/50 leading-relaxed">{item.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
          <AnimatedSection className="text-center mt-10" delay={300}>
            <Link href="/criar" className="btn-primary text-base">
              Quero faturar mais na Copa →
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* ── Exemplos ──────────────────────────────────────────────────────── */}
      <section id="exemplos" className="bg-white py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <AnimatedSection className="text-center">
            <h2 className="section-title">Exemplos de campanhas</h2>
            <p className="section-subtitle mx-auto">
              Veja como fica a promoção do seu negócio nos dias de jogo.
            </p>
          </AnimatedSection>
          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {MOCK_EXAMPLE_CAMPAIGNS.map((example, i) => {
              const mockData = {
                ...createMockCampaign(),
                businessName: example.businessName,
                businessType: example.businessType,
                promotionName: example.promotionName,
                mainTeam: example.mainTeam,
                opponent: example.opponent,
                city: example.city,
                preferredColors: example.colors,
                promotionDescription: example.promotionName,
              };
              return (
                <AnimatedSection key={example.businessName} delay={i * 100}>
                  <div className="card overflow-hidden p-0 h-full">
                    <CampaignCreative data={mockData} variant="post" />
                    <div className="p-4">
                      <h3 className="font-bold text-copa-blue">{example.businessName}</h3>
                      <p className="text-sm text-slate-600">{example.promotionName}</p>
                      <p className="mt-1 text-xs text-copa-green">
                        {example.mainTeam} x {example.opponent} · {example.city}
                      </p>
                    </div>
                  </div>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Depoimentos ───────────────────────────────────────────────────── */}
      <section className="py-20 bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <AnimatedSection className="text-center mb-14">
            <h2 className="section-title">O que dizem os comerciantes</h2>
            <p className="section-subtitle mx-auto">
              Mais de 500 bares e adegas já usaram o Copa Turbo.
            </p>
          </AnimatedSection>
          <div className="grid gap-6 md:grid-cols-3">
            {TESTIMONIALS.map((t, i) => (
              <AnimatedSection key={t.name} delay={i * 100}>
                <div className="card h-full">
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className="h-12 w-12 rounded-full flex items-center justify-center text-sm font-black flex-shrink-0"
                      style={{ background: "#002776", color: "#FEDD00" }}
                    >
                      {t.avatar}
                    </div>
                    <div>
                      <div className="font-bold text-copa-blue text-sm">{t.name}</div>
                      <div className="text-xs text-slate-500">{t.business}</div>
                    </div>
                  </div>
                  <div className="text-copa-yellow text-sm mb-2">{"★".repeat(t.stars)}</div>
                  <p className="text-sm text-slate-600 leading-relaxed">"{t.text}"</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── Planos ────────────────────────────────────────────────────────── */}
      <section id="planos" className="py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <AnimatedSection className="text-center">
            <h2 className="section-title">Escolha seu plano</h2>
            <p className="section-subtitle mx-auto">
              Pague só quando for divulgar. Planos pensados para o dia a dia do comerciante.
            </p>
          </AnimatedSection>
          <AnimatedSection className="mt-14" delay={100}>
            <PricingCards />
          </AnimatedSection>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────────────── */}
      <section id="faq" className="bg-white py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <AnimatedSection className="text-center">
            <h2 className="section-title">Perguntas frequentes</h2>
          </AnimatedSection>
          <div className="mt-10 space-y-4">
            {FAQ_ITEMS.map((item, i) => (
              <AnimatedSection key={item.question} delay={i * 60}>
                <details className="group card cursor-pointer">
                  <summary className="flex list-none items-center justify-between font-semibold text-copa-blue [&::-webkit-details-marker]:hidden">
                    {item.question}
                    <span className="ml-4 text-copa-green transition-transform group-open:rotate-45">+</span>
                  </summary>
                  <p className="mt-3 text-sm text-slate-600">{item.answer}</p>
                </details>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA final ─────────────────────────────────────────────────────── */}
      <section className="bg-copa-gradient py-20 text-white">
        <AnimatedSection className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h2 className="text-3xl font-bold sm:text-4xl">
            Próximo jogo chegando? Sua promoção pode estar pronta hoje.
          </h2>
          <p className="mt-4 text-lg text-white/80">
            Crie campanhas que trazem clientes — não só imagens bonitas.
          </p>
          <Link href="/criar" className="btn-primary mt-8 inline-block text-base">
            Criar minha campanha agora
          </Link>
        </AnimatedSection>
      </section>

      <style>{`
        @keyframes heroFadeIn {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

    </AppShell>
  );
}
