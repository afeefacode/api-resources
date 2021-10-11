<template>
  <edit-form v-bind="$attrs">
    <template #fields>
      <form-field-text
        name="name"
        label="Name"
      />
    </template>
  </edit-form>
</template>
