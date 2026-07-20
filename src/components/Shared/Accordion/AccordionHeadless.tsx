"use client";

import { Accordion, AccordionProps } from "@ama-pt/agora-design-system";

export default function AccordionHeadless(args: AccordionProps) {
  return (
    <div className="accordion-headless">
      <Accordion {...args} />
    </div>
  );
}
