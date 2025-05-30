export const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  return token && user.role === "admin";
};

export const getToken = () => {
  return localStorage.getItem("token");
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  // Don't remove rememberedUser here to maintain the remember me functionality
  window.location.href = "/admin/login";
};
