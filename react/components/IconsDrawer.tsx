import React from "react";
import { useRuntime } from "vtex.render-runtime";
import { useCssHandles } from "vtex.css-handles";

const CSS_HANDLES = [
  "iconsContainer",
  "iconItem",
  "logoMain",
  "logoIcon",
  "logoMain",
  "logoExpress",
  "logoMaxi",
  "logoOnline",
  "logoMarket",
];

const IconsDrawer = ({ isNormal, isExpress, isMaxi, isOnline, isMarket }: any) => {
  const handles = useCssHandles(CSS_HANDLES);
  const { route, account } = useRuntime();

  const themeVersion = () => {
    const n = route.styleMeta.themeId.match(/\d+/g).map(Number);
    const v = `${n[0]}.${n[1]}.${n[2]}`;
    return v;
  };
  const domainTheme = route.styleMeta.themeId.split("@")[0];

  const imgRouter = (folderName: string, imgName: string) =>
    `https://${account}.vtexassets.com/assets/vtex/assets-builder/${domainTheme}/${themeVersion()}/${folderName}/${imgName}`;

  const logoMaxiStyles = {
    backgroundImage: `url(${imgRouter("logo", "logo_maxi.svg")})`,
  } as React.CSSProperties;
  const logoExpressStyles = {
    backgroundImage: `url(${imgRouter("logo", "logo_express.svg")})`,
  } as React.CSSProperties;
  const logoMarketStyles = {
    backgroundImage: `url(${imgRouter("logo", "logo_market.svg")})`,
  } as React.CSSProperties;
  const logoOnlineStyles = {
    backgroundImage: `url(${imgRouter("logo", "logo_com.svg")})`,
  } as React.CSSProperties;
  const logoMainStyles = {
    backgroundImage: `url(${imgRouter("logo", "logo.svg")})`,
  } as React.CSSProperties;

  return (
    <div className={handles.iconsContainer}>
      {isNormal === "true" && (
        <div className={handles.iconItem}>
          <div
            className={`${handles.logoIcon} ${handles.logoMain}`}
            style={logoMainStyles}
          />
        </div>
      )}
      {isMarket === "true" && (
        <div className={handles.iconItem}>
          <div
            className={`${handles.logoIcon} ${handles.logoMarket}`}
            style={logoMarketStyles}
          />
        </div>
      )}
      {isOnline === "true" && (
        <div className={handles.iconItem}>
          <div
            className={`${handles.logoIcon} ${handles.logoOnline}`}
            style={logoOnlineStyles}
          />
        </div>
      )}
      {isExpress === "true" && (
        <div className={handles.iconItem}>
          <div
            className={`${handles.logoIcon} ${handles.logoExpress}`}
            style={logoExpressStyles}
          />
        </div>
      )}
      {isMaxi === "true" && (
        <div className={handles.iconItem}>
          <div
            className={`${handles.logoIcon} ${handles.logoMaxi}`}
            style={logoMaxiStyles}
          />
        </div>
      )}
    </div>
  );
};

export default IconsDrawer;
