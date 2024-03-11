import React from 'react';
import { render, fireEvent, waitFor, screen, cleanup } from '@testing-library/react';
import NextBtn from '../Buttons/NextBtn';

afterEach(cleanup);

describe('NextBtn component', () => {
  test('renders correctly', async () => {
    render(<NextBtn />);
  
    const button = screen.getByRole('button');
  
    await waitFor(() => {
      expect(button).toBeTruthy(); // Check if the button is rendered
      expect(button.querySelector('svg')).toBeTruthy(); // Check if the icon is rendered
    });
  });
  

  test('calls onClick handler when button is clicked', () => {
    const onClickMock = jest.fn();
    const { getByRole } = render(<NextBtn onClick={onClickMock} />);
    const button = getByRole('button');
    
    fireEvent.click(button);
    
    expect(onClickMock).toHaveBeenCalledTimes(1);
  });
});
