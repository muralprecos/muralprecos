import { useAppSelector } from "@/store/store";
import { useDispatch } from "react-redux";
import { setLabel } from "@/store/features/cotacao-label-cache-slice";

type LabelResolver = (id: string) => Promise<string | null>;

const inFlight = new Map<string, Promise<string | null>>();

export function useLabelCache() {
  const dispatch = useDispatch();
  const labelCache = useAppSelector(
    (state) => state.cotacaoLabelCacheReducer.labelCache
  );

  const getLabel = (field: string, id: string | null | undefined) => {
    if (!field || !id) return undefined;
    return labelCache[field]?.[id];
  };

  const setLabelValue = (field: string, id: string, label: string) => {
    if (!field || !id) return;
    dispatch(setLabel({ field, id, label }));
  };

  const ensureLabel = async (
    field: string,
    id: string | null | undefined,
    resolver?: LabelResolver
  ) => {
    if (!field || !id || !resolver) return;
    if (getLabel(field, id)) return;

    const key = `${field}:${id}`;
    if (inFlight.has(key)) return;

    const promise = resolver(id)
      .then((label) => {
        if (label) {
          dispatch(setLabel({ field, id, label }));
        }
        return label;
      })
      .finally(() => {
        inFlight.delete(key);
      });

    inFlight.set(key, promise);
    return promise;
  };

  return {
    getLabel,
    setLabel: setLabelValue,
    ensureLabel,
  };
}
