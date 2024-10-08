import { Dispatch, SetStateAction, useCallback, useEffect, useMemo, useState } from "react";
import type { FirebaseHechDatabase, Data, ConnectionDataListDatabase } from "firebase-hech";
import { onPublicDataTypeListChildChanged } from "../helpers/onPublicDataTypeListChildChanged";
import { OnDataListHookProps } from "./types";
import { setStateFirebaseLists, firebaseHechHydrateAndSetStateFirebaseLists } from "../helpers/utils";
import { getPublicTypeData } from "firebase-hech/client";

export const useOnPublicTypeData = <T2 extends keyof FirebaseHechDatabase, Poke extends boolean>({
  dataType,
  poke,
  includeArray = false,
  enabled = true,
  maintainWhenDisabled = false,
  deps = [],
}: OnDataListHookProps<T2, Poke>) => {
  const [data, setData] = useState<Maybe<Nullable<Record<string, Data<T2>>>>>(poke ? undefined : {});

  const childChanged = useCallback(
    async (_: number, key: string, previousOrderingKey: Maybe<Nullable<string>>) =>
      firebaseHechHydrateAndSetStateFirebaseLists(dataType, setData, key, previousOrderingKey),
    [dataType]
  );

  const childRemoved = useCallback((key: string) => setStateFirebaseLists(setData, null, key, undefined), []);

  useEffect(() => {
    let off: Maybe<VoidFunction> = undefined;

    if (enabled) {
      const turnOn = () => onPublicDataTypeListChildChanged(dataType, childChanged, childRemoved);

      if (poke) {
        getPublicTypeData({
          dataType,
        }).then((d) => {
          setData(
            d.length === 0
              ? null
              : d.reduce((p, curr) => {
                  if (!curr) return p;
                  p[curr.key] = curr;
                  return p;
                }, {} as Record<string, Data<T2>>)
          );

          off = turnOn();
        });
      } else {
        off = turnOn();
      }
    }

    return () => {
      off?.();
      if (!maintainWhenDisabled) setData(poke ? undefined : {});
    };
  }, [dataType, childChanged, childRemoved, enabled, maintainWhenDisabled, poke, ...deps]);

  const dataArray = useMemo(
    () =>
      includeArray
        ? Object.entries(data || {}).map(([key, val]) => ({ ...val, key } as unknown as Mandate<Data<T2>, "key">))
        : [],
    [data, includeArray]
  );

  return {
    data: data as Poke extends true ? Maybe<Nullable<Record<string, Data<T2>>>> : Record<string, Data<T2>>,
    dataArray,
  };
};
