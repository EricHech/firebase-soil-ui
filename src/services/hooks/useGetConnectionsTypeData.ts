import { useState, useEffect, useMemo } from "react";
import type { SoilDatabase, Data } from "firebase-soil";
import { GetDataListHookProps } from "./types";
import { getConnectionTypeData } from "firebase-soil/client";

export const useGetConnectionsTypeData = <T2 extends keyof SoilDatabase, T3 extends keyof SoilDatabase>({
  parentType,
  parentKey,
  dataType,
  includeArray = false,
  enabled = true,
  maintainWhenDisabled = false,
  deps = [],
}: GetDataListHookProps<T2> & {
  parentType: T3;
  parentKey: Maybe<string>;
}) => {
  const [data, setData] = useState<Maybe<Nullable<Record<string, Data<T2>>>>>();

  useEffect(() => {
    if (parentKey && enabled) {
      getConnectionTypeData({
        parentType,
        parentKey,
        dataType,
      }).then((d) => {
        setData(
          d.length === 0
            ? null
            : d.reduce((p, curr) => {
                if (!curr) return p;
                curr;
                p[curr.key] = curr;
                return p;
              }, {} as Record<string, Data<T2>>)
        );
      });

      return () => {
        if (!maintainWhenDisabled) setData(undefined);
      };
    }

    return undefined;
  }, [parentType, parentKey, dataType, enabled, maintainWhenDisabled, ...deps]);

  const dataArray = useMemo(
    () =>
      includeArray
        ? Object.entries(data || {}).map(([key, val]) => ({ ...val, key } as unknown as Mandate<Data<T2>, "key">))
        : [],
    [includeArray, data]
  );

  return {
    data,
    dataArray,
  };
};
