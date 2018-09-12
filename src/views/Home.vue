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

const rowHeight = 265
const toolBarHeight = 56
const prefetchRows = 2

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
      'getStoryIds'
    ]),
    getPaginatedIds () {
      return this.getStoryIds.slice().sort().reverse().slice(0, this.getMaxRowsPerPage * this.maxScrolledPage)
    },
    getMaxRowsPerPage () {
      return Math.ceil((window.innerHeight - toolBarHeight) / rowHeight) + prefetchRows
    }
  },
  methods: {
    setup (name) {
      this.$store.dispatch('setActiveScope', { name })
      this.$store.dispatch('syncHWNewStoryIDs', { name })
    },
    updateScrollPage () {
      console.log(`updateScrollPage`)
      this.loading = true
      this.maxScrolledPage++
      this.loading = false
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => vm.setup.bind(vm)(to.params.name))
  },
  beforeRouteUpdate (to, from, next) {
    this.setup(to.params.name)
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
