<template>
  <edit-form v-bind="$attrs">
    <template #fields>
      <form-field-search-select
        name="author"
        label="Autor"
      />

      <form-field-text
        name="title"
        label="Titel"
      />
    </template>
  </edit-form>
</template>
