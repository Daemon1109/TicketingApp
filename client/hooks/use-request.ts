import axios, { AxiosResponse, Method } from 'axios';
import { useState } from 'react';
import { ErrorResponse } from '../modals/ErrorResponse';

interface useRequestArguments {
  url: string;
  method: Method;
  body?: any;
  onSuccess?: (data: AxiosResponse['data']) => void;
}

const useRequest = ({ url, method, body, onSuccess }: useRequestArguments) => {
  const [errors, setErrors] = useState<ErrorResponse>();

  const doRequest = async (props = {}) => {
    try {
      const response = await axios({
        method,
        url,
        data: { ...body, ...props },
      });

      if (onSuccess) {
        onSuccess(response.data);
      }

      setErrors(undefined);

      return response.data;
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        const errorResponse = err.response.data as ErrorResponse;
        setErrors(errorResponse);
      }
    }
  };

  return { doRequest, errors };
};

export { useRequest };
