"use client";

import Button from "@/components/Shared/Button/Button";
import Dropdown from "@/components/Shared/Dropdown/Dropdown";
import DropdownOption from "@/components/Shared/Dropdown/DropdownOption";
import DropdownSection from "@/components/Shared/Dropdown/DropdownSection";
import {
  FilterOperatorNumber,
  FilterOperatorText,
} from "@/services/consts/explorer";
import {
  DropdownElement,
  DropdownOptionProps,
} from "@ama-pt/agora-design-system";
import {
  KeyboardEvent,
  MouseEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

export type FilterOperatorI = {
  dataType: "text" | "numeric";
};

export default function FilterOperator({ dataType }: FilterOperatorI) {
  const ref = useRef<DropdownElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isExpanded, setIsExpanded] = useState(false);
  const [selected, setSelected] = useState([] as string[]);

  const toggleVisibility = () => {
    if (ref.current?.visibility) {
      ref.current?.hide();
    } else {
      ref.current?.show();
    }
  };

  const handleKeydown = (evt: KeyboardEvent<HTMLButtonElement>) => {
    const code = evt.code;

    if (code === "Escape" && ref.current?.visibility) {
      ref.current.hide();
    }

    if (code === "Enter" || code === "Space" || code === "NumpadEnter") {
      toggleVisibility();
    }
  };

  const handleClick = (evt: MouseEvent<HTMLButtonElement>) => {
    if (typeof evt.detail === "number" && evt.detail === 0) {
      //  EVENT DETAIL IS THE NUMBER OF CLICKS. KEYBOARD DOES NOT ADD A CLICK COUNTER.
      //  KEYBOARD IS HANDLED ON KEYDOWN
      return;
    }

    toggleVisibility();
  };

  const handleShow = () => {
    setIsExpanded(true);
    ref.current?.first();
  };

  const handleHide = () => {
    setIsExpanded(false);
  };

  useEffect(() => {
    const handleClickOutside = (evt: Event) => {
      if (
        ref.current?.visibility &&
        !containerRef.current?.contains(evt.target as HTMLElement)
      ) {
        ref.current.hide();
      }
    };

    document?.addEventListener("click", handleClickOutside);

    return () => {
      document?.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const options = useMemo(() => {
    const arr = dataType === "text" ? FilterOperatorText : FilterOperatorNumber;
    return arr.map((o) => {
      return (
        <DropdownOption value={o} key={o} selected={selected.indexOf(o) >= 0}>
          {o}
        </DropdownOption>
      );
    });
  }, [selected, dataType]);

  const handleChange = (options: DropdownOptionProps[]) => {
    setSelected(options.map((o) => o.value));
  };

  return (
    <div className="flex flex-col">
      <Button
        hasIcon
        iconOnly
        trailingIcon={"agora-line-settings"}
        trailingIconHover={"agora-line-settings"}
        appearance={"outline"}
        aria-label={"Operador do filtro"}
        aria-expanded={isExpanded}
        role={"combobox"}
        onClick={handleClick}
        onKeyDown={handleKeydown}
      />
      <div className="relative">
        <Dropdown
          ref={ref}
          onShow={handleShow}
          onHide={handleHide}
          aria-label={"Escolha o operador para o filtro"}
          onChange={handleChange}
          hideSectionNames
        >
          <DropdownSection name={"operador"}>{options}</DropdownSection>
        </Dropdown>
      </div>
    </div>
  );
}
