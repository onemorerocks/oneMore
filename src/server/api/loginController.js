import Auth from '../backend/Auth';
import cookies from '../backend/cookies';

export default function loginController(req, reply) {

  const email = req.payload.email;
  const password = req.payload.password;

  const promise = new Auth().login(email, password).then((result) => {
    const response = req.generateResponse();
    if (result) {
      response.code(200);
      const jwt = result.jwt;
      const emailValidated = result.emailValidated;
      cookies.decorateJwt(response, jwt);
      cookies.decorateGrant(response, emailValidated, email);
    } else {
      response.code(401);
    }
    return response;
  });

  reply(promise);
}
