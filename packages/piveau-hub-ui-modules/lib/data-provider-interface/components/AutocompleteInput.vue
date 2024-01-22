<script setup>
import { ref } from 'vue'
import { createInput } from '@formkit/vue'
import { generateCodeFrame } from 'vue/compiler-sfc'

const auto = createInput(
  [
    {
      if: '$value',
      then: [
        {
          $el: 'a',
          attrs: {
            id: '$id',
            href: '#',
            onClick: '$handlers.setValue',
          },
          children: '$value',
        },
      ],
      else: [
        {
          $el: 'input',
          bind: '$attrs',
          attrs: {
            id: '$id',
            onKeydown: '$handlers.selection',
            onInput: '$handlers.search',
            value: '$searchValue',
          },
        },
        {
          $el: 'ul',
          if: '$matches.length < $options.length',
          children: [
            {
              $el: 'li',
              for: ['match', '$matches'],    
              attrs: {
                'data-selected': {
                  if: '$selection === $match',
                  then: 'true',
                  else: 'false',
                },
                class: 'p-2 border-b border-gray-200 data-[selected=true]:bg-blue-100',
                onClick: '$handlers.setValue',
                onMouseenter: '$handlers.hover',
                onMouseleave: '$handlers.unhover',
              },                 
              children: '$match',
            },
          ],
        },
      ]
    }
  ],
  {
    props: ['options', 'matches', 'selection', 'searchValue'],
    features: [addHandlers],
    family: 'text',
  }
)

function addHandlers(node) {
  node.on('created', () => {
    // Ensure our matches prop starts as an array.
    node.props.matches = [];
    node.props.selection = '';
    node.props.options = ['hi', 'test', 'value', 'value2', 'value3'];

    // When we actually have an value to set:
    const setValue = async (e) => {
      if (e && typeof e.preventDefault === 'function') e.preventDefault();
      await node.input(node.props.selection);
      node.props.selection = '';
      node.props.searchValue = '';
      await new Promise((r) => setTimeout(r, 50)) // "next tick"
      if (document.querySelector('input#' + node.props.id)) {
        document.querySelector('input#' + node.props.id).focus();
      }
    }

    // Perform a soft selection, this is shown as a highlight in the dropdown
    const select = (delta) => {
      const available = node.props.matches
      let idx = available.indexOf(node.props.selection) + delta
      if (idx >= available.length) {
        idx = 0
      } else if (idx < 0) {
        idx = available.length - 1
      }
      node.props.selection = available[idx]
    }

    // Add some new "handlers" for our autocomplete. The handlers object is
    // just a conventionally good place to put event handlers. Auto complete
    // inputs always have to deal with lots of keyboard events, so that logic
    // is registered here.
    Object.assign(node.context.handlers, {
      setValue,
      selection: (e) => {
        // This handler is called when entering data into the search input.
        switch (e.key) {
          case 'Enter':
            return setValue()
          case 'ArrowDown':
            e.preventDefault();
            return select(1)
          case 'ArrowUp':
            e.preventDefault();
            return select(-1)
        }
      },
      search(e) {
        node.props.searchValue = e.target.value;
      },
      hover: (e) => {
        node.props.selection = e.target.textContent;
      },
      unhover: (e) => {
        if (e.target.textContent === node.props.selection) {
          node.props.selection = '';
        }
      },
    })
  })

  // Perform filtering when the search value changes
  node.on('prop:searchValue', ({ payload: value }) => {
    const results = node.props.options.filter((option) =>
      option.toLowerCase().startsWith(value.toLowerCase())
    )
    if (!results.length) results.push('No matches')
    node.props.matches = results;
  })
}
</script>

<template>
  <FormKit :type="auto"/>
</template>
