const APIURL = "https://data.etabus.gov.hk/v1/transport/kmb";

export const getRouteList = async () => {
  return await fetch(`${APIURL}/route`).then((res) => res.json());
};

export const getRoute = async (route, direction, serviceType) => {
  return await fetch(
    `${APIURL}/route/${route}/${direction}/${serviceType}`
  ).then((res) => res.json());
};

export const getStopList = async () => {
  return await fetch(`${APIURL}/stop`).then((res) => res.json());
};

export const getStop = async (stopId) => {
  return await fetch(`${APIURL}/stop/${stopId}`).then((res) => res.json());
};

export const getRouteStopList = async () => {
  return await fetch(`${APIURL}/route-stop`).then((res) => res.json());
};

export const getRouteStop = async (route, direction, serviceType) => {
  return await fetch(
    `${APIURL}/route-stop/${route}/${direction}/${serviceType}`
  ).then((res) => res.json());
};

export const getEta = async (stopId, route, serviceType) => {
  return await fetch(`${APIURL}/eta/${stopId}/${route}/${serviceType}`).then(
    (res) => res.json()
  );
};

export const getStopEta = async (stopId) => {
  return await fetch(`${APIURL}/stop-eta/${stopId}`).then((res) => res.json());
};

export const getRouteEta = async (route, serviceType) => {
  return await fetch(`${APIURL}/route-eta/${route}/${serviceType}`).then(
    (res) => res.json()
  );
};
