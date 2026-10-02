import 'dotenv/config';
import {createApp} from './app.js';

const port = Number(process.env.API_PORT || 3001);
// The development inbox must never be reachable directly through a public interface.
createApp().listen(port, '127.0.0.1', () => {
  console.info(`Lead API listening on port ${port}; development inbox ${process.env.ENABLE_DEV_LEADS === '1' && process.env.NODE_ENV !== 'production' ? 'enabled' : 'disabled'}`);
});
