import React from 'react';
import { render, fireEvent, waitFor, screen, cleanup } from '@testing-library/react';
import PlayPauseBtn from '../Buttons/PlayPauseBtn';

afterEach(cleanup);

describe('PlayPauseBtn component', () => {
  test('renders correctly', async () => {
    render(<PlayPauseBtn />);

    const button = screen.getByRole('button');

    await waitFor(() => {
      expect(button).toBeTruthy(); // Check if the button is rendered
      expect(button.querySelector('svg')).toBeTruthy(); // Check if the icon is rendered
    });
  });

  test('calls onClick handler when button is clicked', () => {
    const onClickMock = jest.fn();
    
    const { getByRole } = render(<PlayPauseBtn onClick={onClickMock} />);
    
    const button = getByRole('button');
    
    fireEvent.click(button);
    
    expect(onClickMock).toHaveBeenCalledTimes(1); // Check if onClick handler is called once
  });
});
