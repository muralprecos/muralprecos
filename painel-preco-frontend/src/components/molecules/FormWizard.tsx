"use client";

import { useState } from "react";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export interface IWizardStep {
  titulo: string;
  conteudo: React.ReactNode;
}

interface IProps {
  steps: IWizardStep[];
  /** Botão(ões) exibido(s) no lugar de "Próximo" quando o step atual é o último — normalmente o botão de submit do formulário. */
  children: React.ReactNode;
}

/**
 * Wizard client-side simples: mantém o step atual em estado e só troca qual
 * `conteudo` é exibido — o `<form>` ao redor (e o submit) continuam sendo
 * responsabilidade de quem usa o componente, disparados só no último step.
 */
export default function FormWizard({ steps, children }: IProps) {
  const [stepAtual, setStepAtual] = useState(0);
  const ultimoStep = stepAtual === steps.length - 1;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-2">
        {steps.map((step, index) => (
          <button
            key={step.titulo}
            type="button"
            onClick={() => setStepAtual(index)}
            className={cn(
              "flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap",
              index === stepAtual
                ? "bg-primary text-primary-foreground"
                : index < stepAtual
                  ? "bg-primary/15 text-primary"
                  : "bg-muted text-muted-foreground"
            )}
          >
            <span
              className={cn(
                "flex h-5 w-5 items-center justify-center rounded-full text-[10px]",
                index === stepAtual
                  ? "bg-primary-foreground/20"
                  : index < stepAtual
                    ? "bg-primary/20"
                    : "bg-border"
              )}
            >
              {index < stepAtual ? <Check className="h-3 w-3" /> : index + 1}
            </span>
            {step.titulo}
          </button>
        ))}
      </div>

      <div>{steps[stepAtual]?.conteudo}</div>

      <div className="flex justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={() => setStepAtual((s) => Math.max(0, s - 1))}
          disabled={stepAtual === 0}
        >
          <ChevronLeft className="mr-1 h-4 w-4" /> Voltar
        </Button>

        {ultimoStep ? (
          children
        ) : (
          <Button
            type="button"
            onClick={() => setStepAtual((s) => Math.min(steps.length - 1, s + 1))}
          >
            Próximo <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
