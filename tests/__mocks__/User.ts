const mockUsers = [
    {
      id: 1,
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123', // You should hash passwords in real scenarios
    },
  ];
  
  export default {
    create: jest.fn(async (data) => {
      const newUser = { ...data, id: mockUsers.length + 1 };
      mockUsers.push(newUser);
      return newUser;
    }),
    findOne: jest.fn(async ({ where: { email } }) => {
      return mockUsers.find(user => user.email === email) || null;
    }),
  };