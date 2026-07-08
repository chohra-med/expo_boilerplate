/**
 * useScreenTracking — nav-container hook that emits SCREEN_VIEW on enter and
 * SCREEN_EXIT (with time_on_screen_ms) on leave, deduping repeat fires of the
 * same route.
 *
 * Wiring: call once in the NavigationContainer and pass the returned handler to
 * `onStateChange`, giving it the resolved current route name.
 *
 *   const { onScreenChange } = useScreenTracking();
 *   <NavigationContainer onStateChange={() => onScreenChange(currentRouteName)} />
 *
 * SCREEN_VIEW goes through analytics.trackScreen() (the reserved Firebase
 * screen_view) so we never double-log it as a custom event.
 */

import { useCallback, useRef } from "react";

import { analytics } from "./analytics";
import { EVENTS } from "./events";

export const useScreenTracking = () => {
  const currentScreen = useRef<string | undefined>(undefined);
  const enteredAt = useRef<number>(0);

  const onScreenChange = useCallback((screenName?: string) => {
    if (!screenName) {
      return;
    }
    // dedupe: same route fired again (e.g. param change) is not a new view
    if (screenName === currentScreen.current) {
      return;
    }

    const now = Date.now();

    if (currentScreen.current) {
      analytics.track(EVENTS.SCREEN_EXIT, {
        screen_name: currentScreen.current,
        time_on_screen_ms: now - enteredAt.current,
      });
    }

    analytics.trackScreen(screenName);

    currentScreen.current = screenName;
    enteredAt.current = now;
  }, []);

  return { onScreenChange };
};
