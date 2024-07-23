import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'store.plugn.community',
  appName: 'plugn-store',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
