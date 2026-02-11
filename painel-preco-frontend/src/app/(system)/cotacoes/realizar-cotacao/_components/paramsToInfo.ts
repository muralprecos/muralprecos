import { IAPISearchInfo } from "@/interfaces/types";

export const paramsToInfo = (params: URLSearchParams): IAPISearchInfo[] => {
  const info: IAPISearchInfo[] = [];
  params.forEach((val, key) => {
    info.push({ param: key, val });
  });
  return info;
};
