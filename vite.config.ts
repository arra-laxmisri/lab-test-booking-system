export default defineConfig(() => {
  return {
    base: '/lab-test-booking-system/',

    plugins: [react(), tailwindcss(), expressApiPlugin()],

    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },

    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
