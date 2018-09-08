<template>
  <v-card>
    <v-container fluid grid-list-lg>
      <v-slide-y-transition mode="out-in">
        <v-layout row wrap>
         <v-flex xs12 v-for="(item, id) in getPaginatedList" :key="id">
           <v-card color="blue-grey darken-2" class="white--text">
             <v-card-title primary-title>
               <div class="headline">{{ id }} {{ item }} {{ maxScrolledPage }} {{ getMaxRowsPerPage }}</div>
               </v-card-title>
           </v-card>
         </v-flex>
         <mugen-scroll :handler="updatePaginatedData" :should-handle="!loading">
           loading...
         </mugen-scroll>
        </v-layout>
      </v-slide-y-transition>
    </v-container>
  </v-card>
</template>

<script>
  import Vue from 'vue'
  import MugenScroll from 'vue-mugen-scroll'
  import { mapGetters } from 'vuex'

  const rowHeight = 88
  export default {
    name: 'Home',
    components: { MugenScroll },
    data () {
      return {
        maxScrolledPage: 1,
        loading: false
      }
    },
    computed: {
      ...mapGetters([
        'getStores'
      ]),
      getPaginatedList () {
        let keys = Object.keys(this.getStores).sort().slice(0, this.getMaxRowsPerPage * this.maxScrolledPage)
        return Vue._.pick(this.getStores, keys)
      },
      getMaxRowsPerPage () {
        return Math.ceil((window.innerHeight - 56) / rowHeight)
      }
    },
    methods: {
      onRefreshClicked () {
        console.log('onRefreshClicked')
        this.updateData(this)
      },
      syncData (vm) {
        vm.$store.dispatch('syncHWNewStoreIDs')
      },
      updatePaginatedData () {
        this.loading = true
        this.maxScrolledPage++
        this.loading = false
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
