<template>
  <nav class="navbar">
    <div class="nav-brand">
      <router-link to="/">Hospital Management</router-link>
    </div>
    <div class="nav-links">
      <router-link to="/patients" class="nav-link">Pacientes</router-link>
      <router-link to="/appointments" class="nav-link">Consultas</router-link>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'Navbar'
};
</script>

<style scoped>
.navbar {
  background-color: #2196F3;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-brand a {
  color: white;
  text-decoration: none;
  font-size: 1.5rem;
  font-weight: bold;
}

.nav-links {
  display: flex;
  gap: 1rem;
}

.nav-link {
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.nav-link:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.router-link-active {
  background-color: rgba(255, 255, 255, 0.2);
}
</style> 