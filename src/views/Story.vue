<template>
  <div class="story">
    <v-progress-circular v-if="loading" :indeterminate="true"></v-progress-circular>
    <v-list subheader three-line>
      <div class="content">
          <div>{{ item.title }}</div>
          <div v-html="item.text"></div>
          <span class="grey--text">{{ formatPostedAt(item) }} | @{{ item.by }}</span>
      </div>
      <div v-for="(subItem, index) in getCleanUpSubItems" :key="index">
        <v-divider></v-divider>
        <div class="content">
          <div v-html="subItem.text"></div>
          <span class="grey--text">{{ formatPostedAt(subItem) }} | @{{ subItem.by }}</span>
        </div>
      </div>
    </v-list>
  </div>
</template>

<script>
import Vue from 'vue'
import moment from 'moment'

export default {
  name: 'Story',
  components: {},
  data () {
    return {
      id: -1,
      loading: false,
      item: {},
      subItems: [],
      orderedIds: []
    }
  },
  computed: {
    getKids () { return this.item.kids },
    getCleanUpSubItems () {
      return this.subItems.filter(subItem => !subItem.deleted).slice().sort((a, b) => {
        return this.orderedIds.indexOf(a.id) - this.orderedIds.indexOf(b.id)
      })
    }
  },
  methods: {
    formatPostedAt (item) { return moment.unix(item.time).fromNow() },
    onApiComplete (data) {
      console.log(`onApiComplete`)
      this.item = data
      this.$store.dispatch('setAppTitle', {
        title: this.item.title
      })
      this.loading = false
      Vue._.each(data.kids, kid => this.orderedIds.push(kid))

      this.walkThroughComments(data)
    },
    walkThroughComments (data) {
      if (data.id !== this.id) {
        let index = Vue._.findIndex(this.orderedIds, oid => oid === data.id)
        console.log(`index: ${index} id: ${data.id} parentId: ${data.parent} this.orderedIds: ${this.orderedIds}`)
        if (index !== -1) {
          if (data.kids) {
            console.log(`detect kids (id: ${data.id} parentId: ${data.parent}) kids: ${data.kids}`);
            [].splice.apply(this.orderedIds, [index + 1, 0].concat(data.kids))
          }
        } else {
          console.log(`bug? id not found (id: ${data.id} parentId: ${data.parent}) this.orderedIds: ${this.orderedIds}`)
        }
        this.subItems.push(data)
      }

      Vue._.each(data.kids, kid => {
        this.$store.dispatch('syncHWStory', {
          id: kid,
          callback: this.walkThroughComments
        })
      })
    },
    syncData (vm) {
      this.loading = false
      vm.$store.dispatch('syncHWStory', {
        id: this.id,
        callback: this.onApiComplete
      })
    }
  },
  beforeRouteEnter (to, from, next) {
    let id = to.params.id
    if (id) {
      next(vm => {
        vm.id = id
        vm.syncData(vm)
      })
    }
  },
  beforeRouteUpdate (to, from, next) {
    let id = to.params.id
    if (id) {
      this.id = id
      this.syncData(this)
      next()
    }
  },
  beforeRouteLeave (to, from, next) {
    this.$store.dispatch('setAppTitle', {
      title: ''
    })
    next()
  }
}
</script>

<style scoped lang="scss">
  .story {
    .content {
      line-height: 1.5;
      padding: 10pt;
    }
  }

</style>
