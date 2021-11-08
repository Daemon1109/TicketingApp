import axios, { AxiosRequestHeaders } from 'axios';
import type { NextPageContext } from 'next';

const buildAxiosClient = ({ req }: NextPageContext) => {
  const headers = req ? (req.headers as AxiosRequestHeaders) : {};

  if (typeof window === 'undefined') {
    return axios.create({
      baseURL:
        'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
      headers: headers,
    });
  } else {
    return axios.create({
      baseURL: '/',
    });
  }
};

export default buildAxiosClient;
