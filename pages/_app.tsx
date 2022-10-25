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
    <Script id ="google-tag-manager" strategy="afterInteractive">{`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                })(window,document,'script','dataLayer','GTM-PH7WZ8V');`}</Script>
    <Script async src="https://www.googletagmanager.com/gtag/js?id=G-W8K7JKM5D0" strategy="afterInteractive"/>
    <Script id="google-analytics" strategy="afterInteractive">
      {`window.dataLayer = window.dataLayer || [];
                    function gtag(){window.dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', 'G-W8K7JKM5D0');`}
    </Script>
    <Component {...pageProps} />
  </Provider>
}

export default MyApp
