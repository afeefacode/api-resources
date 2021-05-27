<template>
  <edit-form v-bind="$attrs">
    <template #fields>
      <form-field name="title" />

      <form-field name="summary" />

      <form-field name="content" />
    </template>
  </edit-form>
</template>
