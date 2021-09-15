import '../styles/globals.css';
import { ThemeProvider, CssBaseline } from '@material-ui/core';
import type { AppContext, AppProps } from 'next/app';
import theme from '../utils/theme';
import { useEffect } from 'react';
import { SSRCookies, SSRKeycloakProvider } from '@react-keycloak/ssr';
import { KEYCLOAK_PUBLIC_CONFIG } from '../utils/auth';
import { parseCookies } from '../utils/cookies';

function MyApp({ Component, pageProps, cookies }: AppProps & { cookies: any }) {
  useEffect(() => {
    const jssStyles = document.querySelector('#jss-server-side');
    jssStyles?.parentElement?.removeChild(jssStyles);
  }, []);

  return (
    <SSRKeycloakProvider
      keycloakConfig={KEYCLOAK_PUBLIC_CONFIG}
      persistor={SSRCookies(cookies)}
      initOptions={{
        onLoad: 'check-sso',
        silentCheckSsoRedirectUri:
          typeof window !== 'undefined'
            ? `${window.location.origin}/silent-check-sso.html`
            : null,
      }}
    >
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Component {...pageProps} />
      </ThemeProvider>
    </SSRKeycloakProvider>
  );
}

MyApp.getInitialProps = async (appContent: AppContext) => {
  return {
    cookies: parseCookies(appContent.ctx.req),
  };
};

export default MyApp;
