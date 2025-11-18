import { useEffect, useRef } from 'react';

/**
 * Hook personalizado para auto-refresh de datos
 * @param {Function} callback - Función a ejecutar en cada refresh
 * @param {number} interval - Intervalo en segundos (default: 30)
 * @param {boolean} enabled - Si el auto-refresh está habilitado (default: true)
 */
export function useAutoRefresh(callback, interval = 30, enabled = true) {
  const savedCallback = useRef();
  const intervalRef = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!enabled) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      return;
    }

    function tick() {
      savedCallback.current?.();
    }

    intervalRef.current = setInterval(tick, interval * 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [interval, enabled]);

  return () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };
}