import { RAWG_API_KEY } from '$env/static/private';
import { createRawgClient } from './rawgClient.js';

export const rawg = createRawgClient({ apiKey: RAWG_API_KEY });
