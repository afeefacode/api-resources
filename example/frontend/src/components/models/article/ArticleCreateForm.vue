<template>
  <edit-form v-bind="$attrs">
    <template #fields>
      <form-field
        type="varchar"
        name="title"
      />
    </template>
  </edit-form>
</template>
