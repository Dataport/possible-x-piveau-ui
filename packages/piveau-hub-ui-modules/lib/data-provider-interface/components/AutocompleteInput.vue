<script setup>
import { ref, reactive } from 'vue';
import { createInput } from '@formkit/vue';
import { useStore } from 'vuex';
import { getTranslationFor } from "../../utils/helpers";
import { reset } from '@formkit/core'

const auto = createInput(
  [
    {
      if: '$value && $isMulti != true',
      then: [
        {
          $el: 'a',
          attrs: {
            id: '$id',
            // href: '$value.resource',
            class: 'autocompleteInputSingleValue',
            // onClick: '$handlers.setValue',
          },
          children: '$value.name'
        },
        {
          $el: 'div',
          attrs: {
            class: 'removeX',
            onclick: '$handlers.removeProperty'
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

                lang: '$match.resource',
                class: 'p-2 border-b border-gray-200 data-[selected=true]:bg-blue-100',
                onClick: '$handlers.setValue',
              },

              children: '$match.name'
            },
          ],
        },
        {
          $el: 'div',
          children: [
            {
              if: '$isMulti',
              then: [{
                for: ['v', '$value'],
                $el: 'span',
                children: "$v.name"
              }

              ]

            }
          ]

        }

      ],

    }
  ],
  {
    props: ['options', 'matches', 'selection', 'searchValue', 'context', 'listValue', 'isMulti'],
    features: [addHandlers],
    family: 'group'
  }
)

const store = useStore();
let listOfValues = [];

function addHandlers(node) {
  node.on('created', () => {

    // Ensure our matches prop starts as an array.
    node.props.matches = [{ 'name': '-- Please choose a property or search for them in the vocabulary --' }];
    node.props.selection = {};
    node.props.isMulti = node.context.context.attrs.multiple;

    const setValue = async (e) => {
      console.log(node);
      // when its a multi input
      if (node.props.isMulti) {
        node.props.selection = { name: e.target.innerText, resource: e.target.lang };
        if (node.value != undefined) {
          listOfValues.push(node.props.selection)
          node.props.selection = listOfValues
          // console.log(listOfValues);
          // node.value = listOfValues;
          await node.input(node.props.selection);
        }
        else await node.input(node.props.selection);

        // await node.input(node.props.selection);

      }
      else {
        node.props.selection = { name: e.target.innerText, resource: e.target.lang };
        await node.input(node.props.selection);
      }


      // sets the name for the store Key of the Object - also prevents the property from beeing loaded
      // node.name = node.context.context.attrs.identifier



      console.log(node);
      node.props.selection = {};
      node.props.searchValue = '';

      console.log(node.props.id, e.target);

      // ??? What is this?
      // await new Promise((r) => setTimeout(r, 50)) // "next tick"
      // if (document.querySelector('input#' + node.props.id)) {
      //   console.log(node.props.id);
      //   document.querySelector('input#' + node.props.id).focus();
      // }
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
      // addValue,
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
      removeProperty(e) {
        node.reset()

        console.log(node);

      }
    })
  })

  // Perform filtering when the search value changes
  node.on('prop:searchValue', async ({ payload: value }) => {
    node.context.handlers.getAutocompleteSuggestions();
  })
}
</script>

<template>
  <FormKit :type="auto" />
</template>
