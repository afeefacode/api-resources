<template>
  <v-app>
    <v-container
      fill-height
      fluid
      class="pb-16 d-flex align-center"
    >
      <v-row
        align="center"
        justify="center"
      >
        <v-progress-circular
          :size="45"
          :width="6"
          indeterminate
          color="green"
        />

        <div class="ml-4">
          Lade App
        </div>
      </v-row>
    </v-container>
  </v-app>
</template>
