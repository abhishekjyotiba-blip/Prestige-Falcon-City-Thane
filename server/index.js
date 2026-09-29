import 'dotenv/config';
import {createApp} from './app.js';

const port = Number(process.env.API_PORT || 3001);
createApp().listen(port, '0.0.0.0', () => {
  console.info(`Lead API listening on port ${port}; development inbox ${process.env.ENABLE_DEV_LEADS === '1' && process.env.NODE_ENV !== 'production' ? 'enabled' : 'disabled'}`);
});
