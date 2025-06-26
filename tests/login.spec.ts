import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import LoginPage from '~/presentation/pages/login.vue';

describe('LoginPage', () => {
  it('renders login form', () => {
    const wrapper = mount(LoginPage);
    expect(wrapper.text()).toContain('Login');
  });
});
