import { ReactNode } from "react";

export type LineWrapperI = { children: ReactNode };

export default function LineWrapper({ children }: LineWrapperI) {
  return (
    <div className="w-full h-auto pb-16 border-b-1 border-neutral-700">
      {children}
    </div>
  );
}
