import React from "react";
import { useCssHandles } from "vtex.css-handles";

const EmptyPromos = ({ message }: any) => {
  const CSS_HANDLES = ["emptyMessageContainer", "emptyMessage"];
  const handles = useCssHandles(CSS_HANDLES);

  return (
    <div className={`${handles.emptyMessageContainer} flex items-center justify-center t-heading-2 c-emphasis`}>
      <span className={`${handles.emptyMessage} f3`}>{message}</span>
    </div>
  );
};

export default React.memo(EmptyPromos);
