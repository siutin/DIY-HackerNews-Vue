<template>
  <v-app>
    <v-toolbar
      app
      :dark="toggleTheme"
    >
      <v-menu :nudge-width="100">
       <v-toolbar-title slot="activator">
         <span>All</span>
         <v-icon>arrow_drop_down</v-icon>
       </v-toolbar-title>

       <v-list>
         <v-list-tile
           v-for="item in items"
           :key="item"
         >
           <v-list-tile-title v-text="item"></v-list-tile-title>
         </v-list-tile>
       </v-list>
     </v-menu>
     <v-spacer></v-spacer>
      <v-toolbar-title>{{ getTitle }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon>
         <v-icon>favorite</v-icon>
       </v-btn>
       <v-btn icon>
         <v-icon>more_vert</v-icon>
       </v-btn>
    </v-toolbar>
    <v-content>
      <router-view/>
    </v-content>
  </v-app>
</template>

<script>

export default {
  name: 'App',
  data () {
    return {
      toggleTheme: false,
      items: [
        'News', 'Threads', 'Comments', 'Show', 'Ask', 'Jobs'
      ],
      title: 'Hacker News'
    }
  },
  computed: {
    getTitle () { return this.$store.getters.getTitle || this.title }
  }
}
</script>
