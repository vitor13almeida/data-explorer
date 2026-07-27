import { HTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";
import { XCircle, CheckCircle } from "react-feather";
import Button from "../Button/Button";
import { toBoolean } from "@/services/utils/data";

const ICON_SIZE = 32;

export type TriStateInputValue = boolean | null;

type TriStateSwitchProps = {
  name: string;
  label: string;
  value: TriStateInputValue;
  onChange: (value: TriStateInputValue) => void;
} & Omit<HTMLAttributes<HTMLDivElement>, "onChange">;

export function TriStateInput({
  name,
  label,
  value,
  onChange,
  className = "",
  ...rest
}: TriStateSwitchProps) {
  const myValue = toBoolean(value);

  const handleClick = (clicked: boolean) => {
    onChange(myValue === clicked ? null : clicked);
  };

  const falseAppearance = myValue === false ? "outline" : "link";
  const trueAppearance = myValue === true ? "outline" : "link";

  return (
    <div className={twMerge("flex flex-col gap-8", className)} {...rest}>
      {label && <span className="text-m-medium text-neutral-900">{label}</span>}

      <div
        role="group"
        aria-label={label}
        data-name={name}
        className="flex flex-row gap-0 tri-state-switch"
      >
        <Button
          type="button"
          appearance={falseAppearance}
          onClick={() => handleClick(false)}
          aria-pressed={myValue === false}
          fullWidth
        >
          <div className="flex flex-row gap-8 items-center">
            <XCircle size={ICON_SIZE} />
            <span>Falso</span>
          </div>
        </Button>

        <Button
          type="button"
          appearance={trueAppearance}
          onClick={() => handleClick(true)}
          aria-pressed={myValue === true}
          fullWidth
        >
          <div className="flex flex-row gap-8 items-center">
            <CheckCircle size={ICON_SIZE} />
            <span>Verdadeiro</span>
          </div>
        </Button>
      </div>
    </div>
  );
}
