import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Register from '../src/components/register';
import {BrowserRouter as Router} from 'react-router-dom';

describe('Register', () => {
    it('should render a form with username, email and password inputs', () => {
      const { queryAllByRole } = render(<Register />);
      const inputs = queryAllByRole('textbox');

      inputs.forEach(input => {
        fireEvent.change(input, { target: { value: 'test'} });
      })
      
  })

});
