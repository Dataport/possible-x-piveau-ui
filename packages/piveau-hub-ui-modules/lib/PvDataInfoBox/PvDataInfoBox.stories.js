import PvDataInfoBox from './PvDataInfoBox.vue';

// More on default export: https://storybook.js.org/docs/vue/writing-stories/introduction#default-export
export default {
  title: 'PvDataInfoBox',
  component: PvDataInfoBox,
  // More on argTypes: https://storybook.js.org/docs/vue/api/argtypes
  argTypes: {
    // backgroundColor: { control: 'color' },
    // size: {
    //   control: { type: 'select' },
    //   options: ['small', 'medium', 'large'],
    // },
  },
};

const standardProps = {
  catalog: false,
  dataset: {
    title: 'Dataset title',
    description: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.',
    catalog: 'data.gov.uk',
    formats: ['PDF', 'HTML', 'RDF', 'TXT', 'ZIP', 'API', 'TURTLE'],
  },
};

// More on component templates: https://storybook.js.org/docs/vue/writing-stories/introduction#using-args
// const Template = (args, { argTypes }) => ({
//   props: Object.keys(argTypes),
//   components: { DataInfoBox },
//   template: '<data-info-box v-bind="$props" />',
// });

const Template = (args) => ({
  components: { PvDataInfoBox },
  setup() {
    // The args will now be passed down to the template
    return { args };
  },
  template: '<PvDataInfoBox v-bind="args" />',
});

export const Primary = Template.bind({});
// More on args: https://storybook.js.org/docs/vue/writing-stories/args
Primary.args = {
  ...standardProps,
  msg: 'Hello World!',
  title: 'The title',
  description: 'The description',
};

export const Secondary = Template.bind({});
Secondary.args = {
  ...standardProps,
  msg: 'Hello World!',
};

export const Slot = (args) => ({
  components: { PvDataInfoBox },
  setup() {
    return { args };
  },
  template: '<DataInfoBox v-bind="args" ><h1>Slot content</h1></DataInfoBox>',
});
Slot.args = {
  ...standardProps,
};
