<template>
  <v-card>
    <v-progress-linear v-if="_.isEmpty(item)" :indeterminate="true"></v-progress-linear>

    <v-card-title v-else primary-title>
      <div>
        <div class="headline">{{ item.title }}</div>
        <span class="grey--text">{{ getPostedAt }} | {{ item.by }}</span>
      </div>
      </v-card-title>
  </v-card>
</template>

<script>
import moment from 'moment'

export default {
  name: 'RowItem',
  props: {
    index: Number,
    id: Number,
    maxScrolledPage: Number,
    maxRowsPerPage: Number
  },
  data () {
    return {
      item: {}
    }
  },
  computed: {
    getPostedAt () {
      return moment.unix(this.item.time).fromNow()
    }
  },
  methods: {
    onApiComplete (data) {
      console.log(`onApiComplete - id: ${this.id}`)
      this.item = data
    }
  },
  created () {
    console.log(`RowItem - created`)
    this.$store.dispatch('syncHWStore', { id: this.id, callback: this.onApiComplete })
  }
}
</script>
