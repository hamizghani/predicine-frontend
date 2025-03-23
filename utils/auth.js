export function login(username, password) {
  const envUsername = process.env.REACT_APP_USERNAME;
  const envPassword = process.env.REACT_APP_PASSWORD;

  if (username === envUsername && password === envPassword) {
    // Store "logged" state in localStorage
    localStorage.setItem("isLoggedIn", "true");
    return true;
  }

  return false;
}

export function logout() {
  localStorage.removeItem("isLoggedIn");
}

export function isAuthenticated() {
  return localStorage.getItem("isLoggedIn") === "true";
}
