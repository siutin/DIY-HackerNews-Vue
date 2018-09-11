<template>
  <v-slide-y-transition mode="out-in">
    <div class="home">
      <v-list>
        <template v-for="(id, index) in getPaginatedIds">
          <row-item :index="index" :id="id" :max-scrolled-page="maxScrolledPage" :max-rows-per-page="getMaxRowsPerPage" v-bind:key="index" />
        </template>
        <v-layout align-center justify-center>
          <mugen-scroll :handler="updateScrollPage" :should-handle="!loading">
            <v-progress-circular :indeterminate="true"></v-progress-circular>
          </mugen-scroll>
        </v-layout>
      </v-list>
    </div>
  </v-slide-y-transition>
</template>

<script>
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
      return this.getStoreIds.slice().sort().reverse().slice(0, this.getMaxRowsPerPage * this.maxScrolledPage)
    },
    getMaxRowsPerPage () {
      return Math.ceil((window.innerHeight - 56) / rowHeight) + 1
    }
  },
  methods: {
    onRefreshClicked () {
      console.log('onRefreshClicked')
      this.updateData(this)
    },
    syncData (vm, name) {
      vm.$store.dispatch('syncHWNewStoreIDs', { name })
    },
    setActiveScope (vm, name) {
      vm.$store.dispatch('setActiveScope', { name })
    },
    updateScrollPage () {
      console.log(`updateScrollPage`)
      this.loading = true
      this.maxScrolledPage++
      this.loading = false
    }
  },
  beforeRouteEnter (to, from, next) {
    let name = to.params.name
    next(vm => {
      vm.setActiveScope(vm, name)
      vm.syncData(vm, name)
    })
  },
  beforeRouteUpdate (to, from, next) {
    let name = to.params.name
    this.setActiveScope(this, name)
    this.syncData(this, name)
    next()
  },
  mounted () {
    this.updateScrollPage()
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.home {
   overflow: hidden;
}

</style>
