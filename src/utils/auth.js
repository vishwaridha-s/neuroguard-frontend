export function logout(navigate) {
  localStorage.clear();
  navigate('/');
}
