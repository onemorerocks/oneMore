import cookies from '../backend/cookies';

export default function logoutController(req, reply) {

  const response = req.generateResponse();
  response.redirect('/').permanent(true);
  cookies.clear(response);
  reply(response);

}
