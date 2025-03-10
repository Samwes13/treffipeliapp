import React from 'react';
import { Platform, View, StyleSheet } from 'react-native';

const AdSenseBanner = () => {
  // AdSense-koodi
  const adSenseCode = `
    <!DOCTYPE html>
    <html>
      <head>
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7869485729301293"
          crossorigin="anonymous"></script>
        <script>
          (adsbygoogle = window.adsbygoogle || []).push({});
        </script>
      </head>
      <body style="margin:0;padding:0;">
        <ins class="adsbygoogle"
          style="display:inline-block;width:320px;height:100px"
          data-ad-client="ca-pub-7869485729301293"
          data-ad-slot="1234567890"></ins>
      </body>
    </html>
  `;

  // Palauta iframe vain web-ympäristössä
  if (Platform.OS === 'web') {
    return (
      <View style={styles.container}>
        <iframe
          title="AdSense Banner"
          srcDoc={adSenseCode}
          style={styles.iframe}
          scrolling="no"
          frameBorder="0"
        />
      </View>
    );
  }

  // Mobiilialustoilla palauta tyhjä näkymä
  return null;
};

const styles = StyleSheet.create({
  container: {
    height: 100, // Suurempi korkeus
    width: '100%',
    marginVertical: 10,
  },
  iframe: {
    width: '100%',
    height: '100%',
    border: 'none',
  },
});

export default AdSenseBanner;