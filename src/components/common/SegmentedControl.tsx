interface Option {
  id: string;
  label: string;
  description?: string;
}

interface Props {
  options: Option[];
  value: string;
  onChange: (id: string) => void;
  ariaLabel?: string;
}

export function SegmentedControl({ options, value, onChange, ariaLabel }: Props) {
  if (options.length > 3) {
    return (
      <div className="flex flex-col gap-2" role="radiogroup" aria-label={ariaLabel}>
        {options.map((opt) => (
          <button
            key={opt.id}
            type="button"
            role="radio"
            aria-checked={value === opt.id}
            data-active={value === opt.id}
            onClick={() => onChange(opt.id)}
            className="pp-press flex flex-col items-start rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface-solid)] px-4 py-3 text-left data-[active=true]:border-[var(--accent)] data-[active=true]:bg-[color-mix(in_srgb,var(--accent)_14%,var(--surface-solid))]"
          >
            <span className="text-sm font-semibold text-[var(--fg)]">{opt.label}</span>
            {opt.description && (
              <span className="mt-0.5 text-xs text-[var(--fg-muted)]">{opt.description}</span>
            )}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="pp-segment" role="radiogroup" aria-label={ariaLabel}>
      {options.map((opt) => (
        <button
          key={opt.id}
          type="button"
          role="radio"
          aria-checked={value === opt.id}
          data-active={value === opt.id}
          onClick={() => onChange(opt.id)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
