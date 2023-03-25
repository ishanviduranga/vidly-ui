// import * as Sentry from "@sentry/react";
// import { BrowserTracing } from "@sentry/tracing";

function init() {
  // Sentry.init({
  //   dsn: "https://ca0fa92c4f3045a4a5ddacc3c0fdf918@o4504824299257856.ingest.sentry.io/4504824304959488",
  //   integrations: [new BrowserTracing()],
  //   tracesSampleRate: 1.0,
  // });
}

function log(error) {
  console.log(error)
  // Sentry.captureException(error);
}

const logService = {
  init,
  log
}

export default logService;