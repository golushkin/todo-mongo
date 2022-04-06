class DbHelper {
  static client = null;

  static async connect() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const client = {};
        DbHelper.client = client;
        resolve(client);
      }, 0);
    });
  }

  static getClient() {
    return DbHelper.client;
  }
}

export default DbHelper;
