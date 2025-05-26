<template>
    <form @submit.prevent="register">
        <input v-model="surname" placeholder="Nom" required/>
        <input v-model="firstname" placeholder="Prénom" required/>
        <input v-model="email" placeholder="Email" required/>
        <input v-model="password" placeholder="Mot de passe" required/>
        <button type="submit">Créer un compte</button>
        <div v-if="message">{{ message }}</div>
    </form>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            surname: '',
            firstname: '',
            email: '',
            password: '',
            message: ''
        };
    },
    methods: {
        async register() {
            alert("Début de la fonction register");
            try {
                const res = await axios.post('http://localhost:3000/register', {
                    surname: this.surname,
                    firstname: this.firstname,
                    email: this.email,
                    password: this.password
                });
                console.log("Réponse reçue :", res);
                this.message = res.data.message || "Compte créé avec succès";

                console.log("Bientôt l'envoi");  // <-- ça doit s'afficher ici

                setTimeout(() => {
                    console.log("Redirection maintenant");
                    this.$router.push('/login');
                }, 3000);

            } catch (err) {
                console.error("Erreur lors de l'inscription :", err);
                this.message = err.response?.data?.error || "Erreur";
            }
        }

    }
}
</script>
