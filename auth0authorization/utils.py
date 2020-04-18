import json
import os

from django.contrib.auth import authenticate
import jwt
import requests


# maps the 'sub' field from the 'access_token'
def jwt_get_username_from_payload_handler(payload):
    username = payload.get('sub').replace('|', '.')
    authenticate(remote_user=username)
    return username

# fetch the JWKS from Auth0 account to verify and decode the incoming AccessToken
# JSON Web Key Set (JWKS): a set of keys which contains the public keys used to verify any JSON Web Token (JWT) issued by the authorization server
# https://dj-react-1.eu.auth0.com/.well-known/jwks.json
def jwt_decode_token(token, context=None):
    header = jwt.get_unverified_header(token)
    jwks = requests.get(
        f"https://{os.getenv('AUTH0_DOMAIN')}/.well-known/jwks.json").json()
    public_key = None
    for jwk in jwks['keys']:
        if jwk['kid'] == header['kid']:
            public_key = jwt.algorithms.RSAAlgorithm.from_jwk(json.dumps(jwk))

    if public_key is None:
        raise Exception('Public key not found.')

    return jwt.decode(token,
                      public_key,
                      audience=os.getenv('AUTH0_AUDIENCE'),
                      issuer=f"https://{os.getenv('AUTH0_DOMAIN')}/",
                      algorithms=['RS256'])
