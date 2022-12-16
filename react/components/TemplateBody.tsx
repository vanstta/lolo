import React from "react";
import { useCssHandles } from "vtex.css-handles";

const TemplateBody = ({ promo }: any) => {
  const CSS_HANDLES = [
    "discount",
    "card",
    "ColLeft",
    "ColLeftCard",
    "ColLeftPercentageContainer",
    "ColLeftPercentage",
    "ColLeftPercentageSymbol",
    "ColLeftPercentageText",
    "ColRight",
    "ColRightCard",
    "ColRightImage",
    "Image",
    "ImageCard",
    "ColRightTittle",
    "ColRightText",
    "ColLeftWrapper",
    "ColLeftSeparator"
  ];

  const {
    discount_percentage,
    discounts_amount_installments,
    discount_text_info,
    sub_title,
    title,
    img,
    img_card,
    id,
    order,
    discounts_text_installments
  } = promo;

  const handles = useCssHandles(CSS_HANDLES);

  return (
    <div className={handles.discount} style={{ order: Number(order) }}>
      <div className={handles.ColLeft}>
        <div className={handles.ColLeftCard}>
          {discount_percentage != "null" &&
            <div className={`${handles.ColLeftWrapper}`}>
              <div className={`${handles.ColLeftPercentageContainer}`}>
                <span className={handles.ColLeftPercentage}>
                  {discount_percentage ? discount_percentage : ""}
                </span>
                <span className={handles.ColLeftPercentageSymbol}>%</span>
              </div>
              <div className={`${handles.ColLeftPercentageContainer}`}>
              <span className={handles.ColLeftPercentageText}>
                {discount_text_info != "null" ? discount_text_info : ""}
              </span>
              </div>
            </div>
          }
          {discount_percentage != "null" && discounts_amount_installments != "null" ? <span className={`${handles.ColLeftSeparator}`}>ó</span> : ""}
          {discounts_amount_installments != "null" &&
            <div className={`${handles.ColLeftWrapper}`}>
              <div className={`${handles.ColLeftPercentageContainer}`}>
                <span className={handles.ColLeftPercentage}>
                  {discounts_amount_installments ? discounts_amount_installments : ""}
                </span>
                <span className={handles.ColLeftPercentageSymbol}>cuotas</span>
              </div>
              <div className={`${handles.ColLeftPercentageContainer}`}>
                <span className={handles.ColLeftPercentageText}>
                  {discounts_text_installments != "null" ? discounts_text_installments : ""}
                </span>
              </div>
            </div>
          }
        </div>
      </div>
      <div className={handles.ColRight}>
        <div className={handles.ColRightCard}>
          <div className={handles.ColRightImage}>
            {img !== "null" && (
              <img
                className={handles.Image}
                src={`/api/dataentities/BP/documents/${id}/img/attachments/${img}`}
                alt={img}
              />
            )}
            {img_card !== "null" && (
              <img
                className={handles.ImageCard}
                src={`/api/dataentities/BP/documents/${id}/img_card/attachments/${img_card}`}
                alt={img_card}
              />
            )}
          </div>
          <span className={handles.ColRightTittle}>{title}</span>
          {sub_title !== "null" && sub_title.length > 0 ? (
            <span className={handles.ColRightText}>{sub_title}</span>
          ) : (
            " "
          )}
        </div>
      </div>
    </div>
  );
};

export default TemplateBody;
