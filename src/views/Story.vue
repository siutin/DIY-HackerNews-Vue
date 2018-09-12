<template>
  <div class="story">
    <v-progress-circular v-if="loading" :indeterminate="true"></v-progress-circular>
    <v-list subheader three-line>

      <div v-for="(record, index) in getOrderedList" :key="index">
        <v-divider></v-divider>
        <div class="content">
          <div v-if="record.title">{{ record.title }}</div>
          <div v-html="record.text"></div>
          <span class="grey--text">{{ formatPostedAt(record) }} | @{{ record.by }}</span>
        </div>
      </div>

    </v-list>
  </div>
</template>

<script>
import Vue from 'vue'
import { timeFromNow } from '../utils.js'

export default {
  name: 'Story',
  components: {},
  data () {
    return {
      id: {
        default: -1,
        type: Number
      },
      loading: false,
      item: {},
      subItems: [],
      orderedIds: []
    }
  },
  computed: {
    getId () { return parseInt(this.id) },
    getKids () { return this.item.kids },
    getOrderedList () {
      let orderedComments = this.subItems.filter(subItem => !subItem.deleted).slice().sort((a, b) => {
        return this.orderedIds.indexOf(a.id) - this.orderedIds.indexOf(b.id)
      })
      return [this.item, ...orderedComments]
    }
  },
  methods: {
    formatPostedAt (item) { return timeFromNow(item.time) },
    onApiComplete (data) {
      console.log(`onApiComplete`)
      this.item = data
      this.$store.dispatch('setAppTitle', { title: this.item.title })
      this.loading = false
      Vue._.each(data.kids, kid => this.orderedIds.push(kid))

      this.walkThroughComments(data)
    },
    walkThroughComments (data) {
      if (data.id !== this.getId) {
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
    setup (id) {
      this.id = id
      this.loading = false
      this.$store.dispatch('syncHWStory', {
        id: this.id,
        callback: this.onApiComplete
      })
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => vm.setup.bind(vm)(to.params.id))
  },
  beforeRouteUpdate (to, from, next) {
    this.setup(to.params.id)
  },
  beforeRouteLeave (to, from, next) {
    this.$store.dispatch('setAppTitle', { title: '' })
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
