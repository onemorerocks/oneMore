import { reIndex } from '../backend/dataService';

export function reIndexController(req, reply) {
  reply(reIndex());
}
