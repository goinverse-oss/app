let _payload = {};
let _error = null;

export function __setPayload(payload) {
  _payload = payload;
}

export function __setError(error) {
  _error = error;
}

export function createClient() {
  return {
    getEntries: async () => {
      if (_error) {
        throw _error;
      }
      return _payload;
    },
  };
}

export default {
  createClient,
  __setPayload,
  __setError,
};
