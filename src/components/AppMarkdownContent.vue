/**
 * A component that renders sanitized Markdown formatted text.
 */

<template>
  <div class="markdown-container">

    <!-- Prepend content here -->
    <slot name="before" />

    <!-- This slot provides for further customization using interpreted content -->
    <slot :html="interpretedMarkdownText">
      <component
        :is="tag"
        class="markdown-content"
        v-html="interpretedMarkdownText"
      />
    </slot>

    <!-- Append content here -->
    <slot name="after" />

  </div>
</template>

<script>
// For Markdown into HTML
import { marked } from 'marked';
// For sanitizing HTML to prevent vulnerabilities
import DOMPurify from 'dompurify';

// Set DOMPurify configuration.
// Note: don't refactor this code into any lifecycle hook since this will cause
// the configuration code each time this component is rendered.

// General settings
DOMPurify.setConfig({
  // By using HTML profile, forbid SVG and MathML
  USE_PROFILES: { html: true },
  FORBID_TAGS: ['img'],
  FORBID_ATTR: ['style', 'class'],
});

// Add a hook to transform every <h1> into <h2>
DOMPurify.addHook('uponSanitizeElement', (node) => {
  const { tagName } = node;
  if (tagName && tagName.toLowerCase() === 'h1') {
    const h2 = document.createElement('h2');
    h2.innerHTML = node.innerHTML;

    node.parentNode.replaceChild(h2, node);
  }
});

// Add a hook to make all links open a new window
DOMPurify.addHook('afterSanitizeAttributes', (node) => {
  // set all elements owning target to target=_blank
  if ('target' in node) {
    node.setAttribute('target', '_blank');
    // prevent https://www.owasp.org/index.php/Reverse_Tabnabbing
    node.setAttribute('rel', 'noopener noreferrer');
  }
  // set non-HTML/MathML links to xlink:show=new
  if (!node.hasAttribute('target')
        && (node.hasAttribute('xlink:href')
            || node.hasAttribute('href'))) {
    node.setAttribute('xlink:show', 'new');
  }
});

export default {
  name: 'AppMarkdownContent',
  props: {
    /**
     * Tag of resulting markdown content container
     */
    tag: {
      type: String,
      default: 'div',
    },
    /**
     * Input text to be interpreted
     */
    text: {
      type: String,
      default: '',
    },
  },
  computed: {
    interpretedMarkdownText() {
      return DOMPurify.sanitize(
        marked.parse(this.text.trim(), { smartLists: true }),
      );
    },
  },
};
</script>

<style scoped>

.markdown-container {
  word-wrap: break-word;
}

</style>
