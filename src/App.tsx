/* eslint-disable @typescript-eslint/no-floating-promises */
import { useEffect, useState } from "react";
import { getRouteEta, getRouteList, getRouteStops, getStop } from "./api/KMB";
import {
  Autocomplete,
  TextField,
  Stack,
  Button,
  Typography,
} from "@mui/material";
import moment from "moment-timezone";
import "./App.css";
import { ETA, Route, RouteStop, Stop } from "./models/KMB";

function App() {
  const [routeList, setRouteList] = useState<Route[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<Route>();
  const [routeStops, setRouteStops] = useState<Stop[]>([]);
  const [selectedRouteStop, setSelectedRouteStop] = useState<Stop>();
  const [routeEta, setRouteEta] = useState<ETA[]>([]);
  const [etaResult, setEtaResult] = useState<ETA[]>([]);
  const [selectedLang, setSelectedLang] = useState<string>("en");

  // When enter the page, fetch the route list and set the selected route to the first one
  useEffect(() => {
    const init = async () => {
      const newRouteList = (await getRouteList()).data;
      setRouteList(newRouteList);
      const lastRoute = localStorage.getItem("lastRoute");
      if (lastRoute) {
        setSelectedRoute(
          newRouteList.find(
            (el) => `${el.route}${el.bound}${el.service_type}` === lastRoute
          )
        );
      } else {
        setSelectedRoute(newRouteList[0]);
      }
    };
    init();
  }, []);

  // when a route is selected, fetch the route stop and route ETA
  useEffect(() => {
    if (selectedRoute) {
      fetchRouteStop();
      fetchRouteEta();
    }
  }, [selectedRoute]);

  const fetchRouteStop = async () => {
    if (!selectedRoute) {
      return;
    }
    const newRouteStops = (
      await getRouteStops(
        selectedRoute.route,
        selectedRoute.bound === "I" ? "inbound" : "outbound",
        selectedRoute.service_type
      )
    ).data;
    await Promise.all(
      newRouteStops.map(async (el: RouteStop, index: number) => {
        const result = (await getStop(el.stop)).data;
        return { ...result, seq: index };
      })
    ).then((list) => {
      setRouteStops(list);
    });
  };

  const fetchRouteEta = async () => {
    if (!selectedRoute) {
      return;
    }
    const newRouteEta = (
      await getRouteEta(selectedRoute.route, selectedRoute.service_type)
    ).data;
    setRouteEta(newRouteEta);
  };

  // when the
  useEffect(() => {
    const lastStop = localStorage.getItem("lastRouteStop");
    if (lastStop && routeStops.length > 0) {
      setSelectedRouteStop(
        routeStops.find((el) => `${el.seq}` === `${lastStop}`) || routeStops[0]
      );
    } else {
      setSelectedRouteStop(routeStops[0]);
    }
  }, [routeStops]);

  useEffect(() => {
    if (selectedRouteStop && routeEta.length > 0 && selectedRoute) {
      const stopEta = routeEta.filter(
        (el) =>
          el.seq === selectedRouteStop.seq && el.dir === selectedRoute.bound
      );
      setEtaResult(stopEta);
    }
  }, [routeEta, selectedRoute, selectedRouteStop]);

  const changeLanguage = () => {
    if (selectedLang === "en") {
      setSelectedLang("tc");
    } else if (selectedLang === "tc") {
      setSelectedLang("en");
    }
  };

  const displayETA = () => {
    return (
      <div>
        {etaResult.length > 0 ? (
          etaResult.map((el) => {
            return (
              <div key={el.eta_seq}>
                {el.eta ? (
                  <div>
                    {moment(el.eta).tz("Asia/Hong_Kong").format("HH:mm:ss")} (
                    {moment(el.eta).diff(moment(), "minutes")})
                  </div>
                ) : (
                  <div>No ETA at the moment</div>
                )}
                <Typography variant="caption" display="block" gutterBottom>
                  Last Update: {moment(el.data_timestamp).format("HH:mm:ss")}{" "}
                </Typography>
              </div>
            );
          })
        ) : (
          <div>No service at the moment</div>
        )}
        <Button
          color="primary"
          aria-label="refresh"
          onClick={() => void fetchRouteEta()}
        >
          Refresh
        </Button>
        <Typography variant="caption" gutterBottom sx={{ display: "block" }}>
          *The ETA is based on UTC+8.
        </Typography>
      </div>
    );
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Button
          variant="outlined"
          startIcon={`⬅️`}
          onClick={() => (window.location.href = "https://vincentwcau.com/")}
        >
          Return to Main Page
        </Button>
        <Button variant="outlined" startIcon={`🔃`} onClick={changeLanguage}>
          Change Stop Name Language (Current: {selectedLang})
        </Button>
      </div>
      <Stack spacing={2} style={{ paddingTop: "1em" }}>
        {routeList.length > 0 && selectedRoute && (
          <Autocomplete
            disablePortal
            value={selectedRoute}
            onChange={(_, newValue) => {
              if (!newValue) return;
              localStorage.setItem(
                "lastRoute",
                `${newValue.route}${newValue.bound}${newValue.service_type}`
              );
              setSelectedRoute(newValue);
            }}
            id="auto-complete route"
            options={routeList}
            getOptionLabel={(option) =>
              `${option.route} - ${
                selectedLang === "en" ? option.orig_en : option.orig_tc
              }->${selectedLang === "en" ? option.dest_en : option.dest_tc} (${
                option.bound
              }${option.service_type})`
            }
            sx={{ width: "90vw" }}
            renderInput={(params) => <TextField {...params} label="Route" />}
          />
        )}
        {routeStops.length > 0 && selectedRouteStop && (
          <Autocomplete
            disablePortal
            value={selectedRouteStop}
            onChange={(_, newValue) => {
              if (!newValue) return;
              localStorage.setItem("lastRouteStop", `${newValue.seq}`);
              setSelectedRouteStop(newValue);
            }}
            id="auto-complete stop"
            options={routeStops}
            getOptionLabel={(option) =>
              `${option.seq} - ${
                selectedLang === "en" ? option.name_en : option.name_tc
              }`
            }
            sx={{ width: "90vw" }}
            renderInput={(params) => <TextField {...params} label="Stop" />}
          />
        )}
        {selectedRouteStop && routeEta.length > 0 && displayETA()}
      </Stack>
    </div>
  );
}

export default App;
