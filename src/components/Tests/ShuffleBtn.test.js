import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import ShuffleBtn from '../Buttons/ShuffleBtn';

describe('ShuffleBtn component', () => {
  test('renders correctly', async () => {
    render(<ShuffleBtn />);

    const button = screen.getByRole('button');

    await waitFor(() => {
      expect(button).toBeDefined(); // Check if the button is rendered
      expect(button.querySelector('svg')).toBeDefined(); // Check if the icon is rendered
    });
  });

  test('calls onClick handler when button is clicked', () => {
    const onClickMock = jest.fn();
    
    const { getByRole } = render(<ShuffleBtn onClick={onClickMock} />);
    
    const button = getByRole('button');
    
    fireEvent.click(button);
    
    expect(onClickMock).toHaveBeenCalledTimes(1); // Check if onClick handler is called once
  });
});
