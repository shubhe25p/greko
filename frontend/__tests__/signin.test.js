import React from 'react';
import { render, fireEvent, queryByText, waitFor } from '@testing-library/react';
import SignIn from '../src/components/SignIn';
import {BrowserRouter as Router} from 'react-router-dom';
import { jest } from 'jest';
import expect from 'jest';
// jest.mock("axios");

describe('SignIn', () => {
    it('should render a form with username and password inputs',async () => {
      const { getByTestId, queryAllByRole, getByText } = render(<Router><SignIn/></Router>);
      const inputs = queryAllByRole('textbox');
      const submit = getByText('Sign In');
      inputs.forEach(input => {
        fireEvent.change(input, { target: { value: 'test'} });
      })

      
    //   const UserResponse = {token: 'user_token'}

    //   jest.spyOn(window, 'fetch').mockImplementationOnce(() => {
    //     return Promise.resolve({
    //       json: () => Promise.resolve(UserResponse),
    //     })
    //   });

    //   await act (async () => {
    //   fireEvent.submit(getByTestId('form'))
    // });
      // await waitFor(() => expect(axios.post).toHaveBeenCalledTimes(1));

      // expect(axios.post).toHaveBeenCalledWith(
      //   'api/signin',
      //   {
      //     username: 'test',
      //     password: 'test',
      //   },
      // );
      expect(submit).toBeInDocument();

      
  });


});
