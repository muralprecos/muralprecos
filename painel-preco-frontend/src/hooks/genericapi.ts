import { mountUrl } from "@/utils/requestUtils";
import { IAPISearchProps, IReturnRequestAPI, ISimpleObjetoAPI } from "@/interfaces/types";
import logger from "../../services/logger";

export const HOST_API = `${process.env.API_URL}`;
export const HOST_API_PREFIX = `${process.env.API_URL_PREFIX || '/v1'}`;
export const revalidate = 3600; // revalida os dados a cada hora

export interface ResponseReq {
  status: boolean,
  statusCode: number | null,
  statusText: string | null,
  statusDetails: string | null,
  data?: Response | null
};

export type ResponseError = {
  error: string
  path: string
  status: number
  timestamp: string
}

export function isResponseReq(object: any): object is ResponseReq {
  return 'statusCode' in object;
}

const doReq = async (
  { path, page, size, info, filterFields, config, contentType = 'application/json', acceptType = 'application/json', accessToken } : IAPISearchProps) : Promise<ResponseReq> => {
    try {
      const HEADERS : HeadersInit = {}

      if (!!contentType) { HEADERS['Content-Type'] = contentType; }
      if (!!acceptType) { HEADERS['Accept'] = acceptType; }
      if (!!accessToken) { HEADERS['Authorization'] = `Bearer ${accessToken}`; }

      const reqOpts = { 
        //TODO: aprimorar cache de requisições e adicionar body
        // cache: 'force-cache',
        next: { revalidate },
        headers: new Headers(HEADERS),
        ...config
      }
      const url = mountUrl({ host: HOST_API, path, page, size, info, filterFields});
      //console.log('Doing request client: ' + url)
      //logger.info('Doing request: ' + url);
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
                //logger.error(`Retorno de erro durante request. Path: ${url}. Opts: ${JSON.stringify(reqOpts)}. Response status: ${result.statusCode}. Error Name: ${result.statusText}.`);
                throw result;
            }
        }).catch((error: Error | ResponseReq) => {
          const isTypeError = error instanceof Error;
            const result: ResponseReq = {
                status: isTypeError ? false : error.status,
                statusCode: isTypeError ? 599 : error.statusCode,
                statusText: isTypeError ? error.name : error.statusText,
                statusDetails: isTypeError ? error.message : error.statusDetails,
                data: isTypeError ? null : error.data
            }
            logger.error(`Throw error durante request. Path: ${url}. Opts: ${JSON.stringify(reqOpts)}. Response status: ${result.statusCode}. Error Name: ${result.statusText}.`);
            throw result;
        });
        return res;
    } catch (error) {
      // logger.error(`Throw error antes do fetch da request:`);
      // logger.error(error);
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

const reqBodyGeneric =  async <T>(
  { path, bodydata, acceptType, contentType, accessToken, method } : IAPISearchProps & { method: 'PUT' | 'POST' }
  ) : Promise<ResponseReq> => {
    const res = await doReq({ path, config: {
      method,
      body: bodydata
    }, acceptType, contentType, accessToken });
    return res;
}
export const postGenericJson =  async <T>(
  { path, bodydata, acceptType, contentType, accessToken } : IAPISearchProps
  ) : Promise<T|null> => {
    const res = await reqBodyGeneric({ path, bodydata, acceptType, contentType, accessToken, method: 'POST' });
    return res.data?.json();
}

export const postGenericBlob =  async (
  { path, bodydata, acceptType, accessToken } : IAPISearchProps
  ) : Promise<Blob|ResponseError|null> => {
    try {
      const res = await reqBodyGeneric<Blob>({ path, bodydata, acceptType, accessToken, method: 'POST' });
      return res.status ? res.data?.blob() : res.data?.json();
    } catch (e) {
      throw new Error('Ocorreu um problema na requisição para o servidor.');
    }
    return null;
}

export const getObjectDesc = async <T extends ISimpleObjetoAPI>(props: IAPISearchProps, getList: (props: IAPISearchProps) => Promise<IReturnRequestAPI<T> | null>) : Promise<string | null> => {
  const list = await getList(props);
  return list != null && list.content != null && list?.content.length > 0 ? list.content[0].nome : null;
}