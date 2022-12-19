import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Calendar from '../src/components/calendar';
import {BrowserRouter as Router} from 'react-router-dom';

describe('Calendar', () => {
    it('should render a form inputs', () => {
      const { queryAllByRole } = render(<Router><Calendar /></Router>);
      const inputs = queryAllByRole('textbox');

      inputs.forEach(input => {
        fireEvent.change(input, { target: { value: 'test'} });
      })
      
  })

});
