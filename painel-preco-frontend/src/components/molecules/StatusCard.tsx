"use client";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { ArrowLeft, Home, LucideIcon } from "lucide-react";
import clsx from "clsx";

type ColorTheme = "violet" | "red" | "orange";

interface ActionButton {
  label: string;
  icon: LucideIcon;
  onClick: () => void;
}

interface StatusCardProps {
  code: string;
  title: string;
  message: string;
  icon: LucideIcon;
  theme?: ColorTheme;
  suggestions?: string[];
  extraActions?: ActionButton[];
}

const colorConfig: Record<
  ColorTheme,
  {
    bgGradient: string;
    iconBg: string;
    iconGlow: string;
    codeBg: string;
    bulletColor: string;
    suggestionsBg: string;
    suggestionsBorder: string;
    primaryButton: string;
  }
> = {
  violet: {
    bgGradient: "from-violet-50 via-slate-50 to-violet-100",
    iconBg: "from-violet-500 to-violet-600",
    iconGlow: "bg-violet-500/20",
    codeBg: "from-violet-600 to-violet-500",
    bulletColor: "text-violet-500",
    suggestionsBg: "from-violet-50 to-slate-50",
    suggestionsBorder: "border-violet-100",
    primaryButton:
      "from-violet-600 to-violet-500 hover:from-violet-700 hover:to-violet-600",
  },
  red: {
    bgGradient: "from-slate-50 via-slate-100 to-slate-200",
    iconBg: "from-red-500 to-red-600",
    iconGlow: "bg-red-500/20",
    codeBg: "from-red-600 to-red-500",
    bulletColor: "text-red-500",
    suggestionsBg: "bg-slate-50",
    suggestionsBorder: "border-slate-200",
    primaryButton:
      "from-red-600 to-red-500 hover:from-red-700 hover:to-red-600",
  },
  orange: {
    bgGradient: "from-orange-50 via-slate-50 to-red-50",
    iconBg: "from-orange-500 to-red-500",
    iconGlow: "bg-orange-500/20",
    codeBg: "from-orange-600 to-red-500",
    bulletColor: "text-orange-500",
    suggestionsBg: "from-orange-50 to-red-50",
    suggestionsBorder: "border-orange-100",
    primaryButton:
      "from-orange-600 to-red-500 hover:from-orange-700 hover:to-red-600",
  },
};

export default function StatusCard({
  code,
  title,
  message,
  icon: Icon,
  theme = "violet",
  suggestions = [],
  extraActions = [],
}: StatusCardProps) {
  const router = useRouter();
  const colors = colorConfig[theme];

  return (
    <div
      className={`min-h-screen bg-[var(--status-card)] flex items-center justify-center p-4`}
    >
      <div className="max-w-2xl w-full">
        <Card className="bg-[var(--sidebar-ring)] rounded-2xl shadow-xl p-8 md:p-12 border border-foreground-200">
          <div className="flex flex-col items-center text-center space-y-6">
            <div className="relative">
              <div
                className={clsx(
                  "absolute inset-0 rounded-full blur-2xl animate-pulse",
                  colors.iconGlow
                )}
              />
              <div
                className={`relative bg-gradient-to-br ${colors.iconBg} rounded-full p-6 shadow-lg`}
              >
                <Icon className="w-16 h-16 text-white" strokeWidth={2} />
              </div>
            </div>

            <div className="space-y-3">
              <h1 className="text-3xl md:text-4xl font-bold">{title}</h1>
              <p className="text-lg max-w-md mx-auto leading-relaxed">
                {message}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4 w-full sm:w-auto">
              <button
                onClick={() => router.back()}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl transition-all duration-200 shadow-sm hover:shadow border border-slate-200"
              >
                <ArrowLeft className="w-5 h-5" />
                Voltar
              </button>

              {extraActions.map((action, idx) => (
                <button
                  key={idx}
                  onClick={action.onClick}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl transition-all duration-200 shadow-sm hover:shadow border border-slate-200"
                >
                  <action.icon className="w-5 h-5" />
                  {action.label}
                </button>
              ))}

              <button
                onClick={() => router.push("/")}
                className={`flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r ${colors.primaryButton} text-white font-medium rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02]`}
              >
                <Home className="w-5 h-5" />
                Ir para Início
              </button>
            </div>
          </div>
        </Card>

        <div className="text-center mt-6">
          <p className="text-sm text-slate-500">
            Código de Erro:{" "}
            <span className="font-mono font-semibold">{`HTTP ${code}`}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
