<template>
  <v-card>
    <v-progress-linear v-if="_.isEmpty(item)" :indeterminate="true"></v-progress-linear>

    <v-card-title v-else primary-title>
      <div class="headline">{{ index }} {{ id }} {{ maxScrolledPage }} {{ maxRowsPerPage }}</div>

      </v-card-title>
  </v-card>
</template>

<script>

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
  created () {
    console.log(`RowItem - created`)
  }
}
</script>
