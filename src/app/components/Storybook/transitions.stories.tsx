import React from 'react';

import resolveConfig from 'tailwindcss/resolveConfig';
import tailwindConfig from '../../../../tailwind.config.js';
import { Meta } from '@storybook/react';
import { H1, H2 } from '../Heading/index';
import { StorybookSwatch } from './components/StorybookSwatch';
import { StorybookTailwindUsage } from './components/StorybookTailwindUsage';

export default {
  title: 'Design Guide/Transitions',
} as Meta;

const config = resolveConfig(tailwindConfig);

export const Transitions = () => (
  <div>
    <H1>Transitions</H1>
    <H2>Duration</H2>
    <StorybookTailwindUsage
      text="tw-duration-{value}"
      documentationHref="https://tailwindcss.com/docs/transition-duration"
    />
    <div className="tw-flex tw-flex-row tw-flex-wrap tw-mb-12">
      {Object.entries<string>(config.theme.transitionDuration)
        .sort((a, b) => parseInt(a[1]) - parseInt(b[1]))
        .map(([key, value]) => (
          <StorybookSwatch
            label={key}
            value={value}
            className="tw-m-2 tw-bg-gray-4 tw-transform hover:tw-z-50 hover:tw-bg-sov-white hover:tw-scale-125"
            style={{ transitionDuration: value }}
          />
        ))}
    </div>
    <H2>Function</H2>
    <StorybookTailwindUsage
      text="tw-ease-{value}"
      documentationHref="https://tailwindcss.com/docs/transition-timing-function"
    />
    <div className="tw-flex tw-flex-row tw-flex-wrap tw-mb-12">
      {Object.entries<string>(config.theme.transitionTimingFunction)
        .sort((a, b) => parseInt(a[1]) - parseInt(b[1]))
        .map(([key, value]) => (
          <StorybookSwatch
            label={key}
            value={value}
            className="tw-m-2 tw-duration-1000 tw-bg-gray-4 tw-transform hover:tw-z-50 hover:tw-bg-sov-white hover:tw-scale-125"
            style={{ transitionTimingFunction: value }}
          />
        ))}
    </div>
  </div>
);
