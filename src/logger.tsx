const print_info = false;
const print_error = true;

export const logger = {
  error: (message: string, error: any) => {
    if (print_error) {
      console.error(
        'Called',
        message.padEnd(20, ' '),
        'Received',
        `${error}`.slice(0, 50),
        `(${new Date().toLocaleString()})`,
      );
    }
  },

  info: (message: string, data: any) => {
    if (print_info) {
      const dataString =
        typeof data === 'object' ? JSON.stringify(data) : data.toString();
      console.info(
        'Called',
        message.padEnd(20, ' '),
        'Received',
        dataString.slice(0, 50),
        `(${new Date().toLocaleString()})`,
      );
    }
  },
};
