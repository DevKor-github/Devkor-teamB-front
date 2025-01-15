export const logger = {
  error: (message: string, error: any) => {
    console.error(
      'Called',
      message.padEnd(25, ' '),
      'Received',
      `${error}`,
      `(${new Date().toLocaleString()})`,
    );
  },

  info: (message: string, data: any) => {
    const dataString =
      typeof data === 'object' ? JSON.stringify(data) : data.toString();
    console.info(
      'Called',
      message.padEnd(25, ' '),
      'Received',
      dataString.slice(0, 100),
      `(${new Date().toLocaleString()})`,
    );
  },
};
