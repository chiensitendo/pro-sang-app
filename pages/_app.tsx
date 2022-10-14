import 'antd/dist/antd.css';
import 'draft-js/dist/Draft.css';
import '../styles/globals.css';
import '../styles/colors.scss';
import '../styles/editor_styles.scss';
import '../styles/text.scss';
import type { AppProps } from 'next/app'
import {Provider} from "react-redux";
import store from "../redux/store";
import Script from "next/script";

function MyApp({ Component, pageProps }: AppProps) {
  return <Provider store={store}>
    <Script src="https://www.google-analytics.com/analytics.js" />
    <Component {...pageProps} /></Provider>
}

export default MyApp
