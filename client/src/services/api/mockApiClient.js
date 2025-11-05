/**
 * Mock API client that simulates async HTTP requests with delays.
 * Returns promises to mimic real fetch/axios behavior.
 */

const MOCK_DELAY_MS = 500;

/**
 * Simulate an API call with configurable delay and response.
 * @param {object} options - { data, error, delay }
 * @returns {Promise} resolves with data or rejects with error
 */
export function mockApiCall({
  data = null,
  error = null,
  delay = MOCK_DELAY_MS,
} = {}) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (error) {
        reject(error);
      } else {
        resolve(data);
      }
    }, delay);
  });
}

/**
 * Simulate a successful API response.
 * @param {*} data - response data
 * @param {number} delay - delay in ms
 */
export function mockSuccess(data, delay = MOCK_DELAY_MS) {
  return mockApiCall({ data, delay });
}

/**
 * Simulate a failed API response.
 * @param {string|Error} error - error message or Error object
 * @param {number} delay - delay in ms
 */
export function mockError(error, delay = MOCK_DELAY_MS) {
  const err = typeof error === "string" ? new Error(error) : error;
  return mockApiCall({ error: err, delay });
}
