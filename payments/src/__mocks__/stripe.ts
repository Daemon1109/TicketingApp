export const stripe = {
  charges: {
    create: jest.fn().mockResolvedValue({ id: 'ascacwsda' }), // Return a mock stripe id
  },
};
