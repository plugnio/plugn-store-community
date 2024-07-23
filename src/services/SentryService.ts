import router from '@/router';
import * as Sentry from '@sentry/vue';
import { onErrorCaptured } from 'vue';

export function initSentry(app) {

    Sentry.init({
        app,
        dsn: process.env.VUE_APP_SENTRY_DNS,
        integrations: [
            new Sentry.BrowserTracing({
                routingInstrumentation: Sentry.vueRouterInstrumentation(router),
            }),
            new Sentry.Replay(),
        ],

        // Set tracesSampleRate to 1.0 to capture 100%
        // of transactions for performance monitoring.
        // We recommend adjusting this value in production
        tracesSampleRate: 1.0,

        // Set `tracePropagationTargets` to control for which URLs distributed tracing should be enabled
        tracePropagationTargets: ["localhost", /^https:\/\/api\.plugn\.io/, /^https:\/\/api\.dev\.plugn\.io/],

        // Capture Replay for 10% of all sessions,
        // plus for 100% of sessions with an error
        replaysSessionSampleRate: 0.1,
        replaysOnErrorSampleRate: 1.0,
    });
 
    // You can do the same thing using `addGlobalEventProcessor`
    /*Sentry.addGlobalEventProcessor((event: any) => {
  
        console.log(event);

        const chunkCssFailedMessage = /Loading CSS chunk [\d]+ failed/;
        const chunkJSFailedMessage = /Loading chunk [\d]+ failed/;

        if (chunkJSFailedMessage.test(event.message) || chunkCssFailedMessage.test(event.message)) {
            return window.location.reload();
        }

        // Add anything to the event here
        // returning `null` will drop the event
        return event;
    });*/
}
