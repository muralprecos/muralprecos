import logger from "../../services/logger";
import { mountUrl } from "@/utils/requestUtils";
import { IAPISearchProps, IReturnRequestAPI, ISimpleObjetoAPI } from "@/interfaces/types";

const host = 'https://muraldeprecos.com';

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
  { path, page, size, info, filterFields, config, contentType = 'application/json', acceptType = 'application/json', auth } : IAPISearchProps) : Promise<ResponseReq> => {
    try {
      const HEADERS : HeadersInit = {}
      //'Authorization': `Bearer ${token}`
      if (!!contentType) { HEADERS['Content-Type'] = contentType; }
      if (!!acceptType) { HEADERS['Accept'] = acceptType; }
      if (!!auth && !!auth.access_token) { HEADERS['Authorization'] = `Bearer ${auth.access_token}`; }

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
  { page = 0, size = 50, ...rest } : IAPISearchProps
  ) : Promise<T|null> => {
    const res = await doReq({ page, size, ...rest });
    return res.data?.json();
}
export const getGenericListPageable =  async <T>(
    otps : IAPISearchProps
  ) : Promise<IReturnRequestAPI<T>|null> => {
  return getGenericObject(otps);
}

export const postGeneric =  async <T>(
  { path, bodydata, acceptType, contentType } : IAPISearchProps
  ) : Promise<ResponseReq> => {
    const res = await doReq({ path, config: {
      method: 'POST',
      body: bodydata
    }, acceptType, contentType });
    return res;
}
export const postGenericJson =  async <T>(
  { path, bodydata, acceptType, contentType } : IAPISearchProps
  ) : Promise<T|null> => {
    const res = await postGeneric({ path, bodydata, acceptType, contentType });
    return res.data?.json();
}
export const postGenericBlob =  async (
  { path, bodydata, acceptType } : IAPISearchProps
  ) : Promise<Blob|ResponseError|null> => {
    const res = await postGeneric<Blob>({ path, bodydata, acceptType });
    return res.status ? res.data?.blob() : res.data?.json();
}

export const getObjectDesc = async <T extends ISimpleObjetoAPI>(props: IAPISearchProps, getList: (props: IAPISearchProps) => Promise<IReturnRequestAPI<T> | null>) : Promise<string | null> => {
  const list = await getList(props);
  return list != null && list.content != null && list?.content.length > 0 ? list.content[0].nome : null;
}