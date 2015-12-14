import Auth from '../backend/auth';

const TWO_WEEKS = 1000 * 60 * 60 * 24 * 14;

export default function loginController(req, reply) {

  const email = req.payload.email;
  const password = req.payload.password;

  const promise = new Auth().login(email, password).then((result) => {
    if (result) {
      reply('Hello').state('token', result, {
        isHttpOnly: true,
        ttl: TWO_WEEKS
      });
    } else {
      reply('Sorry, that login sucks.').code(401);
    }
  });

  reply(promise);
}
