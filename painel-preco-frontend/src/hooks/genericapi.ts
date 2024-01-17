import logger from "../../services/logger";
import { mountUrl } from "@/utils/requestUtils";
import { IAPISearchProps, IReturnRequestAPI } from "@/interfaces/types";

const host = 'http://muraldeprecos.com';//'http://localhost:8080';

export const revalidate = 3600; // revalida os dados a cada hora

export type ResponseReq = {
  status: boolean,
  statusCode: number | null,
  statusText: string | null,
  statusDetails: string | null,
  data: Response | null
};

export type ResponseError = {
  error: string
  path: string
  status: number
  timestamp: string
}

const doReq = async (
  { path, page, size, info, filterFields, config, contentType = 'application/json', acceptType = 'application/json' } : IAPISearchProps) : Promise<ResponseReq> => {
    try {
      const HEADERS : HeadersInit = {}
      //'Authorization': `Bearer ${token}`
      if (contentType) { HEADERS['Content-Type'] = contentType; }
      if (acceptType) { HEADERS['Accept'] = acceptType; }

      const reqOpts = { 
        //TODO: aprimorar cache de requisições e adicionar body
        // cache: 'force-cache',
        next: {  },
        headers: new Headers(HEADERS),
        ...config
      }
      const url = mountUrl({ host, path, page, size, info, filterFields});
      const res = await fetch(url, reqOpts)
        .then((resp) : Promise<ResponseReq> => {
            if (resp.ok) {
              const result: ResponseReq = {
                status: true,
                statusCode: resp.status,
                statusText: resp.statusText,
                statusDetails: null,
                data: resp,
              }
              return new Promise<ResponseReq>((resolve) => { resolve(result) });;
            } else {
                const result: ResponseReq = {
                    status: false,
                    statusCode: resp.status,
                    statusText: resp.statusText,
                    statusDetails: null,
                    data: resp,
                }
                logger.error(`Bad response from server. Path: ${url}. Opts: ${JSON.stringify(reqOpts)}. Response status: ${resp.status}.`);
                return new Promise<ResponseReq>((resolve) => { resolve(result) });
            }
        }).catch((error) => {
            const result: ResponseReq = {
                status: false,
                statusCode: 503,
                statusText: error,
                statusDetails: error,
                data: null,
            }
            logger.error(`Throw error when are doing request. Path: ${url}. Opts: ${JSON.stringify(reqOpts)}. Response status: ${error}.`);
            return new Promise<ResponseReq>((resolve) => { resolve(result) });
        });
        return res;
    } catch (error) {
      logger.error(error);
      throw(error)
    }
}


export const getGenericObject =  async <T>(
  { path, page = 0, size = 50, info, filterFields, config } : IAPISearchProps
  ) : Promise<T|null> => {
    const res = await doReq({ path, page, size, info, filterFields, config });
    return res.data?.json();
}
export const getGenericListPageable =  async <T>(
    { path, page, size, info, filterFields, config } : IAPISearchProps
  ) : Promise<IReturnRequestAPI<T>|null> => {
  return getGenericObject({ path, page, size, info, filterFields, config });
}

export const postGeneric =  async <T>(
  { path, bodydata, acceptType } : IAPISearchProps
  ) : Promise<ResponseReq> => {
    const res = await doReq({ path, config: {
      method: 'POST',
      body: bodydata
    }, acceptType });
    return res;
}
export const postGenericJson =  async <T>(
  { path, bodydata, acceptType } : IAPISearchProps
  ) : Promise<T|null> => {
    const res = await postGeneric({ path, bodydata, acceptType });
    return res.data?.json();
}
export const postGenericBlob =  async (
  { path, bodydata, acceptType } : IAPISearchProps
  ) : Promise<Blob|ResponseError|null> => {
    const res = await postGeneric<Blob>({ path, bodydata, acceptType });
    return res.status ? res.data?.blob() : res.data?.json();
}