import { useState, useEffect } from "react";
import type { FirebaseHechDatabase, Data } from "firebase-hech";
import { onDataKeyValue } from "firebase-hech/client";

export const useOnDataKeyValue = <T2 extends keyof FirebaseHechDatabase>({
  dataType,
  dataKey,
  initialized,
}: {
  dataType: T2;
  dataKey: Maybe<Nullable<string>>;
  initialized: boolean;
}) => {
  const [data, setData] = useState<Nullable<Data<T2>>>();

  useEffect(() => {
    let off: Maybe<VoidFunction>;
    if (initialized && dataKey) off = onDataKeyValue({ dataType, dataKey, cb: setData });

    return () => {
      off?.();
      setData(undefined);
    };
  }, [initialized, dataType, dataKey]);

  return data;
};
