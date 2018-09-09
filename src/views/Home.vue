<template>
  <v-card class="home">
    <v-container fluid grid-list-lg>
      <v-slide-y-transition mode="out-in">
        <v-layout row wrap align-center justify-center>
         <v-flex xs12 v-for="(id, index) in getPaginatedIds" :key="index">
           <row-item :index="index" :id="id" :max-scrolled-page="maxScrolledPage" :max-rows-per-page="getMaxRowsPerPage" />
         </v-flex>
         <mugen-scroll :handler="updateScrollPage" :should-handle="!loading">
           <v-progress-circular :indeterminate="true"></v-progress-circular>
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
import RowItem from '@/components/RowItem.vue'

const rowHeight = 88
export default {
  name: 'Home',
  components: { RowItem, MugenScroll },
  data () {
    return {
      maxScrolledPage: 0,
      loading: true
    }
  },
  computed: {
    ...mapGetters([
      'getStoreIds'
    ]),
    getPaginatedIds () {
      return this.getStoreIds.sort().reverse().slice(0, this.getMaxRowsPerPage * this.maxScrolledPage)
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
    updateScrollPage () {
      console.log(`updateScrollPage`)
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
  },
  mounted () {
    this.updateScrollPage()
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.home {
   overflow-x: hidden;
}

</style>
