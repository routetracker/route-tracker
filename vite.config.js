import react from '@vitejs/plugin-react';
import { loadEnv } from 'vite';

export default ({ mode }) => {
  const isProduction = mode === 'production';
  const env = loadEnv(mode, process.cwd());

  return {
    base: '/route-tracker/',
    plugins: [react()],
    define: {
      'process.env': {
        VITE_API_KEY: JSON.stringify(env.VITE_API_KEY),
      },
    },
  };
};