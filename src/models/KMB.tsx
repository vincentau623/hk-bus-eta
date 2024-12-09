export type dataType = Route | Stop | RouteStop | ETA;

export interface genericResposne<dataType> {
  type: string;
  version: string;
  generated_timestamp: string;
  data: dataType; //add more types here;
}

export interface Route {
  co: string;
  route: string;
  bound: string;
  service_type: string;
  orig_en: string;
  orig_tc: string;
  orig_sc: string;
  dest_en: string;
  dest_tc: string;
  dest_sc: string;
  data_timestamp: string;
}

export interface Stop {
  stop: string;
  name_en: string;
  name_tc: string;
  name_sc: string;
  lat: string;
  long: string;
  data_timestamp: string;
  seq?: number; //optional, not available in API response
}

export interface RouteStop {
  co: string;
  route: string;
  bound: string;
  service_type: string;
  seq: number;
  stop: string;
  data_timestamp: string;
}

export interface ETA {
  co: string;
  route: string;
  dir: string;
  service_type: string;
  seq: number;
  stop: string;
  dest_tc: string;
  dest_sc: string;
  dest_en: string;
  eta_seq: number;
  eta: string;
  rmk_tc: string;
  rmk_sc: string;
  rmk_en: string;
  data_timestamp: string;
}
