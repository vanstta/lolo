import React from "react";
import { useCssHandles } from "vtex.css-handles";

const DateDrawer = ({ from, to, text }: any) => {
  const CSS_HANDLES = ["dateContainer", "dateText"];
  const handles = useCssHandles(CSS_HANDLES);
  const [yearFrom, monthFrom, dayFrom] = from.split("T")[0].split("-");
  const [yearTo, monthTo, dayTo] = to.split("T")[0].split("-");
  const isSameYear = yearFrom === yearTo;
  const isSameMonth = monthFrom === monthTo;
  const dateFrom = new Date(yearFrom, monthFrom - 1, dayFrom);
  const dateTo = new Date(yearTo, monthTo - 1, dayTo);

  const capitalize = (text: string) => {
    if (typeof text !== "string") return "";
    return text.charAt(0).toUpperCase() + text.slice(1);
  };

  return (
    <div className={handles.dateContainer}>
      {text != "null" ? (
        <span className={handles.dateText}>{text}</span>
      ) : (
        <span className={handles.dateText}>
          {`Del ${parseInt(dayFrom, 10)} ${
            isSameYear && isSameMonth
              ? ""
              : " de " +
                capitalize(dateFrom.toLocaleString("es-AR", { month: "long" }))
          }${isSameYear ? "" : " de " + yearFrom + " "} al ${parseInt(
            dayTo,
            10
          )} de ${capitalize(
            dateTo.toLocaleString("es-AR", { month: "long" })
          )} del ${yearTo}`}
        </span>
      )}
    </div>
  );
};

export default DateDrawer;
