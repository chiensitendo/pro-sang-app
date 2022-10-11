import 'antd/dist/antd.css';
import 'draft-js/dist/Draft.css';
import '../styles/globals.css';
import '../styles/colors.scss';
import '../styles/editor_styles.scss';
import '../styles/text.scss';
import type { AppProps } from 'next/app'
import {Provider} from "react-redux";
import store from "../redux/store";

function MyApp({ Component, pageProps }: AppProps) {
  return <Provider store={store}><Component {...pageProps} /></Provider>
}

export default MyApp
