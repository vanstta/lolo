import React, { useState, useEffect, Suspense } from "react";
import BanksPromotionsProps from "./interfaces/BanksPromotionsProps";

import { useCssHandles } from "vtex.css-handles";
import { useRuntime, Link } from "vtex.render-runtime";
import { Spinner, Tab, Tabs } from "vtex.styleguide";
import Slider from "react-slick";

import { useLazyQuery } from "react-apollo";
import { GetCards } from "./graphql/getCards.graphql";
import { GetBanks } from "./graphql/getBanks.graphql";
import { GetPromos } from "./graphql/getPromos.graphql";

const CardPromos = React.lazy(() => import("./components/CardPromos"))
const EmptyPromos = React.lazy(() => import("./components/EmptyPromos"))

import "./components/template.css";
import "slick-carousel/slick/slick-theme.css";

const BanksPromotions: StorefrontFunctionComponent<BanksPromotionsProps> = ({}) => {
  const { account, route } = useRuntime();
  const CSS_HANDLES = ["container", "promosContainer", "mainMenu", "menuItem", "menuItemActive", "daysMenu", "daysItem", "daysItemDisabled", "selectedDay", "entitiesMenu", "entitiesItem", "entitiesImage", "selectedEntity", "tabMenu"];
  var slickSettings = {
    dots: true,
    arrows: false,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    variableWidth: true,
  };
  const styleLoader = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    marginBottom: 150,
    marginTop: 100
  } as React.CSSProperties;
  const handles = useCssHandles(CSS_HANDLES);
  const { innerWidth: viewportWidth } = window;

  const [currentTab, setCurrentTab] = useState<number>(1);
  const [currentDayTab, setCurrentDayTab] = useState<any>();
  const [currentEntityTab, setCurrentEntityTab] = useState<any>(0);
  const [entitiesOptions, setEntitiesOptions] = useState<any>([{ name: "Todas", mdEntity: "ZZ" }]);
  const [promos, setPromos] = useState<any>([]);
  const [loader, setLoader] = useState(true);
  const [filteredDailyPromos, setFilteredDailyPromos] = useState<any>([]);
  const [filteredEntityPromos, setFilteredEntityPromos] = useState<any>([]);
  const [filteredCarrefourTCPromos, setFilteredCarrefourTCPromos] = useState<any>([]);

  const [getBanks, { data: banksData, loading: banksLoading, called: banksCalled, error: banksError }] = useLazyQuery(GetBanks, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "cache-and-network",
  });

  const [getCards, { data: cardsData, loading: cardsLoading, called: cardsCalled, error: cardsError}] = useLazyQuery(GetCards, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "cache-and-network",
  });

  const [getPromos, { data: promosData, loading: promosLoading, called: promosCalled, error: promosError}] = useLazyQuery(GetPromos, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "cache-and-network",
  });

  const days = [
    { name: "Monday", nameSpanish: "Lunes", nameAbbr: "L" },
    { name: "Tuesday", nameSpanish: "Martes", nameAbbr: "M" },
    { name: "Wednesday", nameSpanish: "Miércoles", nameAbbr: "M" },
    { name: "Thursday", nameSpanish: "Jueves", nameAbbr: "J" },
    { name: "Friday", nameSpanish: "Viernes", nameAbbr: "V" },
    { name: "Saturday", nameSpanish: "Sábado", nameAbbr: "S" },
    { name: "Sunday", nameSpanish: "Domingo", nameAbbr: "D" },
  ];

  const today = new Date().toLocaleDateString("es-AR", { weekday: "long" });

  // Handles
  const handleDailyPromos = (day: any) => {
    let selectedDay = days.filter((d: any) => d.nameSpanish.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") === day).map((d: any) => d.name.toLowerCase());
    let filtered = promos.filter((promo: any) => promo[selectedDay[0]] === "true");
    setFilteredDailyPromos(filtered);
  };

  const handleEntityPromos = (entity?: any) => {
    let selectedEntity = entitiesOptions.filter((e: any) => e.name === entity).map((e: any) => e.id);
    let filtered = entity ? promos.filter((promo: any) => promo.idBank === selectedEntity[0] || promo.idCard === selectedEntity[0]) : promos;
    setFilteredEntityPromos(filtered);
  };

  const handleCarrefourTCPromos = () => {
    let selectedEntity = entitiesOptions.filter((e: any) => e.name === "Tarjeta Carrefour").map((e: any) => e.id);
    let filtered = promos.filter((promo: any) => promo.idCard === selectedEntity[0]);
    setFilteredCarrefourTCPromos(filtered);
  };

  const handleDayURL = (day?: string) => {
    if (day) {
      const selectedIndex = days.findIndex((d: any) => d.nameSpanish.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") === day)
      handleDailyPromos(day)
      setCurrentDayTab(selectedIndex);
    } else {
      const selectedIndex = days.findIndex((d: any) => d.nameSpanish.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") === today.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""))
      handleDailyPromos(today.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""))
      setCurrentDayTab(selectedIndex);
    }
  }

  const updateLoader = (status: boolean) => {
    setLoader(status);
  };

  // Effects
  useEffect(() => {
    if (!banksCalled) {
      getBanks({
        variables: {
          account: `${account}`,
        },
      });
    }
    if (!cardsCalled) {
      getCards({
        variables: {
          account: `${account}`,
        },
      });
    }
    if (!promosCalled) {
      const date = new Date();
      const today = date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + ("0" + date.getDate()).slice(-2) + "T" + ("0" + date.getHours()).slice(-2) + ":" + ("0" + date.getMinutes()).slice(-2) + ":" + ("0" + date.getSeconds()).slice(-2);

      getPromos({
        variables: {
          where: `active=true AND ((active_from < ${today}) AND (active_to > ${today}))`,
          account: `${account}`,
        },
      });
    }
  }, [account]);

  useEffect(() => {
    if (!banksLoading && banksData) {
      if (banksData.documents.length > 0) {
        let reducedBanks = banksData.documents.map((bank: any) => bank.fields.reduce((acc: any, cur: any) => ((acc[cur.key] = cur.value), acc),{}));
        let filteredBanks = reducedBanks.filter((bank: any) => promos.some((promo: any) => promo.idCard === "null" && bank.id === promo.idBank));
        let formattedBanks = filteredBanks.map((bank: any) => ({ ...bank, mdEntity: "FB" }));
        setEntitiesOptions((oldArray: any) => [...oldArray, ...formattedBanks]);
      }
    } else if (banksError) {
      console.error("GraphQL Error: ", banksError);
    }
  }, [banksLoading, banksCalled, promos]);

  useEffect(() => {
    if (!cardsLoading && cardsData) {
      if (cardsData.documents.length > 0) {
        let reducedCards = cardsData.documents.map((card: any) => card.fields.reduce((acc: any, cur: any) => ((acc[cur.key] = cur.value), acc), {}));
        let filteredCards = reducedCards.filter((card: any) => promos.some((promo: any) => card.id === promo.idCard));
        let formattedCards = filteredCards.map((bank: any) => ({ ...bank, mdEntity: "FC" }));
        setEntitiesOptions((oldArray: any) => [...oldArray, ...formattedCards]);
      }
    } else if (cardsError) {
      console.error("GraphQL Error: ", cardsError);
    }
  }, [cardsLoading, cardsCalled, promos]);

  useEffect(() => {
    if (!promosLoading && promosData) {
      if (promosData.documents.length > 0) {
        setPromos(promosData.documents.map((promo: any) => promo.fields.reduce((acc: any, cur: any) => ((acc[cur.key] = cur.value), acc), {})));
      } else {
        setPromos([]);
      }
    } else if (promosError) {
      console.error("GraphQL Error: ", promosError);
    }
  }, [promosLoading, promosCalled]);

  useEffect(() => {
    entitiesOptions.sort((a: any, b: any) => b.mdEntity.localeCompare(a.mdEntity) || a.name.localeCompare(b.name))
  }, [entitiesOptions]);

  useEffect(() => {
    if (route.queryString.dia) {
      handleDayURL(route.queryString.dia)
    } else if (route.queryString.banco) {
      handleEntityPromos(route.queryString.banco != "Todas" ? route.queryString.banco : '');
      setCurrentEntityTab(entitiesOptions.findIndex((e: any) => e.name === route.queryString.banco))
      setCurrentTab(2);
      updateLoader(false);
    } else if (route.queryString.hasOwnProperty("tarjeta-carrefour")) {
      handleCarrefourTCPromos();
      setCurrentTab(3);
      updateLoader(false);
    } else {
      handleDayURL()
    }
  }, [promos, entitiesOptions]);

  useEffect(() => {
    if (currentTab != 1) handleDayURL()
    if (currentTab != 2) {
      handleEntityPromos()
      setCurrentEntityTab(0)
    }
  }, [promos])

  useEffect(() => {
    if (filteredDailyPromos.length > 0 && currentDayTab != undefined) {
      updateLoader(false);
    }
  }, [filteredDailyPromos]);

  useEffect(() => {
    if ((filteredDailyPromos.length === 0 && promos.length === 0) &&  currentDayTab != undefined) {
      updateLoader(false);
      setCurrentDayTab(null);
    }

  }, [promos, filteredDailyPromos])

  return (
    <>
      {loader ? (
        <div className={`${handles.container}`} style={styleLoader}>
          <Spinner size="40" />
        </div>
      ) : (
        <div className={`${handles.container}`}>
          {viewportWidth < 768 ? (
            <ul className={`${handles.mainMenu}`}>
              <Slider {...slickSettings}>
                <li>
                  <Link
                    className={`${handles.menuItem} ${currentTab === 1 ? handles.menuItemActive : ""}`}
                    onClick={() => setCurrentTab(1)}
                    to="/promociones-bancarias"
                    scrollOptions={false}
                    replace={false}
                  >
                    Por Día
                  </Link>
                </li>
                <li>
                  <Link
                    className={`${handles.menuItem} ${currentTab === 2 ? handles.menuItemActive : ""}`}
                    onClick={() => {
                      setCurrentTab(2);
                    }}
                    to="/promociones-bancarias"
                    scrollOptions={false}
                    replace={false}
                  >
                    Por Banco/Tarjeta
                  </Link>
                </li>
                <li>
                  <Link
                    className={`${handles.menuItem} ${currentTab === 3 ? handles.menuItemActive : ""}`}
                    onClick={() => {
                      setCurrentTab(3);
                      handleCarrefourTCPromos();
                    }}
                    to="/promociones-bancarias"
                    query={`tarjeta-carrefour`}
                    scrollOptions={false}
                    replace={false}
                  >
                    Tarjeta Carrefour
                  </Link>
                </li>
              </Slider>
            </ul>
          ) : (
            <ul className={`${handles.mainMenu}`}>
              <li>
                <Link
                  className={`${handles.menuItem} ${currentTab === 1 ? handles.menuItemActive : ""}`}
                  onClick={() => setCurrentTab(1)}
                  to="/promociones-bancarias"
                  scrollOptions={false}
                  replace={false}
                >
                  Por Día
                </Link>
              </li>
              <li>
                <Link
                  className={`${handles.menuItem} ${currentTab === 2 ? handles.menuItemActive : ""}`}
                  onClick={() => {
                    setCurrentTab(2);
                  }}
                  to="/promociones-bancarias"
                  scrollOptions={false}
                  replace={false}
                >
                  Por Banco/Tarjeta
                </Link>
              </li>
              <li>
                <Link
                  className={`${handles.menuItem} ${currentTab === 3 ? handles.menuItemActive : ""}`}
                  onClick={() => {
                    setCurrentTab(3);
                    handleCarrefourTCPromos();
                  }}
                  to="/promociones-bancarias"
                  query={`tarjeta-carrefour`}
                  scrollOptions={false}
                  replace={false}
                >
                  Tarjeta Carrefour
                </Link>
              </li>
            </ul>
          )}

          <Tabs>
            <Tab active={currentTab === 1}>
              <div className={`${handles.daysMenu}`}>
                {days.map((day: any, index: number) => (
                  <Link
                    to="/promociones-bancarias"
                    query={`dia=${day.nameSpanish.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")}`}
                    key={index}
                    scrollOptions={false}
                    replace={false}
                    onClick={() => {
                      setCurrentDayTab(index);
                      handleDailyPromos(day.nameSpanish.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""));
                    }}
                    className={`${handles.daysItem + " dib"} ${currentDayTab === index ? `${handles.selectedDay}` : ""} ${promos.some((promo: any) => promo[day.name.toLowerCase()] === "true") ? "" : handles.daysItemDisabled}`}
                  >
                    {viewportWidth > 768 ? day.nameSpanish : day.nameAbbr}
                  </Link>
                ))}
              </div>

              <div className={`${handles.promosContainer}`}>
                  {filteredDailyPromos.length > 0 ? (
                    filteredDailyPromos.map((promo: any, index: any) => (
                      <Suspense fallback={<Spinner size="40" />}>
                        <CardPromos key={index} promo={promo} />
                      </Suspense>
                    ))
                  ) : promos.length === 0 ?
                    (
                      <Suspense fallback={<Spinner size="40" />}>
                        <EmptyPromos message="No hay promociones vigentes" />
                      </Suspense>
                    ) :

                    (
                      <Suspense fallback={<Spinner size="40" />}>
                        <EmptyPromos message="No hay promociones vigentes para el día seleccionado" />
                      </Suspense>
                    )}
              </div>
            </Tab>

            <Tab active={currentTab === 2}>
              <div className={`${handles.entitiesMenu}`}>
                {entitiesOptions.map((entity: any, index: number) => (
                  <Link
                    to="/promociones-bancarias"
                    query={`banco=${entity.name}`}
                    key={index}
                    scrollOptions={false}
                    replace={false}
                    onClick={() => {
                      setCurrentEntityTab(index);
                      handleEntityPromos(entity.name != "Todas" ? entity.name : '');
                    }}
                    className={`${handles.entitiesItem + " b--solid bw1 br3 pointer fw7 tc f7 mb3 mr3 h3 dib"} ${currentEntityTab === index ? `${handles.selectedEntity}` : ""}`}
                  >
                    {entity.image ? (
                      <img className={`${handles.entitiesImage} v-mid`} src={`/api/dataentities/${entity.mdEntity === "FB" ? "FB" : "FC"}/documents/${entity.id}/image/attachments/${entity.image}`} alt={entity.name} />
                    ) : (
                      entity.name
                    )}
                  </Link>
                ))}
              </div>

              <div className={`${handles.promosContainer}`}>
                {filteredEntityPromos.length > 0 ? (
                  filteredEntityPromos.map((promo: any, index: any) => (
                    <Suspense fallback={<Spinner size="40" />}>
                      <CardPromos key={index} promo={promo} />
                    </Suspense>
                  ))
                ) :
               promos.length === 0 ? (
                      <Suspense fallback={<Spinner size="40" />}>
                        <EmptyPromos message="No hay promociones vigentes" />
                      </Suspense>
                    )
               :  (
                  <Suspense fallback={<Spinner size="40" />}>
                    <EmptyPromos message="No hay promociones vigentes para la entidad seleccionada" />
                  </Suspense>
                )}
              </div>
            </Tab>

            <Tab active={currentTab === 3}>
              <div className={`${handles.promosContainer}`}>
                {filteredCarrefourTCPromos.length > 0 ? (
                  filteredCarrefourTCPromos.map((promo: any, index: any) => (
                    <Suspense fallback={<Spinner size="40" />}>
                      <CardPromos key={index} promo={promo} />
                    </Suspense>
                  ))
                ) : (
                  <Suspense fallback={<Spinner size="40" />}>
                    <EmptyPromos message="No hay promociones vigentes para la Tarjeta Carrefour" />
                  </Suspense>
                )}
              </div>
            </Tab>
          </Tabs>
        </div>
      )}
    </>
  );
};

BanksPromotions.schema = {};

export default BanksPromotions;