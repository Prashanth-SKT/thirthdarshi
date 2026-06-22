/** Logs only in development builds — stripped from release by Metro dead-code elimination. */
export function devLog(...args) {
  if (__DEV__) {

    console.log(...args);
  }
}
