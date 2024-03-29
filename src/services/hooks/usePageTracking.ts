import { useEffect } from "react";
import type { TrackingData } from "firebase-soil";
import { PATHS } from "firebase-soil/paths";
import { getCurrentUser, onDisconnect, pushKey, trackEvent } from "firebase-soil/client";
import { useSoilContext } from "../context/soilContext";

export const usePageTracking = (asPath: string, query: Record<string, string>) => {
  const { loggedIn, user } = useSoilContext();

  useEffect(() => {
    if (loggedIn) trackEvent("pageView", { path: asPath });
  }, [asPath, loggedIn]);

  useEffect(() => {
    if (user) {
      if (query.source) trackEvent(`source__${query.source}__ad__${query.ad}`);

      trackEvent("onConnect");
      onDisconnect<TrackingData>(`${PATHS.trackingKey("onDisconnect")}/${pushKey(PATHS.TRACKING)}`, {
        uid: getCurrentUser()?.uid ?? "unknown",
        createdAt: Date.now(),
        metadata: null,
      });
    }
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps
};
