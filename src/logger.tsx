export const logger = {
  error: (message: string, error: any) => {
    console.error(
      'Called',
      message.padEnd(20, ' '),
      'Received',
      `${error}`.slice(0, 50),
      `(${new Date().toLocaleString()})`,
    );
  },

  info: (message: string, data: any) => {
    const dataString =
      typeof data === 'object' ? JSON.stringify(data) : data.toString();
    console.info(
      'Called',
      message.padEnd(20, ' '),
      'Received',
      dataString.slice(0, 50),
      `(${new Date().toLocaleString()})`,
    );
  },
};
