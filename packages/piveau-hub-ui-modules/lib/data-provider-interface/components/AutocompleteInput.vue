<script setup>
import { ref } from 'vue';
import { createInput } from '@formkit/vue';
import { useStore } from 'vuex';
import { getTranslationFor } from "../../utils/helpers";

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
            class: 'autocompleteInputSingleValue',
          },
          children: [
            {
              $el: 'a',
              attrs: {
                value: '$value.resource'
              },
              children: '$value.name'
            }
          ]
        },
        {
          $el: 'div',
          attrs: {
            class: 'removeX'
          },

        }
      ],
      else: [
        {
          $el: 'input',
          bind: '$attrs',
          attrs: {
            id: '$id',
            onClick: '$handlers.toggleList',
            onKeydown: '$handlers.selection',
            onInput: '$handlers.search',
            value: '$searchValue',
            class: 'autocompleteInputfield',

          },
        },
        {
          $el: 'ul',
          attrs: { class: 'autocompleteResultList inactiveResultList' },
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
              },
              children: [
                {
                  $el: 'a',
                  attrs: {
                    href: '$match.resource'
                  },
                  children: '$match.name'
                }
              ]
            },
          ],
        },
      ]
    }
  ],
  {
    props: ['options', 'matches', 'selection', 'searchValue', 'context'],
    features: [addHandlers],
    family: 'group'
  }
)

const store = useStore();

function addHandlers(node) {
  node.on('created', () => {
    // Ensure our matches prop starts as an array.
    node.props.matches = [{ 'name': '-- Please choose a property or search for them in the vocabulary --' }];
    node.props.selection = {};

    // When we actually have an value to set:
    const setValue = async (e) => {
      if (e && typeof e.preventDefault === 'function') e.preventDefault();
      node.props.selection = {name: e.target.textContent, resouce: e.target.href};
      await node.input(node.props.selection);
      node.props.selection = {};
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

    const getAutocompleteSuggestions = async () => {

      // this.choice = true
      let voc = node.props.context.attrs.voc;
      let text = node.props.searchValue;

      // this.clearAutocompleteSuggestions();

      await store.dispatch('dpiStore/requestAutocompleteSuggestions', { voc: voc, text: text }).then((response) => {

        const results = response.data.result.results.map((r) => ({
          name: getTranslationFor(r.pref_label, 'en', []) + " (" + r.id + ")",
          resource: r.resource,
        }));

        node.props.matches = results;
      });

    }

    Object.assign(node.context.handlers, {
      setValue,
      getAutocompleteSuggestions,
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
      toggleList(e) {
        e.target.nextSibling.classList.toggle('inactiveResultList');
      },
    })
  })

  // Perform filtering when the search value changes
  node.on('prop:searchValue', async ({ payload: value }) => {
    node.context.handlers.getAutocompleteSuggestions();
  })
}
</script>

<template>
  <FormKit :type="auto"/>
</template>
