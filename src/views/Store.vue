<template>
  <div class="store">
    <v-progress-circular v-if="loading" :indeterminate="true"></v-progress-circular>
    <v-list subheader three-line>
      <v-subheader>{{ item.title }}</v-subheader>
      <div class="content">
          <div v-html="item.text"></div>
          <!-- <div>{{ this.getKids }}</div>
          <div>{{ orderedIds }}</div> -->
          <span class="grey--text">@{{ item.by }} | {{ item.id }}</span>
      </div>
      <template v-for="subItem in getOrderedSubItems">
        <v-divider></v-divider>
        <div class="content" >
          <div v-html="subItem.text"></div>
          <span class="grey--text">@{{ subItem.by }} | {{ subItem.id }}</span>
        </div>
      </template>
    </v-list>
  </div>
</template>

<script>
import moment from 'moment'

export default {
  name: 'Store',
  components: {},
  data() {
    return {
      id: -1,
      loading: false,
      item: {},
      subItems: [],
      orderedIds: []
    }
  },
  computed: {
    getPostedAt () { return moment.unix(this.item.time).fromNow()},
    getKids () { return this.item.kids },
    getOrderedSubItems () {
      return this.subItems.slice().sort((a,b) => {
        return this.orderedIds.indexOf(a.id) - this.orderedIds.indexOf(b.id)
      })
    }
  },
  methods: {
    onApiComplete(data) {
      console.log(`onApiComplete`)
      this.item = data
      this.$store.dispatch('setAppTitle', {
        title: this.item.title
      })
      this.loadding = false
      _.each(data.kids, kid => this.orderedIds.push(kid))

      this.walkThroughComments(data)
    },
    walkThroughComments(data) {
      // console.log(`walkThroughComments parent: ${data.parent}`)
      if (data.id != this.id) {
        if (data.kids) {
          console.log(`detect kids (id: ${data.id} parentId: ${data.parent}) kids: ${data.kids}`)
        }
        let index = _.findIndex(this.orderedIds, oid => oid === data.id)
        if (index == -1) {
          let parentIndex = _.findIndex(this.orderedIds, oid => oid === data.parent)
          if (parentIndex == -1) {
              console.log(`bug? parent id not found (id: ${data.id} parentId: ${data.parent}) this.orderedIds: ${this.orderedIds}`)
          } else {
            this.orderedIds.splice(parentIndex + 1, 0, data.id)
          }
        }

        this.subItems.push(data)
        // let index = _.findIndex(this.getKids, kid => { return kid == data.id })
        // this.subItems.push(Object.assign({}, data, { index }))
        // console.log(`index: ${index} kid: ${data.id} getKids:${this.getKids}`)
        // if (index == -1) {
        //   this.subItems.push(data)
        // } else {
        //   this.subItems.splice(index - 1, 0, data)
        // }
      }

      _.each(data.kids, kid => {
        this.$store.dispatch('syncHWStore', {
          id: kid,
          callback: this.walkThroughComments
        })
      })
    },
    syncData(vm) {
      this.loadding = false
      vm.$store.dispatch('syncHWStore', {
        id: this.id,
        callback: this.onApiComplete
      })
    }
  },
  beforeRouteEnter(to, from, next) {
    let id = to.params.id
    if (id) {
      next(vm => {
        vm.id = id
        vm.syncData(vm)
      })
    }
  },
  beforeRouteUpdate(to, from, next) {
    let id = to.params.id
    if (id) {
      this.id = id
      this.syncData(this)
      next()
    }
  },
  beforeRouteLeave(to, from, next) {
    this.$store.dispatch('setAppTitle', {
      title: ''
    })
    next()
  }
}
</script>

<style scoped lang="scss">
  .content {
    padding: 10pt;
    line-height: 1.5;
  }
</style>
