import { ETA, genericResposne, Route, RouteStop, Stop } from "../models/KMB";

const APIURL = "https://data.etabus.gov.hk/v1/transport/kmb";

export const getRouteList = async () => {
  return await fetch(`${APIURL}/route`).then(
    (res) => res.json() as unknown as genericResposne<Route[]>
  );
};

export const getRoute = async (
  route: string,
  direction: string,
  serviceType: string
) => {
  return await fetch(
    `${APIURL}/route/${route}/${direction}/${serviceType}`
  ).then((res) => res.json() as unknown as genericResposne<Route[]>);
};

export const getStopList = async () => {
  return await fetch(`${APIURL}/stop`).then(
    (res) => res.json() as unknown as genericResposne<Stop[]>
  );
};

export const getStop = async (stopId: string) => {
  return await fetch(`${APIURL}/stop/${stopId}`).then(
    (res) => res.json() as unknown as genericResposne<Stop>
  );
};

export const getRouteStopList = async () => {
  return await fetch(`${APIURL}/route-stop`).then(
    (res) => res.json() as unknown as genericResposne<RouteStop[]>
  );
};

export const getRouteStops = async (
  route: string,
  direction: string,
  serviceType: string
) => {
  return await fetch(
    `${APIURL}/route-stop/${route}/${direction}/${serviceType}`
  ).then((res) => res.json() as unknown as genericResposne<RouteStop[]>);
};

export const getEta = async (
  stopId: string,
  route: string,
  serviceType: string
) => {
  return await fetch(`${APIURL}/eta/${stopId}/${route}/${serviceType}`).then(
    (res) => res.json() as unknown as genericResposne<ETA[]>
  );
};

export const getStopEta = async (stopId: string) => {
  return await fetch(`${APIURL}/stop-eta/${stopId}`).then(
    (res) => res.json() as unknown as genericResposne<ETA[]>
  );
};

export const getRouteEta = async (route: string, serviceType: string) => {
  return await fetch(`${APIURL}/route-eta/${route}/${serviceType}`).then(
    (res) => res.json() as unknown as genericResposne<ETA[]>
  );
};
