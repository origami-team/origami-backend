module.exports = {
  secret: 'ksjkdasjdla983024832(=)($=)"(§08iaskjld09238")=§2d',
  refresh_token: {
    secret: "I ALSO WANT TO BE CHANGED",
    algorithm: "sha256",
    validity_ms: 604800000, // 1 week
  },
  jwt: {
    secret: 'ksjkdasjdla983024832(=)($=)"(§08iaskjld09238")=§2d', // should be at least 32 characters
    algorithm: "HS256",
    validity_ms: 3600000, // 1 hour
    issuer: "", // usually the base url of the api. generated if not set from api_protocol and api_base_domain.
  },
};
