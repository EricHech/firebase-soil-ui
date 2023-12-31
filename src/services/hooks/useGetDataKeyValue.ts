import { useState, useEffect } from "react";
import type { SoilDatabase, StatefulData } from "firebase-soil";
import { getDataKeyValue } from "firebase-soil/client";

export const useGetDataKeyValue = <T2 extends keyof SoilDatabase>(dataType: T2, dataKey: string) => {
  const [data, setData] = useState<StatefulData<T2>>();

  useEffect(() => {
    getDataKeyValue({ dataType, dataKey }).then(setData);
  }, [dataType, dataKey]);

  return data;
};
