export const loginUser = async (email, password) => {
  const res = await fetch("http://localhost:5000/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Login failed");
  return data;
};

export const isLoggedIn = () => {
  return !!localStorage.getItem("token");
};

export const logout = () => {
  localStorage.removeItem("token");
};
/**
 * @param {object} birthDetails - optional { dateOfBirth, timeOfBirth, placeOfBirth }
 */
export const registerUser = async (name, email, password, birthDetails = null) => {
  const body = { name, email, password };
  if (birthDetails && (birthDetails.dateOfBirth || birthDetails.timeOfBirth || birthDetails.placeOfBirth)) {
    body.dateOfBirth = birthDetails.dateOfBirth || "";
    body.timeOfBirth = birthDetails.timeOfBirth || "";
    body.placeOfBirth = birthDetails.placeOfBirth || "";
  }
  const res = await fetch("http://localhost:5000/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Registration failed");
  return data;
};

