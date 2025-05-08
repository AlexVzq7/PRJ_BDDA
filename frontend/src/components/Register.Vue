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
export default{
    data(){
        return { surname:'',firstname:'',email:'',password:'',message:''};
    },
    methods:{
        async register(){
            try{
                const res = await axios.post('http://localhost:3000/register',{
                    surname: this.surname,firstname:this.firstname, email:this.email,password: this.password
                });
                this.message = red.data.message;
            }catch(err){
                this.message = err.response?.data?error || "Erreur";
            }
        }
    }
}
</script>