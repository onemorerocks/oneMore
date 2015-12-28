import Auth from '../backend/auth';

const authService = new Auth();

export default function verifyEmailController(req, reply) {

  const email = req.query.email;
  const emailKey = req.query.key;

  const promsie = authService.verifyEmail(email, emailKey).then((didVerify) => {
    return req.generateResponse().redirect('/');
  });

  reply(promsie);
}
