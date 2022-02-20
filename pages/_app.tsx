import '../styles/globals.css'
import 'bootstrap/dist/css/bootstrap.css';
import 'react-notifications/lib/notifications.css';
import type { AppProps } from 'next/app'
import { App } from '../components/App';

const { NotificationContainer }: any = require('react-notifications');

function MyApp({ Component, pageProps, ...other }: any) {
  console.log("🚀 ~ file: _app.tsx ~ line 10 ~ MyApp ~ other", other)
  console.log("🚀 ~ file: _app.tsx ~ line 10 ~ MyApp ~ pageProps", pageProps)
  console.log("🚀 ~ file: _app.tsx ~ line 10 ~ MyApp ~ Component", Component)

  return <App>
    <Component {...pageProps} />
    <NotificationContainer />
  </App>
}

export default MyApp
