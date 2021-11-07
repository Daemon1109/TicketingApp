import axios, { Method } from 'axios';
import { useState } from 'react';
import { ErrorResponse } from '../modals/ErrorResponse';

interface useRequestArguments {
  url: string;
  method: Method;
  body?: any;
  onSuccess?: () => void;
}

const useRequest = ({ url, method, body, onSuccess }: useRequestArguments) => {
  const [errors, setErrors] = useState<ErrorResponse>();

  const doRequest = async () => {
    try {
      const response = await axios({ method, url, data: body });

      if (onSuccess) {
        onSuccess();
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
