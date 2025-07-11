import Document, { Html, Head, Main, NextScript, DocumentContext } from 'next/document';

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html lang="en">
        <Head>
          <meta charSet="utf-8" />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <meta name="description" content="A video application for both Android and iOS" />
          <meta name="keywords" content="video, app, mobile, android, ios" />
          
          {/* PWA primary color */}
          <meta name="theme-color" content="#000000" />
          
          {/* Add to homescreen for Chrome on Android */}
          <meta name="mobile-web-app-capable" content="yes" />
          
          {/* Apple specific tags */}
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
          <meta name="apple-mobile-web-app-title" content="VidApp" />
          
          {/* Windows Phone */}
          <meta name="msapplication-TileColor" content="#000000" />
          
          {/* Splash screens for iOS */}
          <link
            rel="apple-touch-startup-image"
            href="/icons/icon-2.png"
            media="(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;