import { Html, Head, Main, NextScript } from 'next/document'
import {CSSProperties} from "react";

export default function Document() {
    const proLoadingCssStyles:  CSSProperties = {
        zIndex: -1,
        position: 'fixed',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        top: '0',
        left: '0',
        background: 'rgba(0,0,0,0.4)'
    }
    return (
        <Html>
            <Head>
                <meta charSet="utf-8"/>
                <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Sofia"/>
                <link rel="preconnect" href="https://fonts.googleapis.com"/>
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin={"true"}/>
                <link href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap" rel="stylesheet"/>
                <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Sofia|Trirong|Audiowide|Tangerine|Roboto|Dancing+Script|Noto+Sans+JP|Noto+Music"/>
            </Head>
        <body>
            <div id="pro-loading" hidden style={proLoadingCssStyles}>
                <div className="lds-hourglass"></div>
            </div>
            <Main />
        <NextScript />
        </body>
        </Html>
    )
}