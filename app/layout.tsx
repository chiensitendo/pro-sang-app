import { ReduxProvider } from "@/providers/reduxProvider";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import { GqlProvider } from "@/providers/gqlProvider";
import { IntlClientProvider } from "@/providers/intlClientProvider";
import StyledComponentsRegistry from "@/libs/AntdRegistry";
import { CSSProperties } from "linaria";
import 'react-image-crop/dist/ReactCrop.css';
import "cropperjs/dist/cropper.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Minh Sang Application",
  description: "This application is belong to Minh Sang",
};

export function generateStaticParams() {
  return [{ locale: "en-US" }, { locale: "vi" }];
}
const proLoadingCssStyles: CSSProperties = {
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

export default async function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: any;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta
          name="description"
          content="Tạo lời nhạc miễn phí và cảm nhận của mình của mình về nó. Khi bạn cần hát cho ai đó hoặc hát một mình, bạn chỉ việc vào trang và xem!"
        />
        <meta
          name="google-site-verification"
          content="W8kc4WlU1OO_I76CmgndqrjA0JXtU4N3I_HrigWRaSE"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Sofia"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin = "anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Sofia|Trirong|Audiowide|Tangerine|Roboto|Dancing+Script|Noto+Sans+JP|Noto+Music"
        />
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossOrigin="anonymous"></link>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Sarabun&display=swap" rel="stylesheet"></link>
        <Script
          id="google-tag-manager"
          strategy="afterInteractive"
        >{`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                })(window,document,'script','dataLayer','GTM-PH7WZ8V');`}</Script>
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-W8K7JKM5D0"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
                    function gtag(){window.dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', 'G-W8K7JKM5D0');`}
        </Script>
      </head>

      <body className={inter.className}>
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-PH7WZ8V"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          ></iframe>
        </noscript>
        <div id="pro-loading" hidden style={proLoadingCssStyles}>
          <div className="lds-hourglass"></div>
        </div>
        <ReduxProvider>
          <GqlProvider>
            <IntlClientProvider locale={!locale ? "en-US" : locale}>
              <StyledComponentsRegistry>
                {children}
              </StyledComponentsRegistry>
            </IntlClientProvider>
          </GqlProvider>
        </ReduxProvider>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" async integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossOrigin="anonymous"></script>
      </body>
    </html>
  );
}
