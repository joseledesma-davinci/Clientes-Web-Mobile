<script>
export default {
  name: 'UserAvatar',
  props: {
    name: { type: String, default: 'G' },
    avatarUrl: { type: String, default: null },
    size: { type: String, default: 'md' },
  },
  computed: {
    initials() {
      return (this.name ?? 'G')?.charAt?.(0)?.toUpperCase?.() ?? 'G';
    },
    sizeClasses() {
      const sizes = {
        sm: 'w-8 h-8 text-sm',
        md: 'w-10 h-10 text-base',
        lg: 'w-16 h-16 text-2xl',
        xl: 'w-24 h-24 text-4xl',
      };
      return sizes[this.size] ?? sizes.md;
    },
  },
}
</script>

<template>
  <div
    class="rounded-full flex items-center justify-center font-heading font-bold
      bg-gradient-to-br from-neon-purple to-neon-cyan text-white
      shadow-[0_0_10px_rgba(168,85,247,0.3)] flex-shrink-0"
    :class="sizeClasses"
  >
    <img
      v-if="avatarUrl"
      :src="avatarUrl"
      :alt="name"
      class="w-full h-full rounded-full object-cover"
    />
    <span v-else>{{ initials }}</span>
  </div>
</template>
