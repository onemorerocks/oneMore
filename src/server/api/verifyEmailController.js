import Auth from '../backend/Auth';

const authService = new Auth();

export default function verifyEmailController(req, reply) {

  const email = req.query.email;
  const emailKey = req.query.key;

  const promsie = authService.verifyEmail(email, emailKey).then((didVerify) => {
    const response = req.generateResponse();
    return response.redirect('/');
  });

  reply(promsie);
}
