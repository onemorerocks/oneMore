export default function brosController(req, reply) {
  reply('yeah bro ' + req.auth.credentials.email);
}
