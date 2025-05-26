<template>
  <div class="admin-view">
    <h1>Interface Administrateur</h1>
    <AdminUserList />
  </div>
</template>

<script>
import AdminUserList from '../components/AdminUserList.vue';

export default {
  name: 'AdminView',
  components: {
    AdminUserList
  }
};
</script>
