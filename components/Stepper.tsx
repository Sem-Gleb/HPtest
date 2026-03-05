"use client";

type StepperProps = {
  currentStep: number;
  steps: string[];
};

export function Stepper({ currentStep, steps }: StepperProps) {
  return (
    <nav className="mb-8" aria-label="Прогресс">
      <ol className="flex items-center justify-between gap-1">
        {steps.map((label, i) => {
          const step = i + 1;
          const isActive = step === currentStep;
          const isDone = step < currentStep;
          return (
            <li
              key={step}
              className="flex flex-1 flex-col items-center last:flex-none"
            >
              <div className="flex w-full items-center">
                {i > 0 && (
                  <div
                    className="h-1 flex-1 rounded-full transition-colors duration-300"
                    style={{
                      backgroundColor: isDone ? "var(--color-primary)" : "var(--color-border)",
                    }}
                  />
                )}
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 text-sm font-semibold transition-all duration-300"
                  style={{
                    borderColor: isActive || isDone ? "var(--color-primary)" : "var(--color-border)",
                    backgroundColor: isActive || isDone ? "var(--color-primary)" : "transparent",
                    color: isActive || isDone ? "white" : "var(--color-muted)",
                    boxShadow: isActive ? "0 0 0 3px rgba(13, 148, 136, 0.25)" : "none",
                  }}
                  aria-current={isActive ? "step" : undefined}
                >
                  {isDone ? "✓" : step}
                </div>
                {i < steps.length - 1 && (
                  <div
                    className="h-1 flex-1 rounded-full transition-colors duration-300"
                    style={{
                      backgroundColor: isDone ? "var(--color-primary)" : "var(--color-border)",
                    }}
                  />
                )}
              </div>
              <span
                className="mt-2 hidden text-center text-xs font-medium sm:block sm:text-sm"
                style={{ color: isActive ? "var(--color-primary)" : "var(--color-muted)" }}
              >
                {label}
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
