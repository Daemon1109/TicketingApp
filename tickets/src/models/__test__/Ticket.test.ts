import { Ticket } from '../Ticket';

it('implements optimistic concurrency control', async () => {
  // Create a ticket
  const ticket = Ticket.build({
    title: 'Test Title',
    price: 10.0,
    userId: '123',
  });

  // Save the ticket
  await ticket.save();

  // fetch the ticket twice
  const firstInstance = await Ticket.findById(ticket.id);
  const secondInstance = await Ticket.findById(ticket.id);

  // make seperate changes to both instances
  firstInstance!.set({ price: 20.0 });
  secondInstance!.set({ price: 30.0 });

  // save first instance
  await firstInstance!.save();

  // make two seperate changes to tickets fetched
  try {
    await secondInstance!.save();
  } catch (error) {
    return;
  }

  throw new Error('Test should not reach to this point!');
});

it('should increment the version number by 1 on update', async () => {
  // Create a ticket
  const ticket = Ticket.build({
    title: 'Test Title',
    price: 10.0,
    userId: '123',
  });

  await ticket.save();
  // Expect the version to be 0
  expect(ticket.version).toEqual(0);
  await ticket.save();
  // Expect the version to be 1
  expect(ticket.version).toEqual(1);
  await ticket.save();
  // Expect the version to be 2
  expect(ticket.version).toEqual(2);
});
