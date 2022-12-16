import React, { useState } from "react";
import { useCssHandles } from "vtex.css-handles";
import { Collapsible } from "vtex.styleguide";

const LegalTerms = ({ message, valid }: any) => {
  const CSS_HANDLES = ["legalHeader", "legalContent"];
  const [isOpen, setIsOpen] = useState(false);
  const handles = useCssHandles(CSS_HANDLES);

  return (
    <Collapsible
      header={
        <div
          className={`${handles.legalHeader} pv3 hover-c-on-action-secondary`}
        >
          {" "}
          Ver legal
        </div>
      }
      onClick={() => setIsOpen(!isOpen)}
      isOpen={isOpen}
      align="right"
    >
      <div className={`${handles.legalContent} pa3`}>
        <p className="ma0">{valid} {message}</p>
      </div>
    </Collapsible>
  );
};

export default LegalTerms;
