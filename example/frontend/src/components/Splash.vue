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
          :width="5"
          indeterminate
          color="#999999"
        />

        <div class="ml-4">
          Lade App
        </div>
      </v-row>
    </v-container>
  </v-app>
</template>
