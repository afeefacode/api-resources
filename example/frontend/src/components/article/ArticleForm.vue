<template>
  <edit-form v-bind="$attrs">
    <template #fields>
      <form-field-text
        name="title"
        label="Titel"
      />

      <form-field-text
        name="summary"
        label="Kurzbeschreibung"
      />

      <form-field-text
        name="content"
        label="Text"
      />
    </template>
  </edit-form>
</template>
