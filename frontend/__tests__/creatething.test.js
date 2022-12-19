import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import CreateThing from '../src/components/thing/createThing';
import {BrowserRouter as Router} from 'react-router-dom';

describe('CreateThing', () => {
    it('should render a form with username, email and password inputs', () => {
      const { queryAllByRole } = render(<Router><CreateThing /></Router>);
      const inputs = queryAllByRole('textbox');

      inputs.forEach(input => {
        fireEvent.change(input, { target: { value: 'test'} });
      })
      
  })

});
