"use client";

import { useEffect, useState } from "react";
import type { BusinessType, CampaignFormData } from "@/lib/types";
import { BUSINESS_TYPE_LABELS, COLOR_PRESETS } from "@/lib/types";
import { getDraft, saveDraft } from "@/lib/storage";

const BUSINESS_TYPES = Object.entries(BUSINESS_TYPE_LABELS) as [BusinessType, string][];

const EMPTY_FORM: CampaignFormData = {
  businessName: "",
  businessType: "bar",
  promotionName: "",
  promotionDescription: "",
  mainTeam: "",
  opponent: "",
  gameDateTime: "",
  whatsapp: "",
  city: "",
  address: "",
  preferredColors: [...COLOR_PRESETS[0].colors],
};

interface CampaignFormProps {
  onSubmit: (data: CampaignFormData) => void;
  onFormChange?: (data: CampaignFormData) => void;
  initialData?: Partial<CampaignFormData>;
}

export default function CampaignForm({ onSubmit, onFormChange, initialData }: CampaignFormProps) {
  const [form, setForm] = useState<CampaignFormData>({ ...EMPTY_FORM, ...initialData });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const draft = getDraft();
    if (draft && !initialData) {
      setForm((prev) => ({
        ...prev,
        ...draft,
        preferredColors: draft.preferredColors ?? prev.preferredColors,
      }));
    }
  }, [initialData]);

  // Notifica o pai sempre que o form muda
  useEffect(() => {
    onFormChange?.(form);
  }, [form]); // eslint-disable-line

  const update = <K extends keyof CampaignFormData>(key: K, value: CampaignFormData[K]) => {
    const next = { ...form, [key]: value };
    setForm(next);
    saveDraft(next);
  };

  const handleLogo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => update("logo", reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleCoverImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => update("coverImage", reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleGallery = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    const current = form.galleryImages ?? [];
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        update("galleryImages", [...current, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeGalleryImage = (index: number) => {
    const updated = (form.galleryImages ?? []).filter((_, i) => i !== index);
    update("galleryImages", updated);
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!form.businessName.trim()) newErrors.businessName = "Informe o nome do negócio";
    if (!form.promotionName.trim()) newErrors.promotionName = "Informe o nome da promoção";
    if (!form.promotionDescription.trim()) newErrors.promotionDescription = "Descreva a promoção";
    if (!form.mainTeam.trim()) newErrors.mainTeam = "Informe o time principal";
    if (!form.opponent.trim()) newErrors.opponent = "Informe o adversário";
    if (!form.gameDateTime) newErrors.gameDateTime = "Informe data e horário do jogo";
    if (!form.whatsapp.trim()) newErrors.whatsapp = "Informe o WhatsApp";
    if (!form.city.trim()) newErrors.city = "Informe a cidade";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) onSubmit(form);
  };

  // Progresso do formulário
  const fields = [
    form.businessName, form.city, form.promotionName,
    form.promotionDescription, form.mainTeam, form.opponent,
    form.gameDateTime, form.whatsapp,
  ];
  const filled = fields.filter(Boolean).length;
  const progress = Math.round((filled / fields.length) * 100);

  return (
    <form onSubmit={handleSubmit} className="space-y-8">

      {/* Barra de progresso */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs text-slate-500 font-medium">Progresso do formulário</span>
          <span className="text-xs font-bold text-copa-blue">{progress}%</span>
        </div>
        <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${progress}%`,
              background: progress === 100
                ? '#009739'
                : 'linear-gradient(90deg, #002776, #009739)',
            }}
          />
        </div>
        {progress === 100 && (
          <p className="text-xs text-copa-green font-semibold mt-1">✓ Formulário completo! Clique em gerar prévia.</p>
        )}
      </div>

      {/* ── Seu negócio ─────────────────────────────────── */}
      <section className="card">
        <h2 className="text-lg font-bold text-copa-blue">Seu negócio</h2>
        <p className="mt-1 text-sm text-slate-500">
          Dados do estabelecimento que aparecerão na campanha.
        </p>
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="label-field" htmlFor="businessName">Nome do negócio *</label>
            <input
              id="businessName"
              className="input-field"
              value={form.businessName}
              onChange={(e) => update("businessName", e.target.value)}
              placeholder="Ex: Bar do Zé"
            />
            {errors.businessName && <p className="mt-1 text-xs text-red-500">{errors.businessName}</p>}
          </div>

          <div>
            <label className="label-field" htmlFor="businessType">Tipo de negócio *</label>
            <select
              id="businessType"
              className="input-field"
              value={form.businessType}
              onChange={(e) => update("businessType", e.target.value as BusinessType)}
            >
              {BUSINESS_TYPES.map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="label-field" htmlFor="city">Cidade *</label>
            <input
              id="city"
              className="input-field"
              value={form.city}
              onChange={(e) => update("city", e.target.value)}
              placeholder="Ex: São Paulo"
            />
            {errors.city && <p className="mt-1 text-xs text-red-500">{errors.city}</p>}
          </div>

          <div className="sm:col-span-2">
            <label className="label-field" htmlFor="address">Endereço completo (opcional)</label>
            <input
              id="address"
              className="input-field"
              value={form.address ?? ""}
              onChange={(e) => update("address", e.target.value)}
              placeholder="Ex: Rua das Flores, 123 — Centro"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="label-field" htmlFor="logo">Logo do negócio (opcional)</label>
            <input
              id="logo"
              type="file"
              accept="image/*"
              className="input-field file:mr-4 file:rounded-lg file:border-0 file:bg-copa-blue file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
              onChange={handleLogo}
            />
            {form.logo && (
              <img src={form.logo} alt="Logo" className="mt-2 h-16 w-16 rounded-xl object-cover" />
            )}
          </div>

          <div className="sm:col-span-2">
            <label className="label-field" htmlFor="coverImage">
              Foto de capa do estabelecimento (opcional)
            </label>
            <p className="mb-2 text-xs text-slate-400">
              Aparece no topo da página. Recomendado: foto do salão, fachada ou telão.
            </p>
            <input
              id="coverImage"
              type="file"
              accept="image/*"
              className="input-field file:mr-4 file:rounded-lg file:border-0 file:bg-copa-blue file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
              onChange={handleCoverImage}
            />
            {form.coverImage && (
              <img src={form.coverImage} alt="Capa" className="mt-2 h-32 w-full rounded-xl object-cover" />
            )}
          </div>

          <div className="sm:col-span-2">
            <label className="label-field" htmlFor="gallery">Fotos do estabelecimento (opcional)</label>
            <p className="mb-2 text-xs text-slate-400">
              Adicione fotos do ambiente, pratos, drinks, etc. Até 6 fotos.
            </p>
            {(!form.galleryImages || form.galleryImages.length < 6) && (
              <input
                id="gallery"
                type="file"
                accept="image/*"
                multiple
                className="input-field file:mr-4 file:rounded-lg file:border-0 file:bg-copa-blue file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
                onChange={handleGallery}
              />
            )}
            {form.galleryImages && form.galleryImages.length > 0 && (
              <div className="mt-3 grid grid-cols-3 gap-2">
                {form.galleryImages.map((src, i) => (
                  <div key={i} className="relative">
                    <img src={src} alt={`Foto ${i + 1}`} className="h-24 w-full rounded-xl object-cover" />
                    <button
                      type="button"
                      onClick={() => removeGalleryImage(i)}
                      className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white"
                    >×</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Sua promoção ────────────────────────────────── */}
      <section className="card">
        <h2 className="text-lg font-bold text-copa-blue">Sua promoção</h2>
        <p className="mt-1 text-sm text-slate-500">
          O que você vai oferecer para atrair clientes no dia do jogo.
        </p>
        <div className="mt-6 grid gap-5">
          <div>
            <label className="label-field" htmlFor="promotionName">Nome da promoção *</label>
            <input
              id="promotionName"
              className="input-field"
              value={form.promotionName}
              onChange={(e) => update("promotionName", e.target.value)}
              placeholder="Ex: Chopp em dobro no intervalo"
            />
            {errors.promotionName && <p className="mt-1 text-xs text-red-500">{errors.promotionName}</p>}
          </div>
          <div>
            <label className="label-field" htmlFor="promotionDescription">Descrição da promoção *</label>
            <textarea
              id="promotionDescription"
              className="input-field min-h-[100px] resize-y"
              value={form.promotionDescription}
              onChange={(e) => update("promotionDescription", e.target.value)}
              placeholder="Ex: Durante o intervalo, chopp 300ml em dobro. Válido no local."
            />
            {errors.promotionDescription && (
              <p className="mt-1 text-xs text-red-500">{errors.promotionDescription}</p>
            )}
          </div>
        </div>
      </section>

      {/* ── O jogo ──────────────────────────────────────── */}
      <section className="card">
        <h2 className="text-lg font-bold text-copa-blue">O jogo</h2>
        <p className="mt-1 text-sm text-slate-500">
          Times e horário para montar a campanha no clima da Copa.
        </p>
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <div>
            <label className="label-field" htmlFor="mainTeam">Time / seleção principal *</label>
            <input
              id="mainTeam"
              className="input-field"
              value={form.mainTeam}
              onChange={(e) => update("mainTeam", e.target.value)}
              placeholder="Ex: Brasil"
            />
            {errors.mainTeam && <p className="mt-1 text-xs text-red-500">{errors.mainTeam}</p>}
          </div>
          <div>
            <label className="label-field" htmlFor="opponent">Adversário *</label>
            <input
              id="opponent"
              className="input-field"
              value={form.opponent}
              onChange={(e) => update("opponent", e.target.value)}
              placeholder="Ex: Argentina"
            />
            {errors.opponent && <p className="mt-1 text-xs text-red-500">{errors.opponent}</p>}
          </div>
          <div className="sm:col-span-2">
            <label className="label-field" htmlFor="gameDateTime">Data e horário do jogo *</label>
            <input
              id="gameDateTime"
              type="datetime-local"
              className="input-field"
              value={form.gameDateTime}
              onChange={(e) => update("gameDateTime", e.target.value)}
            />
            {errors.gameDateTime && <p className="mt-1 text-xs text-red-500">{errors.gameDateTime}</p>}
          </div>
        </div>
      </section>

      {/* ── Contato e visual ────────────────────────────── */}
      <section className="card">
        <h2 className="text-lg font-bold text-copa-blue">Contato e visual</h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <div>
            <label className="label-field" htmlFor="whatsapp">WhatsApp do comércio *</label>
            <input
              id="whatsapp"
              className="input-field"
              value={form.whatsapp}
              onChange={(e) => update("whatsapp", e.target.value)}
              placeholder="Ex: 11999998888"
            />
            {errors.whatsapp && <p className="mt-1 text-xs text-red-500">{errors.whatsapp}</p>}
          </div>
          <div className="sm:col-span-2">
            <span className="label-field">Cores preferidas da campanha</span>
            <div className="mt-2 grid gap-3 sm:grid-cols-2">
              {COLOR_PRESETS.map((preset) => {
                const isSelected =
                  JSON.stringify(form.preferredColors) === JSON.stringify(preset.colors);
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => update("preferredColors", [...preset.colors])}
                    className={`flex items-center gap-3 rounded-xl border-2 p-3 text-left transition-all ${
                      isSelected
                        ? "border-copa-green bg-copa-green/5"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex gap-1">
                      {preset.colors.map((color) => (
                        <span
                          key={color}
                          className="h-8 w-8 rounded-full border border-white shadow-sm"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-medium text-slate-700">{preset.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <button type="submit" className="btn-primary w-full py-4 text-base sm:w-auto">
        Gerar prévia da campanha →
      </button>
    </form>
  );
}
