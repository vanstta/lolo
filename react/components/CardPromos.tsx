import React from "react";

import DateDrawer from "./DateDrawer";
import IconsDrawer from "./IconsDrawer";
import TemplateBody from "./TemplateBody";
import LegalTerms from "./LegalTerms";

import { useCssHandles } from "vtex.css-handles";

const CSS_HANDLES = [
  "cardBox",
  "cardHeader",
  "cardHeaderContainer",
  "cardBody",
  "cardFooter",
  "cardFooterContainer",
];

const CardPromos = ({ promo }: any) => {
  const handles = useCssHandles(CSS_HANDLES);

  return (
    <div className={handles.cardBox}>
      <div className={handles.cardHeader}>
        <div className={handles.cardHeaderContainer}>
          <DateDrawer from={promo.active_from} to={promo.active_to} text={promo.validText} />
          <IconsDrawer
            isNormal={promo.hyper}
            isExpress={promo.express}
            isOnline={promo.ecommerce}
            isMaxi={promo.maxi}
            isMarket={promo.market}
          />
        </div>
      </div>
      <div className={handles.cardBody}>
        <TemplateBody promo={promo} />
      </div>
      <div className={handles.cardFooter}>
        <div className={handles.cardFooterContainer}>
          <LegalTerms message={promo.legal} valid={promo.valid} />
        </div>
      </div>
    </div>
  );
};

export default React.memo(CardPromos);