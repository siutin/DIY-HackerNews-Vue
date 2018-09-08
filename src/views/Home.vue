<template>
  <v-card>
    <v-container fluid grid-list-lg>
      <v-slide-y-transition mode="out-in">
        <v-layout row wrap>

         <v-flex xs12 v-for="(item, id) in getStores">
           <v-card color="blue-grey darken-2" class="white--text">
             <v-card-title primary-title>
               <div class="headline">{{ id }} {{ item }}</div>
               </v-card-title>
           </v-card>
         </v-flex>

        </v-layout>
      </v-slide-y-transition>
    </v-container>
  </v-card>
</template>

<script>
  import { mapGetters } from 'vuex'
  export default {
    name: 'Home',
    data () {
      return {}
    },
    computed: {
      ...mapGetters([
        'getStores'
      ])
    },
    methods: {
      onRefreshClicked () {
        console.log('onRefreshClicked')
        this.updateData(this)
      },
      syncData (vm) {
        vm.$store.dispatch('syncHWNewStoreIDs')
      }
    },
    beforeRouteEnter (to, from, next) {
      next(vm => vm.syncData(vm))
    },
    beforeRouteUpdate (to, from, next) {
      next(vm => vm.syncData(vm))
    }
  }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
